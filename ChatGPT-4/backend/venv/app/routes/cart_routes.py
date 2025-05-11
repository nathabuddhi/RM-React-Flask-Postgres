from flask import Blueprint, request, jsonify
from app import db
from app.models import Cart, MsProduct

cart_bp = Blueprint("cart", __name__, url_prefix="/cart")

@cart_bp.route("/<customer>", methods=["GET"])
def get_cart(customer):
    cart_items = Cart.query.filter_by(customer=customer).all()
    response = []
    for item in cart_items:
        product = MsProduct.query.get(item.product_id)
        if product:
            response.append({
                "product_id": product.product_id,
                "name": product.product_name,
                "price": str(product.product_price),
                "stock": product.product_stock,
                "image": product.product_images.split(",")[0] if product.product_images else "",
                "quantity": item.quantity
            })
    return jsonify(response), 200

@cart_bp.route("", methods=["POST"])
def add_to_cart():
    data = request.json
    product_id = data["product_id"]
    customer = data["customer"]
    quantity = data.get("quantity", 1)

    existing = Cart.query.filter_by(product_id=product_id, customer=customer).first()
    product = MsProduct.query.get(product_id)

    if not product or product.product_stock < quantity:
        return jsonify({"error": "Invalid product or insufficient stock"}), 400

    if existing:
        existing.quantity = min(existing.quantity + quantity, product.product_stock)
    else:
        cart_item = Cart(product_id=product_id, customer=customer, quantity=quantity)
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({"message": "Product added to cart"}), 200

@cart_bp.route("", methods=["PUT"])
def update_cart():
    data = request.json
    product_id = data["product_id"]
    customer = data["customer"]
    quantity = data["quantity"]

    cart_item = Cart.query.filter_by(product_id=product_id, customer=customer).first()
    product = MsProduct.query.get(product_id)

    if not cart_item or not product:
        return jsonify({"error": "Item not found"}), 404

    if quantity < 1 or quantity > product.product_stock:
        return jsonify({"error": "Invalid quantity"}), 400

    cart_item.quantity = quantity
    db.session.commit()
    return jsonify({"message": "Quantity updated"}), 200

@cart_bp.route("", methods=["DELETE"])
def remove_from_cart():
    data = request.json
    product_id = data["product_id"]
    customer = data["customer"]

    cart_item = Cart.query.filter_by(product_id=product_id, customer=customer).first()
    if not cart_item:
        return jsonify({"error": "Item not found"}), 404

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"message": "Item removed"}), 200
