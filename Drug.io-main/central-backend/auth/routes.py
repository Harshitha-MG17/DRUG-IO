from flask import Blueprint, request, jsonify
from auth.models import User
import jwt
import os
import datetime

auth_bp = Blueprint('auth', __name__)
SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-change-this")

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    user = User.verify_password(data['email'], data['password'])
    
    if user:
        token = jwt.encode({
            'user_id': str(user['_id']),
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        
        return jsonify({
            'token': token,
            'user': {
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        })
    
    return jsonify({'message': 'Invalid credentials'}), 401
