# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)
    
    # Import and register blueprints
    from app.routes.auth import auth_bp
    from app.routes.product import product_bp

    app.register_blueprint(product_bp)
    app.register_blueprint(auth_bp)
    
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    return app