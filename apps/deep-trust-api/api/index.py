from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify
from deepface import DeepFace
import os
from supabase import create_client, Client
import json


app = Flask(__name__)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

models = [
  "VGG-Face", 
  "Facenet", 
  "Facenet512", 
  "OpenFace", 
  "DeepFace", 
  "DeepID", 
  "ArcFace", 
  "Dlib", 
  "SFace",
  "GhostFaceNet",
]

@app.route("/")
def home():
    user = supabase.table("users").select("*").execute()
    
    # response = supabase.table('countries').select("*").execute()

    # Assert we pulled real data.
    assert len(user.data) > 0
    return  jsonify(user.data)

@app.route('/faces')
def face_recognition():
    imageDb = supabase.table("faces").select("*").execute()
    assert len(imageDb.data) > 0
    models = [
      "VGG-Face",
      "Facenet",
      "Facenet512",
      "OpenFace",
      "DeepFace",
      "DeepID",
      "ArcFace",
      "Dlib",
      "SFace",
    ]
    
    recognizer = DeepFace.stream(db_path="/home/notSteve/dev/turbo/TrustMarkt/apps/deep-trust-api/api/faces", model_name=models[4], detector_backend="mtcnn")
    # recognizer = DeepFace.stream(db_path="${imageDb.data}", model_name="Facenet512", detector_backend="mtcnn")
    
    return recognizer

if __name__ == '__main__':
    app.run(debug=True)
    
    
    # "https://res.cloudinary.com/ddsnqfovk/image/upload/v1715284072/faces/WhatsApp_Image_2024-05-09_at_21.44.32_pj4drg.jpg", "https://res.cloudinary.com/ddsnqfovk/image/upload/v1715284071/faces/WhatsApp_Image_2024-05-09_at_21.44.30_1_a9hioz.jpg","https://res.cloudinary.com/ddsnqfovk/image/upload/v1715284071/faces/WhatsApp_Image_2024-05-09_at_21.44.31_cmlrpx.jpg", "https://res.cloudinary.com/ddsnqfovk/image/upload/v1715284071/faces/WhatsApp_Image_2024-05-09_at_21.44.31_1_zhfhjk.jpg", "https://res.cloudinary.com/ddsnqfovk/image/upload/v1715284071/faces/WhatsApp_Image_2024-05-09_at_21.44.30_vg9piz.jpg","https://res.cloudinary.com/ddsnqfovk/image/upload/v1715284070/faces/WhatsApp_Image_2024-05-09_at_21.43.04_x6mtls.jpg"