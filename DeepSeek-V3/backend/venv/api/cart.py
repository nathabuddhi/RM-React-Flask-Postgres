from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.cart import Cart
from models.product import MsProduct
from models import db

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    current_user = get_jwt_identity()
    cart_items = Cart.query.filter_by(customer=current_user['email']).all()
    return jsonify([item.to_dict() for item in cart_items])

@cart_bp.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    current_user = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'product_id' not in data:
        return jsonify({'error': 'Product ID is required'}), 400
    
    try:
        product = MsProduct.query.get(data['product_id'])
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        if product.product_stock <= 0:
            return jsonify({'error': 'Product is out of stock'}), 400
        
        quantity = data.get('quantity', 1)
        if quantity > product.product_stock:
            return jsonify({'error': 'Quantity exceeds available stock'}), 400
        
        cart_item = Cart.query.filter_by(
            product_id=data['product_id'],
            customer=current_user['email']
        ).first()
        
        if cart_item:
            # Update quantity if item already in cart
            cart_item.quantity = min(cart_item.quantity + quantity, product.product_stock)
        else:
            # Add new item to cart
            cart_item = Cart(
                product_id=data['product_id'],
                customer=current_user['email'],
                quantity=quantity
            )
            db.session.add(cart_item)
        
        db.session.commit()
        return jsonify(cart_item.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/cart/<product_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(product_id):
    current_user = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'quantity' not in data:
        return jsonify({'error': 'Quantity is required'}), 400
    
    try:
        cart_item = Cart.query.filter_by(
            product_id=product_id,
            customer=current_user['email']
        ).first()
        
        if not cart_item:
            return jsonify({'error': 'Item not found in cart'}), 404
        
        product = MsProduct.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        quantity = int(data['quantity'])
        if quantity < 1 or quantity > product.product_stock:
            return jsonify({'error': 'Invalid quantity'}), 400
        
        cart_item.quantity = quantity
        db.session.commit()
        return jsonify(cart_item.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/cart/<product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(product_id):
    current_user = get_jwt_identity()
    
    try:
        cart_item = Cart.query.filter_by(
            product_id=product_id,
            customer=current_user['email']
        ).first()
        
        if not cart_item:
            return jsonify({'error': 'Item not found in cart'}), 404
        
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({'message': 'Item removed from cart'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500