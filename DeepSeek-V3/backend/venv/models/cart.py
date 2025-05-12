from models import db

class Cart(db.Model):
    __tablename__ = 'Cart'
    
    product_id = db.Column(db.String(36), db.ForeignKey('MsProduct.product_id'), primary_key=True)
    customer = db.Column(db.String(255), db.ForeignKey('MsUser.email'), primary_key=True)
    quantity = db.Column(db.Integer, default=1)
    
    product = db.relationship('MsProduct', backref='cart_items')
    
    def to_dict(self):
        return {
            'product_id': self.product_id,
            'customer': self.customer,
            'quantity': self.quantity,
            'product': self.product.to_dict() if self.product else None
        }