from app import db
import uuid

class MsUser(db.Model):
    __tablename__ = 'MsUser'

    email = db.Column(db.String(100), primary_key=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(15), nullable=False)

class MsProduct(db.Model):
    __tablename__ = 'MsProduct'

    product_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_name = db.Column(db.String(50), nullable=False)
    product_description = db.Column(db.Text)
    product_images = db.Column(db.Text) 
    product_price = db.Column(db.Numeric(10, 2), nullable=False)
    product_stock = db.Column(db.Integer, nullable=False)
    product_owner = db.Column(db.String(100), db.ForeignKey("MsUser.email"), nullable=False)

class Cart(db.Model):
    __tablename__ = 'Cart'
    product_id = db.Column(db.String(36), db.ForeignKey("MsProduct.product_id"), primary_key=True)
    customer = db.Column(db.String(255), db.ForeignKey("MsUser.email"), primary_key=True)
    quantity = db.Column(db.Integer, nullable=False, default=1)