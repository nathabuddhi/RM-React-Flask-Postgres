# app.py
from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })
    # Initialize extensions
    JWTManager(app)
    db.init_app(app)
    
    # Register blueprints
    from api.auth import auth_bp
    app.register_blueprint(auth_bp)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)