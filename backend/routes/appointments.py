from flask import Blueprint, request, jsonify
from models.db import mongo
from flask_jwt_extended import jwt_required, get_jwt_identity

appointments = Blueprint('appointments', __name__)

@appointments.route('/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    data = request.get_json()
    user_id = get_jwt_identity()

    appointment = {
        'doctor_id': data['doctor_id'],
        'patient_id': user_id,
        'date': data['date'],
        'time': data['time'],
        'status': 'scheduled',
        'meeting_link': data.get('meeting_link', 'https://meet.google.com/xyz-1234')  # Static or dynamic
    }

    result = mongo.db.schedules.insert_one(appointment)
    return jsonify({ 'message': 'Appointment created', 'id': str(result.inserted_id) }), 201