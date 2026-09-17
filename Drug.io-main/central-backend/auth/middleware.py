from functools import wraps
from flask import request, jsonify, g
import jwt
import os
from auth.models import User

SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-change-this")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = User.get_by_id(data['user_id'])
            if not current_user:
                return jsonify({'message': 'Invalid token user!'}), 401
            g.user = current_user
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(*args, **kwargs)
    return decorated

def token_optional(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        
        if token:
            try:
                data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                current_user = User.get_by_id(data['user_id'])
                if current_user:
                    g.user = current_user
            except Exception:
                # If token is invalid, we just proceed without user
                pass
        
        return f(*args, **kwargs)
    return decorated

def role_required(roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not g.user or g.user.get('role') not in roles:
                return jsonify({'message': 'Permission denied!'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator
