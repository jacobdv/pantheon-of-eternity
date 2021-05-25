# Pantheon of Eternity

## Project 3 Proposal

Our proposal is to use the following compiled stock market data from publicly traded car companies to see if we can develop a model to predict stock prices over a given period using Consumer Sentiment in the University of Michigan polling on buying conditions for vehicles.

https://www.kaggle.com/borismarjanovic/price-volume-data-for-all-us-stocks-etfs

https://www.quandl.com/data/UMICH-Consumer-Sentiment?keyword=vehicle

* Our initial plan it to use an iterative process to cycle through the vehicle stock text files and compile them into a single data frame.
* We will then iterate through the data frame to append the monthly sentiment values as additional columns to the daily stock prices.
* That initial large data frame will be used to train the model using sentiment values: Good time to Buy,	Uncertain,	Bad time to Buy



