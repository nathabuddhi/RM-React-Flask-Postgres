from app import db
from datetime import datetime

class Orders(db.Model):
    __tablename__ = 'Orders'
    
    OrderId = db.Column(db.String(36), primary_key=True)
    ProductId = db.Column(db.String(36), db.ForeignKey('MsProduct.ProductId'), nullable=False)
    Quantity = db.Column(db.Integer, nullable=False)
    Customer = db.Column(db.String(255), db.ForeignKey('MsUser.email'), nullable=False)
    Status = db.Column(db.String(15), default='Pending')
    Timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    ShippingAddress = db.Column(db.Text, nullable=False)
    PaymentMethod = db.Column(db.String(50), nullable=False)
    
    def __repr__(self):
        return f'<Order {self.OrderId}>'
    
    def to_dict(self):
        return {
            'orderId': self.OrderId,
            'productId': self.ProductId,
            'quantity': self.Quantity,
            'customer': self.Customer,
            'status': self.Status,
            'timestamp': self.Timestamp.isoformat(),
            'shippingAddress': self.ShippingAddress,
            'paymentMethod': self.PaymentMethod
        }