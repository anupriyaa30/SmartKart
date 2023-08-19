from flask import Flask, request
from flask_cors import CORS
import pandas as pd
from pymongo import MongoClient
import json
import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pickle
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

allowed_origins = [
    "http://localhost:3000"
]
CORS(app, resources={r"/*": {"origins": allowed_origins}})

try:
    client = MongoClient(os.environ.get('ATLAS_URI'))
    print("Connected to MongoDB")
    db = client['SmartDB']
except:
    print("Can't connect to MongoDB")

@app.route('/top_products', methods=['GET'])
def top_products():
    collection = db['products_70']
    all_data = list(collection.find())
    df = pd.DataFrame(all_data)
    v=df['no_of_ratings']
    R=df['ratings']
    C=df['ratings'].mean()
    m=df['no_of_ratings'].quantile(0.90)

    df = pd.DataFrame(all_data)
    column_order = ['id'] + [col for col in df.columns if col != 'id' and col != '_id' and col != 'Unnamed: 0']
    df = df[column_order]
    df.drop(columns=['link'])
    df['weighted_average']=((R*v)+ (C*m))/(v+m)

    df_grouped = df.groupby("main_category")
    category_lists = {}

    for main_category, group_data in df_grouped:
        category_lists[main_category] = group_data.values.tolist()
        
    final = []
    for i in list(category_lists.keys()):
        dff = pd.DataFrame(category_lists[i])
        dff_sorted=dff.sort_values(by=dff.columns[10],ascending=False)
        final.append(dff_sorted.to_dict('records'))

    j = 0
    category_wise = {}
    for i in list(category_lists.keys()):
        category_wise[i] = final[j]
        j += 1

    response = {"message": category_wise}
    # print(category_wise)
    return response

# Preprocess function
def preprocess(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return text

@app.route('/search', methods=['GET'])
def analyze_data():
    search_query = request.args.get('query')
    collection = db['products_70']
    # collection_data = list(collection.find({}))
    # df = pd.DataFrame(collection_data)

    # with open('product-search-model_70.pkl', 'rb') as file:
    #     loaded_vectorizer, loaded_tfidf_matrix = pickle.load(file)

    # preprocessed_query = preprocess(search_query)
    # query_tfidf = loaded_vectorizer.transform([preprocessed_query])
    # cosine_similarities = cosine_similarity(query_tfidf, loaded_tfidf_matrix).flatten()
    # top_indices = np.argsort(cosine_similarities)[::-1][:100]

    # mask = top_indices < 7790
    # top_indices = top_indices[mask]
    # top_similar_products = df.iloc[top_indices]

    # search_results = []
    # for rank, row in enumerate(top_similar_products.iterrows(), start=1):
    #     product = {'id': row[1]['id'], 'name': row[1]['name'], 'image': row[1]['image'], 'discount_price': row[1]['discount_price'], 'actual_price': row[1]['actual_price'], 'ratings': row[1]['ratings'], 'no_of_ratings': row[1]['no_of_ratings'], 'main_category': row[1]['main_category'], 'sub_category': row[1]['sub_category']}
    #     search_results.append(product)

    
    search_query = [
        {
            "$search": {
                "index": "default",
                "text": {
                    "query": search_query,
                    "path": {
                        "wildcard": "*"
                    }
                }
            }
        }
    ]

    search_results = list(collection.aggregate(search_query))
    for result in search_results:
        result.pop('_id', None)
    response = {"message": search_results}
    return response

if __name__ == '__main__':
    app.run(port=5001)