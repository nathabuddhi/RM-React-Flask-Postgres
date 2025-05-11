# app/routes/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import MsUser

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if required fields are present
    if not data or not all(key in data for key in ['email', 'password', 'role']):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Validate role
    if data['role'] not in ['Customer', 'Seller']:
        return jsonify({'message': 'Role must be either Customer or Seller'}), 400
    
    # Check if user already exists
    existing_user = MsUser.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'Email already registered'}), 409
    
    # Create new user
    try:
        new_user = MsUser(
            email=data['email'],
            password=data['password'],
            role=data['role']
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Generate access token
        access_token = create_access_token(identity={
            'email': new_user.email,
            'role': new_user.role
        })
        
        return jsonify({
            'message': 'User registered successfully',
            'token': access_token,
            'role': new_user.role
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Check if required fields are present
    if not data or not all(key in data for key in ['email', 'password']):
        return jsonify({'message': 'Missing email or password'}), 400
    
    # Find the user
    user = MsUser.query.filter_by(email=data['email']).first()
    
    # Check if user exists and password is correct
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Generate access token
    access_token = create_access_token(identity={
        'email': user.email,
        'role': user.role
    })
    
    return jsonify({
        'message': 'Login successful',
        'token': access_token,
        'role': user.role
    }), 200

# Protected route example
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user_profile():
    current_user = get_jwt_identity()
    return jsonify(current_user), 200