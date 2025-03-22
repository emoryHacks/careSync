from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models.db import mongo
from routes.auth import auth
from routes.appointments import appointments

app = Flask(__name__)
app.config.from_object(Config)

# Init extensions
mongo.init_app(app)

try:
    # Perform a dummy operation (like listing collections)
    with app.app_context():
        mongo.db.list_collection_names()
    print("MongoDB connection successful!")
except Exception as e:
    print("MongoDB connection failed:", e)

CORS(app)
JWTManager(app)

# Register blueprints
app.register_blueprint(auth, url_prefix='/api')
app.register_blueprint(appointments, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
