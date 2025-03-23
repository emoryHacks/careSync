from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from models.db import mongo
from utils.token import generate_token
from utils.counter import get_next_user_id
from flask_jwt_extended import jwt_required
from bson import ObjectId

auth = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data['email']
    password = data['password']
    name = data.get('name')
    role = data.get('role', 'patient')
    print(data)

    existing_user = mongo.db.users.find_one({'email': email})
    if existing_user:
        return jsonify({'error': 'Email already registered'}), 400

    user_id = get_next_user_id()
    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = {
        'id': user_id,
        'email': email,
        'password': hashed_pw,
        'name': name,
        'role': role
    }

    result = mongo.db.users.insert_one(new_user)
    return jsonify({'message': 'User registered successfully', 'id': str(result.inserted_id)}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = mongo.db.users.find_one({'email': data['email']})
    if not user or not bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = generate_token(str(user['id']))
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user.get('name'),
            'role': user.get('role')
        }
    })