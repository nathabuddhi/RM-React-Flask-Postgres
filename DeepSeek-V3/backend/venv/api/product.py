from flask import Blueprint, request, jsonify
from models.product import MsProduct
from models import db
from flask_jwt_extended import jwt_required, get_jwt_identity

product_bp = Blueprint('product', __name__)

@product_bp.route('/product', methods=['GET'])
@jwt_required()
def get_products():
    current_user = get_jwt_identity()
    products = MsProduct.query.filter_by(product_owner=current_user['email']).all()
    return jsonify([product.to_dict() for product in products])

@product_bp.route('/product/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = MsProduct.query.filter_by(product_id=product_id).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
            
        return jsonify(product.to_dict())
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to fetch product',
            'details': str(e)
        }), 500

@product_bp.route('/product', methods=['POST'])
@jwt_required()
def create_product():
    current_user = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['product_name', 'product_price', 'product_stock']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        product = MsProduct(
            product_name=data['product_name'],
            product_description=data.get('product_description', ''),
            product_images=data.get('product_images', []),
            product_price=data['product_price'],
            product_stock=data['product_stock'],
            product_owner=current_user['email']
        )
        db.session.add(product)
        db.session.commit()
        return jsonify({
            'message': 'Product created successfully',
            'product': product.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@product_bp.route('/product/<product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    current_user = get_jwt_identity()
    product = MsProduct.query.filter_by(product_id=product_id, product_owner=current_user['email']).first()
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    try:
        product.product_name = data.get('product_name', product.product_name)
        product.product_description = data.get('product_description', product.product_description)
        product.product_images = data.get('product_images', product.product_images)
        product.product_price = data.get('product_price', product.product_price)
        product.product_stock = data.get('product_stock', product.product_stock)
        
        db.session.commit()
        return jsonify(product.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@product_bp.route('/product/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    current_user = get_jwt_identity()
    product = MsProduct.query.filter_by(product_id=product_id, product_owner=current_user['email']).first()
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@product_bp.route('/product/search', methods=['GET'])
def search_products():
    search_query = request.args.get('q', '').strip()
    min_stock = request.args.get('min_stock', 1, type=int)
    
    try:
        # Base query for available products
        query = MsProduct.query.filter(
            MsProduct.product_stock >= min_stock
        )
        
        # Add search filter if query exists
        if search_query:
            query = query.filter(
                MsProduct.product_name.ilike(f'%{search_query}%')
            )
        
        products = query.all()
        
        if not products:
            return jsonify({
                'message': 'No products found matching your search',
                'products': []
            }), 200
        
        return jsonify({
            'products': [product.to_dict() for product in products]
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to search products',
            'details': str(e)
        }), 500