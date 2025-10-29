"""
Business: User registration and authentication endpoint
Args: event with httpMethod, body (email, password); context with request_id
Returns: HTTP response with user data or error
"""
import json
import hashlib
import secrets
import os
from datetime import datetime, timedelta
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def generate_token() -> str:
    return secrets.token_urlsafe(32)


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
        
        if action == 'register':
            email = body_data.get('email', '').strip()
            password = body_data.get('password', '').strip()
            
            if not email or not password:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Email and password are required'})
                }
            
            if len(password) < 6:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Password must be at least 6 characters'})
                }
            
            if email.lower() == password.lower():
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Email and password must be different'})
                }
            
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            existing_user = cursor.fetchone()
            
            if existing_user:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'User with this email already exists'})
                }
            
            password_hash = hash_password(password)
            cursor.execute(
                "INSERT INTO users (email, password_hash) VALUES (%s, %s) RETURNING id, email, created_at",
                (email, password_hash)
            )
            user = cursor.fetchone()
            conn.commit()
            
            token = generate_token()
            expires_at = datetime.now() + timedelta(days=30)
            cursor.execute(
                "INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user['id'], token, expires_at)
            )
            conn.commit()
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'created_at': user['created_at'].isoformat()
                    },
                    'token': token
                })
            }
        
        elif action == 'login':
            email = body_data.get('email', '').strip()
            password = body_data.get('password', '').strip()
            
            if not email or not password:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Email and password are required'})
                }
            
            password_hash = hash_password(password)
            cursor.execute(
                "SELECT id, email, created_at FROM users WHERE email = %s AND password_hash = %s",
                (email, password_hash)
            )
            user = cursor.fetchone()
            
            if not user:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Invalid email or password'})
                }
            
            token = generate_token()
            expires_at = datetime.now() + timedelta(days=30)
            cursor.execute(
                "INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user['id'], token, expires_at)
            )
            conn.commit()
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'created_at': user['created_at'].isoformat()
                    },
                    'token': token
                })
            }
    
    elif method == 'GET':
        auth_token = event.get('headers', {}).get('X-Auth-Token')
        
        if not auth_token:
            cursor.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Authentication required'})
            }
        
        cursor.execute(
            """
            SELECT u.id, u.email, u.created_at, s.expires_at
            FROM users u
            JOIN sessions s ON u.id = s.user_id
            WHERE s.token = %s AND s.expires_at > NOW()
            """,
            (auth_token,)
        )
        user_session = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not user_session:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid or expired token'})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'user': {
                    'id': user_session['id'],
                    'email': user_session['email'],
                    'created_at': user_session['created_at'].isoformat()
                }
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
