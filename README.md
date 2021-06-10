# Pantheon of Eternity

## Project 3 Proposal

Our proposal is to use the following compiled stock market data from publicly traded car companies to see if we can develop a model to predict stock prices over time using Consumer Sentiment in the University of Michigan polling on buying conditions for vehicles.

https://www.kaggle.com/borismarjanovic/price-volume-data-for-all-us-stocks-etfs

https://www.quandl.com/data/UMICH-Consumer-Sentiment?keyword=vehicle

* Our initial plan it to use an iterative process to cycle through the vehicle stock text files and compile them into a single data frame.
* We will then create a dataframe column in the stock data formulating a date/year value so we can join the monthly sentiment data frame.
* The sentiment data is retreavable in a CSV format in the Quandl API and will be read into a separate data frame.
* That joined data frame will be used to train the model using the sentiment values: Good time to Buy,	Uncertain,	Bad time to Buy to help predict a stock price.
* Initially we're targeting a linear ML model.

## Project 3 Final Site

https://pantheon-of-eternity.herokuapp.com/



