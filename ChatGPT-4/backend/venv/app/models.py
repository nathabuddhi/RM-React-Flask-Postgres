from app import db

class MsUser(db.Model):
    __tablename__ = 'MsUser'

    email = db.Column(db.String(100), primary_key=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(15), nullable=False)
