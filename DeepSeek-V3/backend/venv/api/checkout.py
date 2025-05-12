from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.order import Order
from models.cart import Cart
from models.product import MsProduct
from models import db
import uuid
from datetime import datetime

checkout_bp = Blueprint('checkout', __name__)

@checkout_bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    current_user = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not data or 'payment_method' not in data or 'shipping_address' not in data:
        return jsonify({'error': 'Payment method and shipping address are required'}), 400
    
    try:
        # Get user's cart items
        cart_items = Cart.query.filter_by(customer=current_user['email']).all()
        
        if not cart_items:
            return jsonify({'error': 'No items in cart to checkout'}), 400
        
        orders = []
        
        # Process each cart item
        for item in cart_items:
            product = MsProduct.query.get(item.product_id)
            
            # Check product availability
            if not product:
                return jsonify({'error': f'Product {item.product_id} not found'}), 404
            
            if product.product_stock < item.quantity:
                return jsonify({
                    'error': f'Not enough stock for {product.product_name}. Available: {product.product_stock}'
                }), 400
            
            # Create order
            order = Order(
                product_id=item.product_id,
                quantity=item.quantity,
                customer=current_user['email'],
                payment_method=data['payment_method'],
                shipping_address=data['shipping_address'],
                status='Pending'
            )
            db.session.add(order)
            orders.append(order)
            
            # Update product stock
            product.product_stock -= item.quantity
            
            # Remove item from cart
            db.session.delete(item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order placed successfully',
            'orders': [order.to_dict() for order in orders]
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500