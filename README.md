# Pantheon of Eternity

## Project 3 Proposal

Our proposal is to use the following compiled stock market data and apply a machine learning model to features such as various length "closing price averages" and "average daily volumes" to allow a user to evaluate a simple trading strategy for a particular stock.

https://www.kaggle.com/borismarjanovic/price-volume-data-for-all-us-stocks-etfs

* Our initial plan it to use an iterative process to cycle through the stock text files and compile them into a single data frame.
* We will then iterate through the data frame again to calculate a moving average closing price for a previous period.
* That initial large data frame will be used to train the model using closing price and volume differences from the average closing values as features for the model.
* Then we're hoping to produce a "front-end" component that will allow a user to enter a particular stock and return the optimal moving average values to focus on.
