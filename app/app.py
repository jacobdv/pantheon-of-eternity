# Dependencies
from flask import Flask, render_template, redirect, url_for, jsonify, request
from flask_cors import CORS
from tensorflow.python.keras.backend import global_learning_phase_is_set
from flask_pymongo import PyMongo
import pymongo
import tensorflow as tf
import datetime as dt

# Additional tools for API routes.
import json
from bson import json_util
from bson.json_util import dumps

# TensorFlow
from tensorflow.keras.layers.experimental import preprocessing
import numpy as np
import os

# Pulling current date.
date = dt.date.today()
thisYear = date.strftime('%Y')
thisMonth = date.strftime('%m')
thisDay = date.strftime('%d')

# App
app = Flask(__name__)
CORS(app)

# MongoDB Atlas Connection
client = pymongo.MongoClient(os.environ['MONGO_URI'])
db = client['stocks']
app.config['DEBUG'] = True # MAYBE CHANGE HERE
app.config['MONGO_URI'] = os.environ['MONGO_URI']
mongo = PyMongo(app)
collection = db['car_stocks_2017']

# Model
model = tf.keras.models.load_model('saved_model/')
model.build()
print(model.summary())

# Routes
@app.route("/")
def index():
    return render_template("index.html")

@app.route('/interactive/')
def interactive():
    return render_template('interactive.html')

@app.route('/analysis/')
def analysis():
    return render_template('analysis.html')

@app.route('/api/v1/<date>/', methods=['GET','POST'])
def mongoDatabase(date):
    date = date.split('-')
    year = float(date[0])
    month = float(date[1])
    day = float(date[2])
    singleValue = list(collection.find({ 'Year': year, 'Month': month, 'Day': day },{'_id': 0}))

    modelArray = []
    for stock in singleValue:
        objectArray = []
        objectArray.append(stock['Year'])
        objectArray.append(stock['Month'])
        objectArray.append(stock['Day'])
        objectArray.append(stock['Open'])
        objectArray.append(stock['Close'])
        objectArray.append(stock['Volume'])
        objectArray.append(stock['Symbol_F'])
        objectArray.append(stock['Symbol_GM'])
        objectArray.append(stock['Symbol_HMC'])
        objectArray.append(stock['Symbol_RACE'])
        objectArray.append(stock['Symbol_TM'])
        objectArray.append(stock['Symbol_TTM'])
        modelArray.append(objectArray)

    normalizer = preprocessing.Normalization()
    normalizer.adapt(np.array(modelArray))

    result = model.predict(modelArray).flatten()
    avg = result.sum()/len(modelArray)

    return json.dumps((avg, singleValue), default=json_util.default)

@app.route('/api/v1/stockData/<stock>/', methods=['GET','POST'])
def allData(stock):
    data = list(collection.find({ f'Symbol_{stock}':1 }))
    return json.dumps(data, default=json_util.default)

# Debug
if __name__ == "__main__":
    app.run(debug=True)