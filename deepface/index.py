from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace

app = Flask(__name__)
CORS(app)

@app.route("/deepface/hello")
def hello_world():
    return "<p>Hello, I recognized you!</p>"

@app.route("/deepface/analyze", methods=["POST"])
def face():
    # get the image from the request
    image = request.files["image"]
    # analyze the image with DeepFace
    result = DeepFace.analyze(image, actions=["age", "gender", "race"])
    # return the result as JSON
    return jsonify(result)