"""
Business: Account management - password reset and account deletion
Args: event with httpMethod, body (email, code, password, token); context with request_id
Returns: HTTP response with operation status
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


def generate_reset_code() -> str:
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])


def send_email(email: str, subject: str, text_content: str, html_content: str) -> bool:
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    sender_email = 'ruprojectgames@gmail.com'
    
    if not all([smtp_host, smtp_user, smtp_password]):
        return False
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = email
    
    part1 = MIMEText(text_content, 'plain')
    part2 = MIMEText(html_content, 'html')
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


def send_password_reset_email(email: str, code: str) -> bool:
    text = f'Ваш код для восстановления пароля: {code}\n\nКод действителен 15 минут.\n\nЕсли вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.'
    html = f'''
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Восстановление пароля</h2>
        <p>Вы запросили восстановление пароля для вашего аккаунта на ruprojectgames.ru</p>
        <p>Ваш код для восстановления:</p>
        <h1 style="color: #FF5722; font-size: 36px; letter-spacing: 5px;">{code}</h1>
        <p style="color: #666;">Код действителен 15 минут.</p>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо. Ваш пароль останется неизменным.</p>
      </body>
    </html>
    '''
    return send_email(email, 'Восстановление пароля', text, html)


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
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
        
        if action == 'request_reset':
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
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'message': 'If email exists, reset code has been sent'})
                }
            
            reset_code = generate_reset_code()
            reset_expires = datetime.now() + timedelta(minutes=15)
            
            cursor.execute(
                """UPDATE t_p68014762_remove_login_system.users 
                   SET reset_token = %s, reset_token_expires = %s 
                   WHERE email = %s""",
                (reset_code, reset_expires, email)
            )
            conn.commit()
            
            email_sent = send_password_reset_email(email, reset_code)
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'message': 'Reset code has been sent to your email',
                    'email_sent': email_sent
                })
            }
        
        elif action == 'verify_reset_code':
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
                """SELECT id, reset_token, reset_token_expires 
                   FROM t_p68014762_remove_login_system.users 
                   WHERE email = %s""",
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
            
            if not user['reset_token'] or not user['reset_token_expires']:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'No reset code requested'})
                }
            
            if datetime.now() > user['reset_token_expires']:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Reset code expired'})
                }
            
            if user['reset_token'] != code:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Invalid reset code'})
                }
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Reset code verified', 'valid': True})
            }
        
        elif action == 'reset_password':
            email = body_data.get('email', '').strip()
            code = body_data.get('code', '').strip()
            new_password = body_data.get('password', '').strip()
            
            if not email or not code or not new_password:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Email, code and password are required'})
                }
            
            if len(new_password) < 6:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Password must be at least 6 characters'})
                }
            
            if email.lower() == new_password.lower():
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Email and password must be different'})
                }
            
            cursor.execute(
                """SELECT id, reset_token, reset_token_expires 
                   FROM t_p68014762_remove_login_system.users 
                   WHERE email = %s""",
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
            
            if not user['reset_token'] or user['reset_token'] != code:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Invalid reset code'})
                }
            
            if datetime.now() > user['reset_token_expires']:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Reset code expired'})
                }
            
            new_password_hash = hash_password(new_password)
            
            cursor.execute(
                """UPDATE t_p68014762_remove_login_system.users 
                   SET password_hash = %s, reset_token = NULL, reset_token_expires = NULL 
                   WHERE id = %s""",
                (new_password_hash, user['id'])
            )
            cursor.execute("DELETE FROM sessions WHERE user_id = %s", (user['id'],))
            conn.commit()
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Password reset successfully'})
            }
    
    elif method == 'DELETE':
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
            SELECT u.id, u.email
            FROM t_p68014762_remove_login_system.users u
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
        
        cursor.execute("DELETE FROM sessions WHERE user_id = %s", (user_session['id'],))
        cursor.execute("DELETE FROM donations WHERE user_id = %s", (user_session['id'],))
        cursor.execute("DELETE FROM t_p68014762_remove_login_system.users WHERE id = %s", (user_session['id'],))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'message': 'Account deleted successfully'})
        }
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
