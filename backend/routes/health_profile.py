from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.db import mongo
from datetime import datetime, timezone
import requests

health_profile = Blueprint('health_profile', __name__)

@health_profile.route('/health-profile', methods=['POST'])
@jwt_required()
def create_health_profile():
    data = request.get_json()
    user_id = get_jwt_identity()

    required_fields = ['age', 'gender', 'bmi', 'familyHistory', 'fastingBloodSugar', 'hba1c', 'symptoms']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    # Construct prompt for prediction API
    prompt = (
        f"Patient Information:\n\n"
        f"Age: {data['age']}\n"
        f"Gender: {data['gender']}\n"
        f"BMI: {data['bmi']}\n"
        f"Family History of Diabetes: {'Yes' if data['familyHistory'].lower() == 'yes' else 'No'}\n"
        f"Symptoms: {data['symptoms']}\n"
        f"Fasting Blood Sugar: {data['fastingBloodSugar']} mg/dL\n"
        f"HbA1c: {data['hba1c']}%\n\n"
        f"Question: Does this patient have diabetes? Answer with only 'Yes' or 'No'."
    )

    # Call external prediction API
    try:
        response = requests.post(
            'https://rude-rockets-call.loca.lt/generate',
            json={'prompt': prompt},
            timeout=20
        )
        output = response.json()['output']
        print("External response:", output) 
        response.raise_for_status()
        prediction_text = output.strip().lower()
        has_diabetes = 'yes' in prediction_text
    except Exception as e:
        print(f"Error calling diabetes prediction API: {e}")
        return jsonify({'error': 'Failed to analyze diabetes prediction'}), 500

    profile = {
        'user_id': user_id,
        'age': int(data['age']),
        'gender': data['gender'],
        'bmi': float(data['bmi']),
        'family_history': data['familyHistory'] == 'yes',
        'fasting_blood_sugar': float(data['fastingBloodSugar']),
        'hba1c': float(data['hba1c']),
        'symptoms': data['symptoms'],
        'has_diabetes': has_diabetes,
        'medicalHistory': prediction_text,
        'created_at': datetime.now(timezone.utc)
    }

    result = mongo.db.health_profiles.insert_one(profile)
    return jsonify({
        'message': 'Health profile saved',
        'id': str(result.inserted_id),
        'prediction': 'Yes' if has_diabetes else 'No',
        'result': prediction_text
    }), 201