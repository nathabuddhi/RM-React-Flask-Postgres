from flask import Blueprint, request, jsonify
from app.models import MsProduct, db
from sqlalchemy.exc import SQLAlchemyError

product_bp = Blueprint("product", __name__, url_prefix="/products")


@product_bp.route("/<email>", methods=["GET"])
def get_products(email):
    products = MsProduct.query.filter_by(product_owner=email).all()
    return jsonify([{
        "id": p.product_id,
        "name": p.product_name,
        "description": p.product_description,
        "images": p.product_images.split(",") if p.product_images else [],
        "price": str(p.product_price),
        "stock": p.product_stock,
    } for p in products]), 200

@product_bp.route("/", methods=["POST"])
def create_product():
    data = request.json
    try:
        new_product = MsProduct(
            product_name=data["name"],
            product_description=data.get("description", ""),
            product_images=",".join(data.get("images", [])),
            product_price=data["price"],
            product_stock=data["stock"],
            product_owner=data["owner"]
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify({"message": "Product created successfully"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@product_bp.route("/<product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.json
    product = MsProduct.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    try:
        product.product_name = data["name"]
        product.product_description = data.get("description", "")
        product.product_images = ",".join(data.get("images", []))
        product.product_price = data["price"]
        product.product_stock = data["stock"]
        db.session.commit()
        return jsonify({"message": "Product updated successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@product_bp.route("/<product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = MsProduct.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"}), 200
