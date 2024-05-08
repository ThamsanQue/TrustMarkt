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
    user = supabase.table("trustmarkt1_user").select("*").execute()
    
    # response = supabase.table('countries').select("*").execute()

    # Assert we pulled real data.
    assert len(user.data) > 0
    return  jsonify(user.data)

@app.route('/verify')
def face_verification(img1_url, img2_url ):
    # Retrieve images from Supabase database
    # Example: Fetching images from a Supabase table named 'images'
    result = supabase.select('images').execute()
    img_paths = [row['image_path'] for row in result['data']]

    # Perform face verification
    result = DeepFace.verify(img1_path=img_url, img2_path=img2_url, model_name=models[0])

    return jsonify(result)

@app.route('/recognize')
def face_recognition(img_url):
    # Retrieve images from Supabase database
    result = supabase.select('images').execute()
    # Perform face recognition
    dfs = DeepFace.find(img_path=img_url, 
                        db_path=json.dumps(result['data']), 
                        model_name=models[1])

    return jsonify(dfs)

@app.route('/embeddings')
def face_embeddings(img_url):
    # Retrieve images from Supabase database
    # Example: Fetching images from a Supabase table named 'images'
    result = supabase.select('images').execute()

    # Calculate embeddings
    embedding_objs = DeepFace.represent(img_path=img_url, model_name=models[2])

    return jsonify(embedding_objs)

if __name__ == '__main__':
    app.run(debug=True)