from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from api.auth import init_auth_routes

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

init_auth_routes(app)

if __name__ == '__main__':
    app.run(debug=True)