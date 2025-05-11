from flask import request, jsonify
from flask_jwt_extended import create_access_token
from models.user import MsUser
from backend import db

def init_auth_routes(app):
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        
        if not email or not password or not role:
            return jsonify({'error': 'Email, password, and role are required'}), 400
        
        if role not in ['Customer', 'Seller']:
            return jsonify({'error': 'Invalid role'}), 400
        
        if MsUser.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        user = MsUser(email=email, role=role)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'token': user.generate_token()
        }), 201

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = MsUser.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        return jsonify({
            'message': 'Login successful',
            'token': user.generate_token(),
            'role': user.role
        }), 200