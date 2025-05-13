from flask import Blueprint, request, jsonify
from app import db
from app.models.product import MsProduct
from app.models.user import MsUser
from app.models.order import Orders
from app.models.cart import Cart
from datetime import datetime
import uuid

order_bp = Blueprint('order', __name__)

@order_bp.route('/api/orders', methods=['GET'])
def get_user_orders():
    user_email = request.args.get('userEmail')
    
    if not user_email:
        return jsonify({
            'success': False,
            'message': 'User email is required'
        }), 400
    
    try:
        # Get all orders for the user
        orders = Orders.query.filter_by(Customer=user_email).all()
        
        # Get product details for each order
        result = []
        for order in orders:
            # Get product info
            product = MsProduct.query.get(order.ProductId)
            
            if product:
                seller = MsUser.query.get(product.ProductOwner)
                seller_name = seller.Username if seller else "Unknown Seller"
                
                order_data = order.to_dict()
                order_data['product'] = {
                    'productId': product.ProductId,
                    'productName': product.ProductName,
                    'productPrice': product.ProductPrice,
                    'productImages': product.ProductImages,
                    'sellerEmail': product.ProductOwner,
                    'sellerName': seller_name
                }
                result.append(order_data)
        
        # Sort by timestamp, newest first
        result.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            'success': True,
            'orders': result
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        }), 500
        
@order_bp.route('/api/seller/orders', methods=['GET'])
def get_seller_orders():
    seller_email = request.args.get('sellerEmail')
    status = request.args.get('status', None)  # Optional status filter
    
    if not seller_email:
        return jsonify({
            'success': False,
            'message': 'Seller email is required'
        }), 400
    
    try:
        # Get all products by this seller
        seller_products = MsProduct.query.filter_by(SellerEmail=seller_email).all()
        product_ids = [product.ProductId for product in seller_products]
        
        # If no products, return empty list
        if not product_ids:
            return jsonify({
                'success': True,
                'orders': []
            }), 200
        
        # Get orders for these products
        query = Orders.query.filter(Orders.ProductId.in_(product_ids))
        
        # Apply status filter if provided
        if status:
            query = query.filter_by(Status=status)
            
        orders = query.all()
        
        # Get detailed information
        result = []
        for order in orders:
            # Get product info
            product = MsProduct.query.get(order.ProductId)
            
            # Get customer info
            customer = MsUser.query.get(order.Customer)
            customer_name = customer.Username if customer else "Unknown Customer"
            
            order_data = order.to_dict()
            order_data['product'] = {
                'productId': product.ProductId,
                'productName': product.ProductName,
                'productPrice': product.ProductPrice,
                'productImages': product.ProductImages
            }
            order_data['customer'] = {
                'email': order.Customer,
                'name': customer_name
            }
            result.append(order_data)
        
        # Sort by timestamp, newest first
        result.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            'success': True,
            'orders': result
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        }), 500

@order_bp.route('/api/orders/update-status', methods=['POST'])
def update_order_status():
    data = request.json
    order_id = data.get('orderId')
    new_status = data.get('status')
    user_email = data.get('userEmail')
    
    # Validate inputs
    if not order_id or not new_status or not user_email:
        return jsonify({
            'success': False,
            'message': 'Missing required information'
        }), 400
    
    # Validate status
    valid_statuses = ['Pending', 'Accepted', 'Shipped', 'Completed']
    if new_status not in valid_statuses:
        return jsonify({
            'success': False,
            'message': 'Invalid status'
        }), 400
    
    try:
        # Get the order
        order = Orders.query.get(order_id)
        
        if not order:
            return jsonify({
                'success': False,
                'message': 'Order not found'
            }), 404
        
        # Get the product to check seller
        product = MsProduct.query.get(order.ProductId)
        
        if not product:
            return jsonify({
                'success': False,
                'message': 'Product not found'
            }), 404
            
        # Verify permissions
        is_seller = product.ProductOwner == user_email
        is_customer = order.Customer == user_email
        
        # For seller updates
        if new_status in ['Accepted', 'Shipped'] and not is_seller:
            return jsonify({
                'success': False,
                'message': 'Only the seller can accept or ship orders'
            }), 403
            
        # For customer updates
        if new_status == 'Completed' and not is_customer:
            return jsonify({
                'success': False,
                'message': 'Only the customer can mark an order as completed'
            }), 403
            
        # Check status transition
        if new_status == 'Accepted' and order.Status != 'Pending':
            return jsonify({
                'success': False,
                'message': 'Can only accept pending orders'
            }), 400
            
        if new_status == 'Shipped' and order.Status != 'Accepted':
            return jsonify({
                'success': False,
                'message': 'Can only ship accepted orders'
            }), 400
            
        if new_status == 'Completed' and order.Status != 'Shipped':
            return jsonify({
                'success': False,
                'message': 'Can only complete shipped orders'
            }), 400
        
        # Update status
        order.Status = new_status
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Order status updated to {new_status}',
            'order': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'An error occurred: {str(e)}'
        }), 500

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