from flask import Flask, request, jsonify
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
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
import jwt

load_dotenv()

SECRET_KEY = os.environ.get('ACCESS_TOKEN_SECRET')

app = Flask(__name__)
allowed_origins = [
    "http://localhost:3000",
    "https://smartkart.vercel.app"
]
CORS(app, resources={r"/*": {"origins": allowed_origins}}, supports_credentials=True)

try:
    client = MongoClient(os.environ.get('ATLAS_URI'))
    print("Connected to MongoDB")
    db = client['SmartDB']
except:
    print("Can't connect to MongoDB")


def getSimilar(product_id):
    collection = db['clicks']
    try:
        clicks = pd.DataFrame(collection.find())
        clicks.drop(columns=['_id'])
        ratings_utility_matrix = clicks.pivot_table(values='count', index='user', columns='product', fill_value=0)
        X = ratings_utility_matrix.T
        X1 = X
        SVD = TruncatedSVD(n_components=10)
        decomposed_matrix = SVD.fit_transform(X)
        correlation_matrix = np.corrcoef(decomposed_matrix)
        product_names = list(X.index)
        product_ID = product_names.index(product_id)
        correlation_product_ID = correlation_matrix[product_ID]
        Recommend = list(X.index[correlation_product_ID > 0.90])
        Recommend.remove(product_id) 
        ans = Recommend[0:9]

        products = pd.DataFrame(db['products_70'].find())
        column_order = ['id'] + [col for col in products.columns if col != 'id' and col != '_id' and col != 'Unnamed: 0']
        products = products[column_order]
        products.drop(columns=['link'])
        products = products[products['id'].isin(ans)]
        products = products.to_dict(orient='records')
        return products
    except:
        return []
    
def getLiked(user_id):
    db = client['SmartDB']
    col1 = db.products_70
    col2 = db.likes
    col3 = db.clicks
    col4 = db.orders
    likes = pd.DataFrame(col2.find())
    clicks = pd.DataFrame(col3.find())
    orders = pd.DataFrame(col4.find())
    products = pd.DataFrame(col1.find())

    interactions_df = pd.concat([likes, clicks, orders], ignore_index=True)

    interaction_matrix = interactions_df.pivot_table(index='user', columns='product', values='count', fill_value=0)
    user_similarity = cosine_similarity(interaction_matrix)
    num_users, num_products = interaction_matrix.shape
    user_product_recommendations = np.zeros((num_users, num_products))
    for user_idx in range(num_users):
        similar_users = np.argsort(user_similarity[user_idx])[::-1][1:]  # Exclude the user itself
        top_similar_users = similar_users[:10]  # You can adjust the number of similar users

        for product_idx in range(num_products):
            if interaction_matrix.iloc[user_idx, product_idx] == 0:
                user_product_score = np.dot(
                    user_similarity[user_idx][top_similar_users],
                    interaction_matrix.iloc[top_similar_users, product_idx]
                )
                user_product_recommendations[user_idx, product_idx] = user_product_score
    target_user_idx = interaction_matrix.index.get_loc(user_id)
    user_recommendation_scores = user_product_recommendations[target_user_idx]
    recommended_product_indices = np.argsort(user_recommendation_scores)[::-1][:50]
    recommended_products = products.loc[recommended_product_indices]
    df = pd.DataFrame(recommended_products)
    column_order = ['id'] + [col for col in df.columns if col != 'id' and col != '_id' and col != 'Unnamed: 0']
    df = df[column_order]
    df = df.drop(columns=['link'])

    df = df.to_dict(orient='records')
    return df


def getOrders(userId):
    db = client["SmartDB"]
    col1 = db["orders"]
    col2 = db['products_70']
    df = pd.DataFrame(col1.find({'user': userId})).drop(columns=['_id'])
    df2 = pd.DataFrame(col2.find())
    merge = pd.merge(df2, df, left_on=['id'], right_on=['product'])
    column_order = ['id'] + [col for col in df2.columns if col != 'id' and col != '_id' and col != 'Unnamed: 0']
    merge = merge[column_order].drop(columns=['link'])

    merge = merge.to_dict(orient='records')
    return merge

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

@app.route('/similar', methods=['POST'])
def similar():
    product_id = request.get_json()
    product_id = product_id['product']
    return {"message": getSimilar(product_id)}


@app.route('/userLikes', methods=['GET'])
def userLikes():
    jwt_token = request.cookies.get('login')
    
    if jwt_token:
        try:
            decoded_token = jwt.decode(jwt_token, SECRET_KEY, algorithms=['HS256'])
            user = decoded_token['data']['_id']
            result = getLiked(user)
            return {"message": result}
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.DecodeError:
            return jsonify({'error': 'Token is invalid'}), 401
    else:
        return jsonify({'error': 'No token provided'}), 401
    

@app.route('/popular', methods=['GET'])
def popular():
    col1 = db.products_70
    col2 = db.likes
    col3 = db.clicks
    prod = pd.DataFrame(col1.find())
    likes = pd.DataFrame(col2.find())
    clicks = pd.DataFrame(col3.find())
    likes.drop(columns=['_id'])
    clicks.drop(columns=['_id'])
    likes_count = likes.groupby('product').size().reset_index(name='likes_count')
    product_clicks_sum = clicks.groupby('product')['count'].sum().reset_index()
    merged_df = pd.merge(prod, likes_count, left_on='id', right_on='product', how='left')
    merged_df['likes_count'] = merged_df['likes_count'].fillna(0)
    merged_df = merged_df.drop(columns=['product'])

    final = pd.merge(merged_df, product_clicks_sum, left_on='id', right_on='product', how='left')
    final['count'] = final['count'].fillna(0)
    final = final.drop(columns=['product'])

    final['total'] = final['likes_count'] + final['count']
    sorted_final = final.sort_values(by='total', ascending=False)

    column_order = ['id'] + [col for col in sorted_final.columns if col != 'id' and col != '_id' and col != 'Unnamed: 0']
    sorted_final = sorted_final[column_order]
    sorted_final = sorted_final.drop(columns=['link'])[:50]
    sorted_final = sorted_final.to_dict(orient='records')
    return {"message": sorted_final}


@app.route('/myOrders', methods=['GET'])
def myOrders():
    jwt_token = request.cookies.get('login')
    
    if jwt_token:
        try:
            decoded_token = jwt.decode(jwt_token, SECRET_KEY, algorithms=['HS256'])
            user = decoded_token['data']['_id']
            result = getOrders(user)
            return {"message": result}
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.DecodeError:
            return jsonify({'error': 'Token is invalid'}), 401
    else:
        return jsonify({'error': 'No token provided'}), 401
    

@app.route('/', methods=['GET'])
def test():
    return 'Flask server ready'

if __name__ == '__main__':
    app.run(port=5001)