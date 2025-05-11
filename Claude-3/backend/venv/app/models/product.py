import uuid
from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import UUID

class MsProduct(db.Model):
    __tablename__ = 'MsProduct'
    
    ProductId = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ProductName = db.Column(db.String(50), nullable=False)
    ProductDescription = db.Column(db.Text, nullable=True)
    ProductImages = db.Column(db.String(255), nullable=True)  # Storing image paths/URLs
    ProductPrice = db.Column(db.Numeric(10, 2), nullable=False)
    ProductStock = db.Column(db.Integer, default=0)
    ProductOwner = db.Column(db.String(100), db.ForeignKey('MsUser.email'), nullable=False)
    CreatedAt = db.Column(db.DateTime, default=datetime.utcnow)
    UpdatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    IsActive = db.Column(db.Boolean, default=True)
    
    # Define relationship with user
    owner = db.relationship('MsUser', backref=db.backref('products', lazy=True))
    
    def to_dict(self):
        return {
            'ProductId': str(self.ProductId),
            'ProductName': self.ProductName,
            'ProductDescription': self.ProductDescription,
            'ProductImages': self.ProductImages,
            'ProductPrice': float(self.ProductPrice),
            'ProductStock': self.ProductStock,
            'ProductOwner': self.ProductOwner,
            'CreatedAt': self.CreatedAt.isoformat() if self.CreatedAt else None,
            'UpdatedAt': self.UpdatedAt.isoformat() if self.UpdatedAt else None,
            'IsActive': self.IsActive
        }