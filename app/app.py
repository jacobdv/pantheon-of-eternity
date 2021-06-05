# Dependencies
from flask import Flask, render_template, redirect, url_for, jsonify, request
from flask_cors import CORS
import tensorflow as tf

# App
app = Flask(__name__)
CORS(app)

# Model
model = tf.keras.models.load_model('saved_model/')

# Routes
@app.route("/")
def index():
    return render_template("index.html")

# Debug
if __name__ == "__main__":
    app.run(debug=True)