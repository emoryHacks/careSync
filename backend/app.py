from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models.db import mongo
from routes.auth import auth
from routes.appointments import appointments
from routes.health_profile import health_profile
from routes.food_intake import food_intake

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
mongo.init_app(app)
try:
    # Perform a dummy operation (like listing collections)
    with app.app_context():
        mongo.db.list_collection_names()
    print("MongoDB connection successful!")
except Exception as e:
    print("MongoDB connection failed:", e)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True, methods=["GET", "POST", "DELETE", "OPTIONS"])
jwt = JWTManager(app)

# --- JWT Error Handlers ---
@jwt.unauthorized_loader
def custom_unauthorized_response(reason):
    print("JWT unauthorized:", reason)
    return jsonify({"error": "Unauthorized"}), 401

@jwt.invalid_token_loader
def custom_invalid_token_response(reason):
    print("JWT invalid:", reason)
    return jsonify({"error": "Invalid token", "reason": reason}), 422

# Register routes
app.register_blueprint(auth, url_prefix='/api')
app.register_blueprint(appointments, url_prefix='/api')
app.register_blueprint(health_profile, url_prefix='/api')
app.register_blueprint(food_intake, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
