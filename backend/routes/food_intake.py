from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.db import mongo
from datetime import datetime, timezone

food_intake = Blueprint('food_intake', __name__)

@food_intake.route('/food-intake', methods=['POST'])
@jwt_required()
def log_food_intake():
    print('in log_food_intake')
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or 'meal' not in data or 'items' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    meal = data['meal'].lower()
    items = data['items']
    print('Received items ', items)

    for item in items:
        if not all(k in item for k in ['name', 'quantity_g', 'calories']):
            return jsonify({'error': 'Each item must have name, quantity_g, and calories'}), 400

    total_calories = sum(float(item['calories']) for item in items)

    intake = {
        'user_id': user_id,
        'date': datetime.now(timezone.utc).date().isoformat(),
        'meal': meal,
        'items': items,
        'total_calories': total_calories,
        'created_at': datetime.now(timezone.utc)
    }

    result = mongo.db.food_intake.insert_one(intake)

    return jsonify({
        'message': 'Food intake saved',
        'meal': meal,
        'total_calories': total_calories,
        'id': str(result.inserted_id)
    }), 201
