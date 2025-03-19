from flask import Flask, request, jsonify, Response
import os
from connect import get_db_connection
import psycopg2
from flask_bcrypt import Bcrypt
import jwt as pyjwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from functools import wraps
import requests

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
bcrypt = Bcrypt(app)

@app.route('/api/createdefault', methods=['GET'])
def createdefault():
    cur, conn = get_db_connection();
    try:
        cur.execute("SELECT * FROM users")
        user = cur.fetchone()

        return jsonify({
            "response": user is None,
            "status": 200
        }), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            "response": "Internal server error",
            "status": 500
        }), 500
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

@app.route('/api/user/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"response": "No data provided", "status": 400}), 400
        
        username = str(data.get('username', ''))
        email = str(data.get('email', ''))
        password = str(data.get('password', ''))

        if not all([username, email, password]):
            return jsonify({"response": "Missing required fields", "status": 400}), 400

        password_bytes = password.encode('utf-8')
        hashed_password = bcrypt.generate_password_hash(password_bytes).decode('utf-8')
        cur, conn = get_db_connection()
        try:
            cur.execute(
                "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                (username, email, hashed_password)
            )
            conn.commit()
            return jsonify({
                "message": "Register successful",
                "status": 200
            }), 200
        except psycopg2.Error as e:
            conn.rollback()
            if e.pgcode == '23505':
                return jsonify({
                    "message": "Email already in use",
                    "status": 409
                }), 409
            raise
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            "message": "Internal server error",
            "status": 500
        }), 500
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

@app.route('/api/user/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400

    cur = None
    conn = None
    try:
        cur, conn = get_db_connection()
        cur.execute('SELECT id, username, email, password FROM users WHERE username = %s', 
                   (data['username'],))
        user = cur.fetchone();

        cur.execute('SELECT * FROM admins WHERE id = %s', (user[0],))
        admin = cur.fetchone();

        if user and bcrypt.check_password_hash(user[-1], data['password']):
            token = pyjwt.encode({
                'user_id': user[0],
                'username': user[1],
                'email': user[2],
                'admin': admin,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, app.config['SECRET_KEY'], algorithm='HS256');

            return jsonify({
                'message': 'Login successful',
                'token': token,
                'status': 200
            });

        return jsonify({'message': 'Invalid username or password'}), 401

    except Exception as e:
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500
    
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@app.route('/api/user/verifypassword', methods=['POST'])
def verify():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400

    cur = None
    conn = None
    try:
        cur, conn = get_db_connection()
        
        cur.execute('SELECT id, username, password FROM users WHERE username = %s', 
                   (data['username'],))
        user = cur.fetchone()
        
        if user and bcrypt.check_password_hash(user[2], data['password']):
            return jsonify({'message': 'Password valid', 'status': 200}), 200

        return jsonify({'message': 'Invalid password', 'status': 401}), 401

    except Exception as e:
        return jsonify({'message': 'Verify failed', 'error': str(e), 'status': 500}), 500
    
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

def validate_token(token_string):
    try:
        if not token_string or not token_string.startswith('Bearer '):
            return False, None

        token = token_string.split(' ')[1]
        
        data = pyjwt.decode(
            token,
            app.config['SECRET_KEY'],
            algorithms=['HS256']
        )
        
        cur, conn = get_db_connection()
        cur.execute(
            'SELECT username, email, id FROM users WHERE id = %s',
            (data['user_id'],)
        )
        user = cur.fetchone()
        
        if user:
            cur.execute(
                'SELECT id FROM admins WHERE id = %s',
                (data['user_id'],)
            )
            admin = cur.fetchone()
            
            user_data = list(user)
            user_data.append(admin is not None)
            
            return True, user_data

        return False, None

    except (pyjwt.ExpiredSignatureError, pyjwt.InvalidTokenError):
        return False, None
        
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

@app.route('/api/validate', methods=['POST'])
def check_token():
    auth_header = request.headers.get('Authorization')
    is_valid, user_data = validate_token(auth_header)

    if not is_valid or user_data is None:
        return jsonify({
            'valid': False,
            'message': 'Invalid or expired token'
        }), 401

    username, email, user_id, admin = user_data

    return jsonify({
        'valid': is_valid,
        'username': username,
        'uuid': user_id,
        'email': email,
        'admin': admin
    })


def verify_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
        if not token:
            return jsonify({
                'message': 'Token is missing',
                'status': 401
            }), 401
            
        try:
            data = pyjwt.decode(
                token, 
                app.config['SECRET_KEY'],
                algorithms=['HS256']
            )

            cur, conn = get_db_connection()
            cur.execute(
                'SELECT id, email, username FROM users WHERE id = %s',
                (data['user_id'],)
            )
            current_user = cur.fetchone()

            if not current_user:
                raise pyjwt.InvalidTokenError()

        except pyjwt.ExpiredSignatureError:
            return jsonify({
                'message': 'Token expired',
                'status': 401
            }), 401

        except pyjwt.InvalidTokenError:
            return jsonify({
                'message': 'Invalid token',
                'status': 401
            }), 401

        finally:
            if 'cur' in locals():
                cur.close()
            if 'conn' in locals():
                conn.close()
                
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/feed/get_read', methods=['POST'])
@verify_token
def get_read(current_user):
    data = request.get_json()
    
    if not data or not data.get('feed_id'):
        return jsonify({
            'message': 'Missing feed ID',
            'status': 400
        }), 400
    
    cur = None
    conn = None
    try:
        cur, conn = get_db_connection()
        cur.execute(
            'SELECT * FROM read_elements WHERE user_id = %s AND feed_id = %s',
            (current_user[0], data['feed_id'])
        )
        read_elements = cur.fetchall()

        column_names = [desc[0] for desc in cur.description]
        read_elements_list = [dict(zip(column_names, row)) for row in read_elements]

        return jsonify({
            'read_elements': read_elements_list,
            'status': 200
        }), 200

    except psycopg2.Error as e:
        conn.rollback()
        print(f"Database Error: {e.pgcode} - {e.pgerror}")

        return jsonify({'message': f'Database error: {e.pgerror}', 'status': 500}), 500

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@app.route('/api/feed/add_read', methods=['POST'])
@verify_token
def add_read(current_user):
    data = request.get_json()
    
    if not data or not data.get('feed_id') or not data.get('guid'):
        return jsonify({
            'message': 'Missing data',
            'status': 400
        }), 400

    cur = None
    conn = None
    try:
        cur, conn = get_db_connection()
        cur.execute(
            'INSERT INTO read_elements (guid, feed_id, user_id) VALUES (%s, %s, %s)',
            (data['guid'], data['feed_id'], current_user[0])
        )
        conn.commit()

        return jsonify({
            'status': 200
        }), 200

    except psycopg2.Error as e:
        conn.rollback()
        print(f"Database Error: {e.pgcode} - {e.pgerror}")

        return jsonify({'message': f'Database error: {e.pgerror}', 'status': 500}), 500

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@app.route('/api/feed/add', methods=['POST'])
@verify_token
def add_feed(current_user):
    data = request.get_json()

    if not data or not data.get('feed_url'):
        return jsonify({
            'message': 'Missing feed URL',
            'status': 400
        }), 400

    cur = None
    conn = None
    try:
        cur, conn = get_db_connection()

        cur.execute(
            'INSERT INTO feeds (feed_url, user_id, title) VALUES (%s, %s, %s) RETURNING feed_id',
            (data['feed_url'], current_user[0], data['title'])
        )
        feed_id = cur.fetchone()[0]
        conn.commit()

        return jsonify({
            'message': 'Feed added successfully',
            'feed_id': feed_id,
            'status': 201
        }), 201
    
    except psycopg2.Error as e:
        conn.rollback()
        print(f"Database Error: {e.pgcode} - {e.pgerror}")

        if e.pgcode == '23505':
            return jsonify({'message': 'Feed already exists for this user', 'status': 409}), 409
        
        return jsonify({'message': f'Database error: {e.pgerror}', 'status': 500}), 500

        
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@app.route('/api/feed/delete', methods=['POST'])
@verify_token
def delete_feed(current_user):
    data = request.get_json()
    if not data or not data.get('feed_id'):
        return jsonify({
            'message': 'Missing feed ID',
            'status': 400
        }), 400

    cur = None
    conn = None
    try:
        cur, conn = get_db_connection()
        
        cur.execute(
            'DELETE FROM feeds WHERE feed_id = %s AND user_id = %s RETURNING feed_id',
            (data['feed_id'], current_user[0])
        )
        deleted_feed_id = cur.fetchone()
        conn.commit()
        
        if not deleted_feed_id:
            return jsonify({
                'message': 'Feed not found',
                'status': 404
            }), 404
        
        return jsonify({
            'message': 'Feed deleted successfully',
            'feed_id': deleted_feed_id[0],
            'status': 200
        }), 200
    
    except psycopg2.Error as e:
        conn.rollback()
        return jsonify({
            'message': 'Database error',
            'status': 500,
            'error': str(e)
        }), 500
    
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@app.route('/api/feed/fetch', methods=['POST'])
@verify_token
def fetch_feed(current_user):
    data = request.get_json()
    if not data or not data.get('feed_url'):
        return jsonify({
            'message': 'Missing feed URL',
            'status': 400
        }), 400

    try:
        response = requests.get(data['feed_url'])
        response.raise_for_status()

        return Response(response.content, content_type='application/xml')

    except requests.RequestException as e:
        return jsonify({
            'message': 'Failed to fetch feed',
            'status': 500,
            'error': str(e)
        }), 500

@app.route('/api/feed/get', methods=['GET'])
@verify_token
def get_user_feeds(current_user):
    cur = None
    conn = None
    try:
        cur, conn = get_db_connection()
        
        cur.execute(
            'SELECT * FROM feeds WHERE user_id = %s',
            (current_user[0],)
        )
        feeds = cur.fetchall()

        feed_column_names = [desc[0] for desc in cur.description]
        feeds_list = [dict(zip(feed_column_names, row)) for row in feeds]

        cur.execute(
            'SELECT * FROM read_elements WHERE user_id = %s',
            (current_user[0],)
        )
        read_elements = cur.fetchall()

        read_column_names = [desc[0] for desc in cur.description]
        read_elements_list = [dict(zip(read_column_names, row)) for row in read_elements]
        
        return jsonify({
            'feeds': feeds_list,
            'read': read_elements_list,
            'status': 200
        })

    except Exception as e:
        return jsonify({
            'message': 'Failed to get feeds',
            'error': str(e),
            'status': 500
        }), 500

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')