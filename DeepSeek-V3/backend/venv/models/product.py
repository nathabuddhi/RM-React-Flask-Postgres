from models import db
import uuid

class MsProduct(db.Model):
    __tablename__ = 'MsProduct'
    
    product_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_name = db.Column(db.String(50), nullable=False)
    product_description = db.Column(db.Text)
    product_images = db.Column(db.JSON)  # Storing image URLs as JSON array
    product_price = db.Column(db.Numeric(10, 2), nullable=False)
    product_stock = db.Column(db.Integer, nullable=False)
    product_owner = db.Column(db.String(100), db.ForeignKey('MsUser.email'), nullable=False)

    def to_dict(self):
        return {
            'product_id': self.product_id,
            'product_name': self.product_name,
            'product_description': self.product_description,
            'product_images': self.product_images or [],
            'product_price': float(self.product_price),
            'product_stock': self.product_stock,
            'product_owner': self.product_owner
        }