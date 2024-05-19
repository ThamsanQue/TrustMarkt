import os
import shutil
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace


app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
  return 'Welcome to Deep Trust API!, Please use /recognize route to perform facial recognition'

# Route for facial recognition
@app.route('/recognize', methods=['POST'])
def recognize():
    # Parse JSON payload
    data = request.json
    name = data.get('name')
    image_url = data.get('imageUrl')
    
    if not name or not image_url:
        return jsonify({'error': 'Name or imageUrl not provided in the payload'}), 400
    
    # Create a folder using the provided name
    folder_path = f'/tmp/{name}'
    os.makedirs(folder_path, exist_ok=True)
    
    # Download the image
    image_path = os.path.join(folder_path, 'uploaded_image.jpg')
    try:
        response = requests.get(image_url, stream=True)
        with open(image_path, 'wb') as f:
            shutil.copyfileobj(response.raw, f)
    except Exception as e:
        return jsonify({'error': f'Failed to download image: {str(e)}'}), 500
    
    # Check if the image was saved successfully
    if not os.path.exists(image_path):
        return jsonify({'error': 'Image was not saved successfully'}), 500
    
    # Perform facial recognition with enforce_detection set to False
    try:
        result = DeepFace.analyze(image_path, enforce_detection=False)
        recognized_faces = result[0]  # Access the first element of the result list
    except Exception as e:
        return jsonify({'error': f'Error during facial recognition: {str(e)}'}), 500
    
    return jsonify({
        'message': 'Face recognition successful',
        'status': 'success',
        'image_path': image_path,
        'recognized_faces': recognized_faces
    })

if __name__ == '__main__':
    app.run(debug=True)