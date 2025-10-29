"""
Business: User registration and authentication endpoint
Args: event with httpMethod, body (email, password); context with request_id
Returns: HTTP response with user data or error
"""
import json
import hashlib
import secrets
import os
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def generate_token() -> str:
    return secrets.token_urlsafe(32)


def generate_verification_code() -> str:
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])


def send_verification_email(email: str, code: str) -> bool:
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    sender_email = 'ruprojectgames@gmail.com'
    
    if not all([smtp_host, smtp_user, smtp_password]):
        return False
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Код подтверждения регистрации'
    msg['From'] = sender_email
    msg['To'] = email
    
    text = f'Ваш код подтверждения: {code}\n\nКод действителен 10 минут.'
    html = f'''
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Подтверждение регистрации</h2>
        <p>Ваш код подтверждения:</p>
        <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px;">{code}</h1>
        <p style="color: #666;">Код действителен 10 минут.</p>
      </body>
    </html>
    '''
    
    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')
    msg.attach(part1)
    msg.attach(part2)
    
    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f'Email send error: {e}')
        return False


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
            
            cursor.execute("SELECT id FROM t_p68014762_remove_login_system.users WHERE email = %s", (email,))
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
            
            verification_code = generate_verification_code()
            code_expires = datetime.now() + timedelta(minutes=10)
            password_hash = hash_password(password)
            unsubscribe_token = secrets.token_urlsafe(48)
            
            cursor.execute(
                """INSERT INTO t_p68014762_remove_login_system.users 
                   (email, password_hash, email_verified, verification_code, verification_code_expires, subscribed_to_updates, unsubscribe_token) 
                   VALUES (%s, %s, FALSE, %s, %s, TRUE, %s) RETURNING id, email, created_at""",
                (email, password_hash, verification_code, code_expires, unsubscribe_token)
            )
            user = cursor.fetchone()
            conn.commit()
            
            email_sent = send_verification_email(email, verification_code)
            
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
                        'created_at': user['created_at'].isoformat(),
                        'email_verified': False
                    },
                    'message': 'Registration successful. Check your email for verification code.' if email_sent else 'Registration successful.',
                    'email_sent': email_sent
                })
            }
        
        elif action == 'verify_email':
            email = body_data.get('email', '').strip()
            code = body_data.get('code', '').strip()
            
            if not email or not code:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Email and code are required'})
                }
            
            cursor.execute(
                """SELECT id, email, verification_code, verification_code_expires, email_verified 
                   FROM t_p68014762_remove_login_system.users WHERE email = %s""",
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
            
            if user['email_verified']:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Email already verified'})
                }
            
            if user['verification_code_expires'] < datetime.now():
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Verification code expired'})
                }
            
            if user['verification_code'] != code:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Invalid verification code'})
                }
            
            cursor.execute(
                "UPDATE t_p68014762_remove_login_system.users SET email_verified = TRUE, verification_code = NULL WHERE id = %s",
                (user['id'],)
            )
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
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'message': 'Email verified successfully',
                    'token': token,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'email_verified': True
                    }
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
                "SELECT id, email, created_at, email_verified FROM t_p68014762_remove_login_system.users WHERE email = %s AND password_hash = %s",
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
            
            if not user['email_verified']:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Email not verified. Please check your email for verification code.'})
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
                        'created_at': user['created_at'].isoformat(),
                        'email_verified': user['email_verified']
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
            FROM t_p68014762_remove_login_system.users u
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