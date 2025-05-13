from app import db
from sqlalchemy.dialects.postgresql import UUID

# Cart model
class Cart(db.Model):
    __tablename__ = 'Cart'

    ProductId = db.Column(UUID(as_uuid=True), db.ForeignKey('MsProduct.ProductId'), primary_key=True)
    Customer = db.Column(db.String(255), db.ForeignKey('MsUser.email'), primary_key=True)
    Quantity = db.Column(db.Integer, default=1)

    # Define relationships
    product = db.relationship('MsProduct', backref=db.backref('cart_items', lazy=True))
    user = db.relationship('MsUser', backref=db.backref('cart_items', lazy=True))

    def to_dict(self):
        return {
            'ProductId': str(self.ProductId),
            'Customer': self.Customer,
            'Quantity': self.Quantity
        }