from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.order import Order, OrderStatus
from models.product import MsProduct
from models import db

order_bp = Blueprint('order', __name__)

@order_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    current_user = get_jwt_identity()
    
    try:
        if current_user['role'] == 'Seller':
            # Get all orders for seller's products
            orders = Order.query.join(MsProduct).filter(
                MsProduct.product_owner == current_user['email']
            ).order_by(Order.timestamp.desc()).all()
        else:
            # Get all orders for customer
            orders = Order.query.filter_by(
                customer=current_user['email']
            ).order_by(Order.timestamp.desc()).all()
            
        return jsonify([order.to_dict() for order in orders])
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_bp.route('/orders/<order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    current_user = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'status' not in data:
        return jsonify({'error': 'Status is required'}), 400
    
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Verify permissions
        if current_user['role'] == 'Seller':
            # Seller can only update their own product orders
            product = MsProduct.query.get(order.product_id)
            if product.product_owner != current_user['email']:
                return jsonify({'error': 'Unauthorized'}), 403
            
            # Seller can only change to Accepted or Shipped
            if data['status'] not in [OrderStatus.ACCEPTED.value, OrderStatus.SHIPPED.value]:
                return jsonify({'error': 'Invalid status transition'}), 400
            
            # Validate status flow
            if (order.status == OrderStatus.PENDING.value and data['status'] != OrderStatus.ACCEPTED.value) or \
               (order.status == OrderStatus.ACCEPTED.value and data['status'] != OrderStatus.SHIPPED.value):
                return jsonify({'error': 'Invalid status transition'}), 400
                
        elif current_user['role'] == 'Customer':
            # Customer can only mark Shipped orders as Completed
            if data['status'] != OrderStatus.COMPLETED.value or order.status != OrderStatus.SHIPPED.value:
                return jsonify({'error': 'Invalid status transition'}), 400
                
            # Customer can only update their own orders
            if order.customer != current_user['email']:
                return jsonify({'error': 'Unauthorized'}), 403
        else:
            return jsonify({'error': 'Unauthorized'}), 403
        
        order.status = data['status']
        db.session.commit()
        
        return jsonify(order.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500