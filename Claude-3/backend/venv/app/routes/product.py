from flask import Blueprint, request, jsonify
from app import db
from app.models.product import MsProduct
# from app.routes.auth import token_required
import uuid
import os
from werkzeug.utils import secure_filename

# Create a blueprint for product routes
product_bp = Blueprint('product', __name__)

# Helper function to validate product data
def validate_product_data(data):
    errors = []
    required_fields = ['ProductName', 'ProductPrice', 'ProductStock']
    
    for field in required_fields:
        if field not in data or not data[field]:
            errors.append(f"{field} is required")
    
    if 'ProductPrice' in data:
        try:
            price = float(data['ProductPrice'])
            if price < 0:
                errors.append("Price cannot be negative")
        except ValueError:
            errors.append("Price must be a valid number")
    
    if 'ProductStock' in data:
        try:
            stock = int(data['ProductStock'])
            if stock < 0:
                errors.append("Stock cannot be negative")
        except ValueError:
            errors.append("Stock must be a valid integer")
            
    return errors

# Get all products for the current seller
@product_bp.route('/api/products', methods=['GET'])
# @token_required
def get_products(current_user):
    if current_user.Role != 'seller':
        return jsonify({'message': 'Unauthorized access'}), 403
        
    products = MsProduct.query.filter_by(ProductOwner=current_user.Email).all()
    return jsonify({
        'products': [product.to_dict() for product in products],
        'message': 'Products retrieved successfully'
    }), 200

# Get a specific product
@product_bp.route('/api/products/<product_id>', methods=['GET'])
# @token_required
def get_product(current_user, product_id):
    if current_user.Role != 'seller':
        return jsonify({'message': 'Unauthorized access'}), 403
        
    try:
        product = MsProduct.query.filter_by(ProductId=uuid.UUID(product_id), ProductOwner=current_user.Email).first()
        if not product:
            return jsonify({'message': 'Product not found'}), 404
            
        return jsonify({
            'product': product.to_dict(),
            'message': 'Product retrieved successfully'
        }), 200
    except ValueError:
        return jsonify({'message': 'Invalid product ID format'}), 400

# Create a new product
@product_bp.route('/api/products', methods=['POST'])
# @token_required
def create_product(current_user):
    if current_user.Role != 'seller':
        return jsonify({'message': 'Unauthorized access'}), 403
        
    data = request.form.to_dict()
    
    # Validate product data
    errors = validate_product_data(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    # Handle image upload if provided
    product_image = None
    if 'ProductImage' in request.files:
        file = request.files['ProductImage']
        if file and file.filename:
            filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
            upload_folder = os.path.join(os.getcwd(), 'app/static/product_images')
            
            # Create directory if it doesn't exist
            os.makedirs(upload_folder, exist_ok=True)
            
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)
            product_image = f"/static/product_images/{filename}"
    
    try:
        new_product = MsProduct(
            ProductName=data['ProductName'],
            ProductDescription=data.get('ProductDescription', ''),
            ProductImages=product_image,
            ProductPrice=float(data['ProductPrice']),
            ProductStock=int(data['ProductStock']),
            ProductOwner=current_user.Email,
            IsActive=True
        )
        
        db.session.add(new_product)
        db.session.commit()
        
        return jsonify({
            'product': new_product.to_dict(),
            'message': 'Product created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

# Update an existing product
@product_bp.route('/api/products/<product_id>', methods=['PUT'])
# @token_required
def update_product(current_user, product_id):
    if current_user.Role != 'seller':
        return jsonify({'message': 'Unauthorized access'}), 403
    
    try:
        product = MsProduct.query.filter_by(ProductId=uuid.UUID(product_id), ProductOwner=current_user.Email).first()
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        data = request.form.to_dict()
        
        # Validate product data
        errors = validate_product_data(data)
        if errors:
            return jsonify({'errors': errors}), 400
        
        # Handle image upload if provided
        if 'ProductImage' in request.files:
            file = request.files['ProductImage']
            if file and file.filename:
                # Delete old image if exists
                if product.ProductImages:
                    old_image_path = os.path.join(os.getcwd(), 'app', product.ProductImages.lstrip('/'))
                    if os.path.exists(old_image_path):
                        os.remove(old_image_path)
                
                filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
                upload_folder = os.path.join(os.getcwd(), 'app/static/product_images')
                
                # Create directory if it doesn't exist
                os.makedirs(upload_folder, exist_ok=True)
                
                file_path = os.path.join(upload_folder, filename)
                file.save(file_path)
                product.ProductImages = f"/static/product_images/{filename}"
        
        # Update product fields
        product.ProductName = data['ProductName']
        product.ProductDescription = data.get('ProductDescription', '')
        product.ProductPrice = float(data['ProductPrice'])
        product.ProductStock = int(data['ProductStock'])
        
        db.session.commit()
        
        return jsonify({
            'product': product.to_dict(),
            'message': 'Product updated successfully'
        }), 200
        
    except ValueError:
        return jsonify({'message': 'Invalid product ID format'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

# Delete a product (soft delete)
@product_bp.route('/api/products/<product_id>', methods=['DELETE'])
# @token_required
def delete_product(current_user, product_id):
    if current_user.Role != 'seller':
        return jsonify({'message': 'Unauthorized access'}), 403
    
    try:
        product = MsProduct.query.filter_by(ProductId=uuid.UUID(product_id), ProductOwner=current_user.Email).first()
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        # Perform soft delete
        product.IsActive = False
        db.session.commit()
        
        return jsonify({
            'message': 'Product deleted successfully'
        }), 200
        
    except ValueError:
        return jsonify({'message': 'Invalid product ID format'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

# Toggle product status (active/inactive)
@product_bp.route('/api/products/<product_id>/toggle-status', methods=['PUT'])
# @token_required
def toggle_product_status(current_user, product_id):
    if current_user.Role != 'seller':
        return jsonify({'message': 'Unauthorized access'}), 403
    
    try:
        product = MsProduct.query.filter_by(ProductId=uuid.UUID(product_id), ProductOwner=current_user.Email).first()
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        # Toggle status
        product.IsActive = not product.IsActive
        db.session.commit()
        
        return jsonify({
            'product': product.to_dict(),
            'message': f'Product {"activated" if product.IsActive else "deactivated"} successfully'
        }), 200
        
    except ValueError:
        return jsonify({'message': 'Invalid product ID format'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500