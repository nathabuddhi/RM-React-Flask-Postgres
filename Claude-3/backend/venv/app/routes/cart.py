# Create a cart blueprint
from flask import Blueprint, request, jsonify, g
from app import db
from app.models.cart import Cart
from app.models.product import MsProduct
from flask_jwt_extended import jwt_required, get_jwt_identity

cart_bp = Blueprint('cart', __name__)

# Get current user's cart
@cart_bp.route('/api/cart', methods=['GET'])
@jwt_required()
def get_cart():
    current_user = get_jwt_identity()
    
    # Join Cart with MsProduct to get product details along with cart info
    cart_items = db.session.query(Cart, MsProduct)\
        .join(MsProduct, Cart.ProductId == MsProduct.ProductId)\
        .filter(Cart.Customer == current_user["email"])\
        .all()
    
    result = []
    for cart_item, product in cart_items:
        item_data = {
            'cartItem': cart_item.to_dict(),
            'product': product.to_dict()
        }
        result.append(item_data)
    
    return jsonify({
        'cartItems': result,
        'message': 'Cart retrieved successfully'
    }), 200

# Add an item to cart
@cart_bp.route('/api/cart/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    current_user = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'productId' not in data or 'quantity' not in data:
        return jsonify({
            'message': 'Invalid request data'
        }), 400
    
    product_id = data['productId']
    quantity = int(data['quantity'])
    
    # Validate quantity
    if quantity < 1:
        return jsonify({
            'message': 'Quantity must be at least 1'
        }), 400
    
    # Check if product exists and has enough stock
    product = MsProduct.query.filter_by(ProductId=product_id, IsActive=True).first()
    if not product:
        return jsonify({
            'message': 'Product not found'
        }), 404
    
    if product.ProductStock < quantity:
        return jsonify({
            'message': f'Not enough stock available. Only {product.ProductStock} available.'
        }), 400
    
    # Check if item already exists in cart
    cart_item = Cart.query.filter_by(ProductId=product_id, Customer=current_user["email"]).first()

    
    if cart_item:
        # Update quantity if item exists
        if cart_item.Quantity + quantity > product.ProductStock:
            return jsonify({
                'message': f'Cannot add {quantity} more items. Only {product.ProductStock - cart_item.Quantity} more available.'
            }), 400
        
        cart_item.Quantity += quantity
    else:
        # Create new cart item
        cart_item = Cart(ProductId=product_id, Customer=current_user["email"], Quantity=quantity)
        db.session.add(cart_item)
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Item added to cart successfully',
            'cartItem': cart_item.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error adding item to cart: {str(e)}")
        return jsonify({
            'message': f'Failed to add item to cart: {str(e)}'
        }), 500

# Update cart item quantity
@cart_bp.route('/api/cart/update', methods=['PUT'])
@jwt_required()
def update_cart_item():
    current_user = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'productId' not in data or 'quantity' not in data:
        return jsonify({
            'message': 'Invalid request data'
        }), 400
    
    product_id = data['productId']
    quantity = int(data['quantity'])
    
    # Validate quantity
    if quantity < 1:
        return jsonify({
            'message': 'Quantity must be at least 1'
        }), 400
    
    # Check if product exists and has enough stock
    product = MsProduct.query.filter_by(ProductId=product_id, IsActive=True).first()
    if not product:
        return jsonify({
            'message': 'Product not found'
        }), 404
    
    if product.ProductStock < quantity:
        return jsonify({
            'message': f'Not enough stock available. Maximum allowed is {product.ProductStock}'
        }), 400
    
    # Check if item exists in cart
    cart_item = Cart.query.filter_by(ProductId=product_id, Customer=current_user["email"]).first()
    if not cart_item:
        return jsonify({
            'message': 'Item not found in cart'
        }), 404
    
    # Update quantity
    cart_item.Quantity = quantity
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Cart item updated successfully',
            'cartItem': cart_item.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': f'Failed to update cart item: {str(e)}'
        }), 500

# Remove item from cart
@cart_bp.route('/api/cart/remove', methods=['DELETE'])
@jwt_required()
def remove_from_cart():
    current_user = get_jwt_identity()
    product_id = request.args.get('productId')
    
    if not product_id:
        return jsonify({
            'message': 'Product ID is required'
        }), 400
    
    # Check if item exists in cart
    cart_item = Cart.query.filter_by(ProductId=product_id, Customer=current_user["email"]).first()
    if not cart_item:
        return jsonify({
            'message': 'Item not found in cart'
        }), 404
    
    try:
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({
            'message': 'Item removed from cart successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': f'Failed to remove item from cart: {str(e)}'
        }), 500

# Clear cart
@cart_bp.route('/api/cart/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    current_user = get_jwt_identity()
    
    try:
        Cart.query.filter_by(Customer=current_user["email"]).delete()
        db.session.commit()
        return jsonify({
            'message': 'Cart cleared successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': f'Failed to clear cart: {str(e)}'
        }), 500