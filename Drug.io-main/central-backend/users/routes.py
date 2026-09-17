from flask import Blueprint, request, jsonify, g
from auth.middleware import token_required, role_required
from auth.models import User
from db.mongo import get_db

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['POST'])
@token_required
@role_required(['admin'])
def create_user():
    data = request.get_json()
    try:
        user_id = User.create_user(
            name=data['name'],
            email=data['email'],
            password=data['password'],
            role=data.get('role', 'researcher'),
            created_by=g.user['email']
        )
        return jsonify({'message': 'User created', 'user_id': user_id}), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400

@users_bp.route('/', methods=['GET'])
@token_required
@role_required(['admin'])
def list_users():
    db = get_db()
    users = []
    for u in db.users.find({}, {"password_hash": 0}):
        u['_id'] = str(u['_id'])
        users.append(u)
    return jsonify(users), 200

@users_bp.route('/reset-password', methods=['POST'])
@token_required
@role_required(['admin'])
def reset_password_route():
    import secrets
    import string
    
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'message': 'User ID is required'}), 400

    # Generate secure random password
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    new_password = ''.join(secrets.choice(alphabet) for i in range(12))
    
    try:
        success = User.reset_password(user_id, new_password)
        if success:
            return jsonify({
                'message': 'Password reset successfully',
                'temp_password': new_password
            }), 200
        else:
            return jsonify({'message': 'User not found or password not updated'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500
