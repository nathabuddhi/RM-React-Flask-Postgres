from flask import Blueprint, request, jsonify
from app import db
from app.models.product import MsProduct
from app.models.order import Orders
from app.models.cart import Cart
from datetime import datetime
import uuid

order_bp = Blueprint('order', __name__)

@order_bp.route('/api/order/checkout', methods=['POST'])
def checkout():
    data = request.json
    user_email = data.get('userEmail')
    shipping_address = data.get('shippingAddress')
    payment_method = data.get('paymentMethod')
    
    if not user_email or not shipping_address or not payment_method:
        return jsonify({
            'success': False,
            'message': 'Missing required information'
        }), 400
    
    # Get all cart items for the user
    cart_items = Cart.query.filter_by(Customer=user_email).all()
    
    if not cart_items:
        return jsonify({
            'success': False,
            'message': 'Your cart is empty'
        }), 400
    
    orders_created = []
    errors = []
    
    try:
        # Begin transaction
        for item in cart_items:
            # Check product availability
            product = MsProduct.query.get(item.ProductId)
            
            if not product:
                errors.append(f"Product not found: {item.ProductId}")
                continue
                
            if product.ProductStock < item.Quantity:
                errors.append(f"Not enough stock for {product.ProductName}. Available: {product.ProductStock}")
                continue
            
            # Create order
            new_order = Orders(
                OrderId=str(uuid.uuid4()),
                ProductId=item.ProductId,
                Quantity=item.Quantity,
                Customer=user_email,
                Status="Pending",
                Timestamp=datetime.now(),
                ShippingAddress=shipping_address,
                PaymentMethod=payment_method
            )
            
            # Update product stock
            product.ProductStock -= item.Quantity
            
            # Add to transaction
            db.session.add(new_order)
            orders_created.append(new_order.OrderId)
        
        # If there are errors, roll back
        if errors:
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': 'Could not complete checkout',
                'errors': errors
            }), 400
        
        # Remove items from cart
        for item in cart_items:
            db.session.delete(item)
        
        # Commit transaction
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Order placed successfully!',
            'orderIds': orders_created
        }), 201
        
    except Exception as e:
        print("Error during checkout: ", str(e))
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        }), 500