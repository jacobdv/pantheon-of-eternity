// List of stocks.
let autoStocks = ['RACE','F','GM','HMC','TTM','TM'];

// Initial HTML.
let body = d3.select('body');
let divOne = body.append('div').attr('id','divOne');
let header = divOne.append('h1').attr('id','header').text('Pantheon of Eternity Auto Stocks');
let stockNavBar = divOne.append('ul').attr('id','stockNavBar');

// Reloads homepage on title click.
header.on('click', function() {
    location.reload();
});

// Creates navbar based on stock list.
autoStocks.forEach(auto => {
    let navLI = stockNavBar.append('li').classed('navLI', true).attr('value', auto);
    let stockLink = navLI.append('a').classed('stockLink', true).classed('active', false).classed('inactive', true).text(auto);
});

// Home page.
let divTwo = body.append('div').attr('id','divTwo');

// Sets active link on click.
stockNavBar.selectAll('li').on('click', function() {
    let selectedStock = d3.select(this);
    
    // Console logs click.
    console.log(`Click. @Navbar=> ${selectedStock.attr('value')}`);
    
    // Sets active class for selected stock, inactive for the rest.
    let navList = d3.selectAll('li').classed('active', false).classed('inactive', true);
    selectedStock.classed('active', true).classed('inactive', false);

    // Calls display function.
    displayStockData(selectedStock.attr('value'));
});

function displayStockData(symbol) {
    // Clears previous content in this header spot.
    divTwo.html('');
    
    // Adds content.
    let contentHeader = divTwo.append('h3').attr('id','contentHeader').text(symbol);
    let content = divTwo.append('ul').attr('id','contentUL');

    // Calls MongoDB.
    d3.json(`http://127.0.0.1:5000/zAPI/stock/${symbol}/`).then(stockCall => {
        let prices = stockCall[(stockCall.length - 1)].prices;
        Object.entries(prices).forEach(item => {
            let descriptor = item[0];
            let value = item[1];
            let li = content.append('li');
            li.classed('priceList', true).text(`${descriptor}: $${value}`);
        });

        // Adds graph.
        let graph = content.append('div').attr('id','chart');
        
        // Arrays for graphing.
        let dates = stockCall.map(item => item.date);
        let currentPriceList = stockCall.map(item => item.prices.current);
        let startDate = dates[0];
        let endDate = dates.slice(-1)[0];
        let trace = {
            type: 'scatter',
            mode: 'lines+markers',
            name: symbol,
            x: dates,
            y: currentPriceList, 
            line: {
                color: 'black'
            }
        };
        let data = [trace];
        let layout = {
            title: 'Closing Prices',
            xaxis: {
                title: 'Date',
                range: [startDate * 0.8, endDate * 1.2],
                type: 'date'
            },
            yaxis: {
                title: 'Price per Share',
                range: [0, (Math.max(currentPriceList) * 1.2)],
                type: 'linear'
            }
        };
        Plotly.newPlot('chart', data, layout);
    });
};