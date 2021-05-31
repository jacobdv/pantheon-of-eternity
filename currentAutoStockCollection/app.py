# Import dependencies.
from flask import Flask, render_template, redirect, url_for, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from census import Census
import pymongo
from pymongo.message import query
import requests
from config import finnhub_API_KEY
from config import alpha_API_KEY
import datetime
import time

# Additional tools for API routes.
import json
from bson import json_util
from bson.json_util import dumps

# List of stocks.
autoStocks = ['RACE','F','GM','HMC','TTM','TM']

# Create an instance of Flask.
app = Flask(__name__)
CORS(app)

# Creating the database.
client = pymongo.MongoClient('mongodb://localhost:27017/')
autoStocksDB = client['PantheonAutoStocks']

# Connections to the MongoDB database.
app.config["DEBUG"] = True
app.config["MONGO_URI"] = "mongodb://localhost:27017/PantheonAutoStocks"
mongo = PyMongo(app)    

# Clears the collection for inputting the updated info.
day = int(datetime.date.today().strftime('%w'))
year = int(datetime.date.today().strftime('%Y'))
month = (datetime.date.today().strftime('%m'))
date = (datetime.date.today().strftime('%d'))

if day > 0 and day < 6:
    # Adding overview information for each stock.
    for stock in autoStocks:
        # Creates a collection for each stock.
        stockCollection = autoStocksDB[stock]

        # API request for each stock.
        vResponse = requests.get(f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={stock}&apikey={alpha_API_KEY}')
        vDict = vResponse.json()
        response = requests.get(f'https://finnhub.io/api/v1/quote?symbol={stock}&token={finnhub_API_KEY}')
        if response.status_code == 200:
            stockDict = response.json()
            stockObj = {
                'symbol': stock,
                'prices': {
                    'open': stockDict['o'],
                    'current': stockDict['c'],
                    'high': stockDict['h'],
                    'low': stockDict['l'],
                    'previousClose': stockDict['pc']
                },
                # Date has been verified. Currently using PST.
                'date': (datetime.datetime.fromtimestamp(stockDict['t']).strftime('%Y-%m-%d')),
                'volume': vDict['Time Series (Daily)'][f'{year}-{month}-{date}']['5. volume']
            }
            print(stockObj['volume'])
        else:
            print(f'There seems to have been an error with {stock}.')

        # Queries stock to see if there is already a price in for this day.
        todayQuery = { 'date': stockObj['date'] }
        queryResult = list(stockCollection.find(todayQuery))
            
        # Replaces today's values if there are any and adds them if there aren't.
        if len(queryResult) > 0:
            stockCollection.update_one(todayQuery, { '$set': stockObj })
        else:
            stockCollection.insert_one(stockObj)
        
        time.sleep(12)
        print(stock)

# Home route that displays index.html content.
@app.route("/")
def index():
    return render_template("index.html") 

# API Endpoint for each stock.
@app.route('/zAPI/stock/', defaults={'stock': autoStocks[0]})
@app.route('/zAPI/stock/<stock>/', methods=['GET','POST'])
def individualData(stock):  
    collection = autoStocksDB[f'{stock}']
    pricesList = list(collection.find())
    return json.dumps(pricesList, default = json_util.default)

# Do the thing. (:
if __name__ == "__main__":
    app.run(debug=True)
