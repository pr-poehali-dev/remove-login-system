"""
Business: Process user donations and check payment status
Args: event with httpMethod, body (amount), headers (X-Auth-Token); context with request_id
Returns: HTTP response with donation status
"""
import json
import os
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    auth_token = event.get('headers', {}).get('X-Auth-Token')
    if not auth_token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Authentication required'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute(
        """
        SELECT u.id
        FROM users u
        JOIN sessions s ON u.id = s.user_id
        WHERE s.token = %s AND s.expires_at > NOW()
        """,
        (auth_token,)
    )
    user_session = cursor.fetchone()
    
    if not user_session:
        cursor.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Invalid or expired token'})
        }
    
    user_id = user_session['id']
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        amount = body_data.get('amount', 0)
        
        if not isinstance(amount, (int, float)) or amount <= 0:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid amount'})
            }
        
        cursor.execute(
            "INSERT INTO donations (user_id, amount, status) VALUES (%s, %s, 'completed') RETURNING id, amount, status, created_at",
            (user_id, amount)
        )
        donation = cursor.fetchone()
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'donation': {
                    'id': donation['id'],
                    'amount': float(donation['amount']),
                    'status': donation['status'],
                    'created_at': donation['created_at'].isoformat()
                }
            })
        }
    
    elif method == 'GET':
        cursor.execute(
            """
            SELECT id, amount, status, created_at
            FROM donations
            WHERE user_id = %s
            ORDER BY created_at DESC
            """,
            (user_id,)
        )
        donations = cursor.fetchall()
        
        cursor.execute(
            "SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE user_id = %s AND status = 'completed'",
            (user_id,)
        )
        total_result = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'donations': [
                    {
                        'id': d['id'],
                        'amount': float(d['amount']),
                        'status': d['status'],
                        'created_at': d['created_at'].isoformat()
                    }
                    for d in donations
                ],
                'total': float(total_result['total']),
                'has_donated': float(total_result['total']) > 0
            })
        }
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
