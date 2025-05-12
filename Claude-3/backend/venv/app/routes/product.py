from flask import Blueprint, request, jsonify
from app import db
from app.models.product import MsProduct
import uuid
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS

# Create a blueprint for product routes
product_bp = Blueprint('product', __name__)
CORS(product_bp)  # Enable CORS for all routes in this blueprint

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

# Get all products
@product_bp.route('/api/products', methods=['GET'])
def get_products():
    products = MsProduct.query.filter_by(IsActive=True).all()
    return jsonify({
        'products': [product.to_dict() for product in products],
        'message': 'Products retrieved successfully'
    }), 200

# Get a specific product
@product_bp.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = MsProduct.query.filter_by(ProductId=uuid.UUID(product_id), IsActive=True).first()
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
def create_product():
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
            ProductOwner=data.get('ProductOwner', 'anonymous@example.com'),  # Default value if not provided
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
def update_product(product_id):
    try:
        product = MsProduct.query.filter_by(ProductId=uuid.UUID(product_id), IsActive=True).first()
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
def delete_product(product_id):
    try:
        product = MsProduct.query.filter_by(ProductId=uuid.UUID(product_id), IsActive=True).first()
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
def toggle_product_status(product_id):
    try:
        product = MsProduct.query.filter_by(ProductId=uuid.UUID(product_id)).first()
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