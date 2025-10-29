"""
Business: Manage email subscriptions for users (subscribe/unsubscribe from notifications)
Args: event with httpMethod, body (email, action, token); context with request_id
Returns: HTTP response with subscription status
"""
import json
import os
import secrets
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor


def generate_unsubscribe_token() -> str:
    return secrets.token_urlsafe(48)


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
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'subscribe':
            email = body_data.get('email', '').strip()
            
            if not email:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Email is required'})
                }
            
            cursor.execute(
                "SELECT id FROM t_p68014762_remove_login_system.users WHERE email = %s",
                (email,)
            )
            user = cursor.fetchone()
            
            if not user:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'User not found'})
                }
            
            unsubscribe_token = generate_unsubscribe_token()
            
            cursor.execute(
                """UPDATE t_p68014762_remove_login_system.users 
                   SET subscribed_to_updates = TRUE, unsubscribe_token = %s 
                   WHERE email = %s""",
                (unsubscribe_token, email)
            )
            conn.commit()
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'message': 'Successfully subscribed to updates',
                    'subscribed': True
                })
            }
        
        elif action == 'unsubscribe':
            token = body_data.get('token', '').strip()
            email = body_data.get('email', '').strip()
            
            if not token and not email:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Token or email is required'})
                }
            
            if token:
                cursor.execute(
                    """UPDATE t_p68014762_remove_login_system.users 
                       SET subscribed_to_updates = FALSE 
                       WHERE unsubscribe_token = %s""",
                    (token,)
                )
            else:
                cursor.execute(
                    """UPDATE t_p68014762_remove_login_system.users 
                       SET subscribed_to_updates = FALSE 
                       WHERE email = %s""",
                    (email,)
                )
            
            conn.commit()
            
            if cursor.rowcount == 0:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Subscription not found'})
                }
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'message': 'Successfully unsubscribed from updates',
                    'subscribed': False
                })
            }
        
        elif action == 'status':
            email = body_data.get('email', '').strip()
            
            if not email:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Email is required'})
                }
            
            cursor.execute(
                """SELECT subscribed_to_updates, unsubscribe_token 
                   FROM t_p68014762_remove_login_system.users 
                   WHERE email = %s""",
                (email,)
            )
            user = cursor.fetchone()
            
            cursor.close()
            conn.close()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'User not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'subscribed': user['subscribed_to_updates'] or False,
                    'unsubscribe_token': user['unsubscribe_token']
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
