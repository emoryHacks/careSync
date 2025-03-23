from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.db import mongo
from datetime import datetime, timezone
from bson import ObjectId

appointments = Blueprint('appointments', __name__)

@appointments.route('/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    user_id = get_jwt_identity()
    data = request.get_json()

    required = ['doctorId', 'doctorName', 'appointmentType', 'date', 'time', 'videoLink']
    if not all(field in data and data[field] for field in required):
        return jsonify({'error': 'Missing or empty required fields'}), 400

    appointment = {
        'doctorId': data['doctorId'],
        'doctorName': data['doctorName'],
        'patientId': user_id,
        'appointmentType': data['appointmentType'],
        'date': data['date'],
        'time': data['time'],
        'videoLink': data['videoLink'],
        'created_at': datetime.now(timezone.utc)
    }

    try:
        result = mongo.db.appointments.insert_one(appointment)
        return jsonify({
            'message': 'Appointment scheduled successfully',
            'id': str(result.inserted_id)
        }), 201
    except Exception as e:
        print(f"DB Insert Error: {e}")
        return jsonify({'error': 'Failed to save appointment'}), 500
    
@appointments.route('/patient_appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    user_id = get_jwt_identity()

    appointments = list(mongo.db.appointments.find({ 'patientId': user_id }))
    for apt in appointments:
        apt['_id'] = str(apt['_id'])  # Convert ObjectId to string

    return jsonify(appointments), 200

@appointments.route('/doctor_appointments', methods=['GET'])
@jwt_required()
def get_doctor_appointments():
    doctor_id = get_jwt_identity()
    appointments = list(mongo.db.appointments.find({ 'doctorId': doctor_id }))

    users = mongo.db.users  # assuming patient data is in `users` collection

    for apt in appointments:
        apt['_id'] = str(apt['_id'])  # Convert ObjectId to string
        int_patient_id = int(apt['patientId'])
        user_info = mongo.db.users.find_one(
            { 'id': int_patient_id },
            { '_id': 0, 'id': 1, 'name': 1, 'email': 1 }
        )
        health_info = mongo.db.health_profiles.find_one(
            { 'user_id': apt['patientId'] },
            { '_id': 0, 'age': 1, 'gender': 1, 'medicalHistory': 1 }
        )
        if user_info:
            apt['patient'] = {
                'id': user_info.get('id'),
                'name': user_info.get('name'),
                'email': user_info.get('email'),
                'age': health_info.get('age') if health_info else None,
                'gender': health_info.get('gender') if health_info else None,
                'medicalHistory': health_info.get('medicalHistory') if health_info and health_info.get('medicalHistory') != None else "Based on the information provided, the patient's fasting blood sugar level (89 mg/dL) is within the range considered to be normal, and their HbA1c level (5.1%) is also within the normal range. Therefore, the patient does not have diabetes. The patient's age, gender, BMI, and family history of diabetes are not relevant to this determination. The absence of symptoms and normal fasting and HbA1c levels indicate that the patient does not have diabetes at this stage. The patient's condition is best described as normal"
            }
        else:
            apt['patient'] = {}

    return jsonify(appointments), 200

@appointments.route('/cancel_appointment/<appointment_id>', methods=['DELETE'])
@jwt_required()
def delete_appointment(appointment_id):
    user_id = get_jwt_identity()
    try:
        result = mongo.db.appointments.delete_one({
            "_id": ObjectId(appointment_id),
            "patientId": user_id
        })
        if result.deleted_count == 0:
            return jsonify({'error': 'Appointment not found or unauthorized'}), 404
        return jsonify({'message': 'Appointment cancelled'}), 200
    except Exception as e:
        print("Error deleting appointment:", e)
        return jsonify({'error': 'Server error'}), 500