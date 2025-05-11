from flask import Blueprint, request, jsonify
from app import db
from app.models import MsProduct, Cart, Order
from datetime import datetime
import uuid

checkout_bp = Blueprint("checkout", __name__, url_prefix="/checkout")

@checkout_bp.route("/", methods=["POST"])
def checkout():
    data = request.json
    customer = data.get("customer")
    payment_method = data.get("payment_method")
    shipping_address = data.get("shipping_address")

    if not all([customer, payment_method, shipping_address]):
        return jsonify({"error": "Missing checkout fields"}), 400

    cart_items = Cart.query.filter_by(customer=customer).all()
    if not cart_items:
        return jsonify({"error": "Cart is empty"}), 400

    orders_created = []
    for item in cart_items:
        product = MsProduct.query.get(item.product_id)
        if not product or product.product_stock < item.quantity:
            return jsonify({"error": f"Item '{product.product_name if product else item.product_id}' is out of stock"}), 400

        # Reduce stock
        product.product_stock -= item.quantity

        # Create order
        order = Order(
            order_id=str(uuid.uuid4()),
            product_id=item.product_id,
            quantity=item.quantity,
            customer=customer,
            status="Pending",
            timestamp=datetime.utcnow()
        )
        db.session.add(order)
        orders_created.append(order)

    # Clear cart
    Cart.query.filter_by(customer=customer).delete()

    try:
        db.session.commit()
        return jsonify({"message": "Checkout successful", "orders": [o.order_id for o in orders_created]}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Checkout failed", "details": str(e)}), 500
