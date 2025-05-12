from models import db
import uuid
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'Orders'
    
    order_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey('MsProduct.product_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    customer = db.Column(db.String(255), db.ForeignKey('MsUser.email'), nullable=False)
    status = db.Column(db.String(15), default='Pending')
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    payment_method = db.Column(db.String(50), nullable=False)
    shipping_address = db.Column(db.Text, nullable=False)
    
    product = db.relationship('MsProduct', backref='Orders')
    
    def to_dict(self):
        return {
            'order_id': self.order_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'customer': self.customer,
            'status': self.status,
            'timestamp': self.timestamp.isoformat(),
            'payment_method': self.payment_method,
            'shipping_address': self.shipping_address,
            'product': self.product.to_dict() if self.product else None
        }