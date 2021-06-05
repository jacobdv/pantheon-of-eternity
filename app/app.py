# Dependencies
from flask import Flask, render_template, redirect, url_for, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
import tensorflow as tf
import datetime as dt

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

# Model
model = tf.keras.models.load_model('saved_model')
model.build()
print(model.summary())

# Data Test
# test = [[2.0170000e+03, 1.0000000e+00, 3.0000000e+00, 1.1634000e+02,
#         1.1671000e+02, 2.0719500e+05, 0.0000000e+00, 0.0000000e+00,
#         0.0000000e+00, 0.0000000e+00, 1.0000000e+00, 0.0000000e+00]]
# testResult = model.predict(test).flatten()
# print('---------------------------------------------------------------------------------------------------------------')
# print(testResult)

# Routes
@app.route("/")
def index():
    return render_template("index.html")

@app.route('/date/', defaults={
    'year': thisYear,
    'month': thisMonth,
    'day': thisDay
})
@app.route('/date/<year>/<month>/<day>/', methods=['GET','POST'])
def datePage():
    return render_template("date.html")

# Debug
if __name__ == "__main__":
    app.run(debug=True)