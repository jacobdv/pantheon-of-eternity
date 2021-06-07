# Dependencies
from flask import Flask, render_template, redirect, url_for, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
import pymongo
import tensorflow as tf
import datetime as dt

# Additional tools for API routes.
import json
from bson import json_util
from bson.json_util import dumps

# Pulling current date.
date = dt.date.today()
thisYear = date.strftime('%Y')
thisMonth = date.strftime('%m')
thisDay = date.strftime('%d')

# App
app = Flask(__name__)
CORS(app)

# MongoDB Atlas Connection
app.config['DEBUG'] = True
app.config['MONGO_URI'] = 'mongodb+srv://readonly:2kOAcow4qM6E4ANE@cluster0.6oig2.mongodb.net/test?authSource=admin&replicaSet=atlas-aont1m-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
mongo = PyMongo(app)
client = pymongo.MongoClient('mongodb+srv://readonly:2kOAcow4qM6E4ANE@cluster0.6oig2.mongodb.net/test?authSource=admin&replicaSet=atlas-aont1m-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
db = client['stocks']

# Model
model = tf.keras.models.load_model('saved_model')
model.build()
print(model.summary())

# Routes
@app.route("/")
def index():
    return render_template("index.html")

@app.route('/interactive/')
def interactive():
    return render_template('interactive.html')

@app.route('/api/v1/allData/')
def mongoDatabase():
    collection = db['car_stocks_2017']
    data = list(collection.find())
    return json.dumps(data, default = json_util.default)


# Debug
if __name__ == "__main__":
    app.run(debug=True)