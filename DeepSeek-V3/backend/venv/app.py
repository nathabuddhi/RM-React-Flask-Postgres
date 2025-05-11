from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

from models import db
db.init_app(app)
migrate = Migrate(app, db)

@app.route('/')
def hello():
    return {'message': 'E-commerce backend is running'}

if __name__ == '__main__':
    app.run(debug=True)