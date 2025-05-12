from models import db
from werkzeug.security import generate_password_hash, check_password_hash

class MsUser(db.Model):
    __tablename__ = 'MsUser'
    
    email = db.Column(db.String(100), primary_key=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(15), nullable=False)
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def generate_token(self):
        from flask_jwt_extended import create_access_token 
        return create_access_token(identity={
            'email': self.email,
            'role': self.role
        })