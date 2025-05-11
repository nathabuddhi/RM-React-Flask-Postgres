from flask import Blueprint, request, jsonify
from app import db
from app.models import Order, MsProduct
from sqlalchemy import or_

order_bp = Blueprint("orders", __name__, url_prefix="/orders")

# Get orders for customer
@order_bp.route("/customer/<email>", methods=["GET"])
def get_customer_orders(email):
    orders = Order.query.filter_by(customer=email).order_by(Order.timestamp.desc()).all()
    return jsonify([format_order(o) for o in orders]), 200

# Get orders for seller (all products owned by them)
@order_bp.route("/seller/<email>", methods=["GET"])
def get_seller_orders(email):
    seller_products = MsProduct.query.filter_by(product_owner=email).all()
    product_ids = [p.product_id for p in seller_products]
    orders = Order.query.filter(Order.product_id.in_(product_ids)).all()

    return jsonify([format_order(o) for o in orders]), 200

# Update order status
@order_bp.route("/status", methods=["PUT"])
def update_order_status():
    data = request.json
    order_id = data.get("order_id")
    new_status = data.get("status")

    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    order.status = new_status
    db.session.commit()
    return jsonify({"message": f"Order updated to {new_status}"}), 200

def format_order(o):
    product = MsProduct.query.get(o.product_id)
    return {
        "order_id": o.order_id,
        "product_id": o.product_id,
        "product_name": product.product_name if product else "",
        "product_image": product.product_images.split(",")[0] if product and product.product_images else "",
        "quantity": o.quantity,
        "customer": o.customer,
        "status": o.status,
        "timestamp": o.timestamp.isoformat(),
    }
