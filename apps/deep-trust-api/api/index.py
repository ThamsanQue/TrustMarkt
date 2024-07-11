import os
import shutil
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import mediapipe as mp
import cv2
import numpy as np
import json
import pickle

app = Flask(__name__)
CORS(app)

mp_face_mesh = mp.solutions.face_mesh


def detect_face_landmarks(image):
    with mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1) as face_mesh:
        results = face_mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        if results.multi_face_landmarks:
            face_landmarks = results.multi_face_landmarks[0]
            landmarks = [(int(point.x * image.shape[1]), int(point.y * image.shape[0]))
                         for point in face_landmarks.landmark]
            return landmarks
        return None


def save_landmarks(name, landmarks):
    if not os.path.exists('landmarks'):
        os.makedirs('landmarks')
    with open(f'landmarks/{name}.pkl', 'wb') as f:
        pickle.dump(landmarks, f)


def load_landmarks(name):
    try:
        with open(f'landmarks/{name}.pkl', 'rb') as f:
            landmarks = pickle.load(f)
        return landmarks
    except FileNotFoundError:
        return None


def compare_landmarks(landmarks1, landmarks2, threshold=0.6):
    if len(landmarks1) != len(landmarks2):
        return False
    distances = np.linalg.norm(
        np.array(landmarks1) - np.array(landmarks2), axis=1)
    mean_distance = np.mean(distances)
    return mean_distance < threshold


@app.route('/')
def hello():
    return 'Welcome to Deep Trust API! Use /register to register a face and /authenticate to authenticate a face.'


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    images = json.loads(data.get('imageUrl'))
    image_url = images[0]

    if not name or not image_url:
        return jsonify({'error': 'Name or imageUrl not provided in the payload'}), 400

    folder_path = f'/tmp/{name}'
    os.makedirs(folder_path, exist_ok=True)

    image_path = os.path.join(folder_path, 'uploaded_image.jpg')
    try:
        response = requests.get(image_url, stream=True)
        with open(image_path, 'wb') as f:
            shutil.copyfileobj(response.raw, f)
    except Exception as e:
        return jsonify({'error': f'Failed to download image: {str(e)}'}), 500

    if not os.path.exists(image_path):
        return jsonify({'error': 'Image was not saved successfully'}), 500

    image = cv2.imread(image_path)
    landmarks = detect_face_landmarks(image)

    if landmarks:
        save_landmarks(name, landmarks)
        return jsonify({
            'message': 'Face registration successful',
            'status': 'success',
            'landmarks': landmarks
        })
    else:
        return jsonify({'error': 'No face detected'}), 400


@app.route('/authenticate', methods=['POST'])
def authenticate():
    data = request.json
    name = data.get('name')
    images = json.loads(data.get('imageUrl'))
    image_url = images[0]

    if not name or not image_url:
        return jsonify({'error': 'Name or imageUrl not provided in the payload'}), 400

    folder_path = f'/tmp/{name}'
    os.makedirs(folder_path, exist_ok=True)

    image_path = os.path.join(folder_path, 'uploaded_image.jpg')
    try:
        response = requests.get(image_url, stream=True)
        with open(image_path, 'wb') as f:
            shutil.copyfileobj(response.raw, f)
    except Exception as e:
        return jsonify({'error': f'Failed to download image: {str(e)}'}), 500

    if not os.path.exists(image_path):
        return jsonify({'error': 'Image was not saved successfully'}), 500

    image = cv2.imread(image_path)
    landmarks = detect_face_landmarks(image)

    if landmarks:
        stored_landmarks = load_landmarks(name)
        if stored_landmarks and compare_landmarks(stored_landmarks, landmarks):
            return jsonify({
                'message': 'Authentication successful',
                'status': 'success',
                'landmarks': landmarks
            })
        else:
            return jsonify({'error': 'Authentication failed'}), 401
    else:
        return jsonify({'error': 'No face detected'}), 400


if __name__ == '__main__':
    app.run(debug=True)
