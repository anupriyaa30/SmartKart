from flask import Flask, request
from flask_cors import CORS
import pandas as pd
from pymongo import MongoClient
import json
import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pickle

app = Flask(__name__)

allowed_origins = [
    "http://localhost:5000"
]
CORS(app, resources={r"/*": {"origins": allowed_origins}})

try:
    client = MongoClient('mongodb+srv://cluster0_admin:cluster0123@cluster0.m7twqzk.mongodb.net/?retryWrites=true&w=majority')
    print("Connected to MongoDB")
    db = client['SmartDB']
except:
    print("Can't connect to MongoDB")


# Preprocess function
def preprocess(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return text

@app.route('/search', methods=['POST'])
def analyze_data():
    data = json.loads(request.data)
    search_query = data['query']
    collection = db['products_70']
    collection_data = list(collection.find({}))
    df = pd.DataFrame(collection_data)

    with open('product-search-model_70.pkl', 'rb') as file:
      loaded_vectorizer, loaded_tfidf_matrix = pickle.load(file)

    preprocessed_query = preprocess(search_query)
    query_tfidf = loaded_vectorizer.transform([preprocessed_query])
    cosine_similarities = cosine_similarity(query_tfidf, loaded_tfidf_matrix).flatten()
    top_indices = np.argsort(cosine_similarities)[::-1][:100]

    mask = top_indices < 7790
    top_indices = top_indices[mask]
    top_similar_products = df.iloc[top_indices]

    search_results = []
    for rank, row in enumerate(top_similar_products.iterrows(), start=1):
        product_id = row[1]['id']
        product_name = row[1]['name']
        product_url = row[1]['link']
        product_image = row[1]['image']
        product = {'id': product_id, 'name': product_image, 'image': product_image, 'url': product_url}
        search_results.append(product)

    response = {"results": search_results}
    return response

if __name__ == '__main__':
    app.run(port=5001)