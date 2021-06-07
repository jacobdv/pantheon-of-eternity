// Setting Up Variables
let allDataLink = '/api/v1/allData/';
// Defaults to Ford as active stock.
let activeStock = 'F';
let activeDate = '2017-11-1'

// Data
function dataCharting(activeStock, activeDate) {
    console.log('--------------------')
    console.log(`Active Stock: ${activeStock}`)
    console.log(`Active Date: ${activeDate}`)
    let selectedEverything = '';
    let interactiveData = [];
    d3.json(allDataLink).then(data => {
        data.forEach(row => {
            // Checking Symbol
            let symbol = '';
            if (row.Symbol_F === 1) {
                symbol = 'F';
            } else if (row.Symbol_GM === 1) {
                symbol = 'GM';
            } else if (row.Symbol_HMC === 1) {
                symbol = 'HMC';
            } else if (row.Symbol_RACE === 1) {
                symbol = 'RACE';
            } else if (row.Symbol_TM === 1) {
                symbol = 'TM';
            } else if (row.Symbol_TTM === 1) {
                symbol = 'TTM';
            };

            // Creating Object
            let dataObj = {
                'Symbol': symbol,
                'Prices': {
                    'Open': row.Open,
                    'Close': row.Close,
                },
                'Date': `${row.Year}-${row.Month}-${row.Day}`
}
            if (dataObj.Symbol === activeStock) {
                if (dataObj.Date === activeDate) {
                    // This is object for the selected symbol and day.
                    selectedEverything = dataObj;
                }
                // Pushing Data Object to Array
                interactiveData.push(dataObj);
            }

            
        });
        console.log(selectedEverything)
        console.log(interactiveData)
    });
};

// Listener for stock selection changes.
let stockList = d3.select('#stockList');
stockList.selectAll('a').on('click', function() {
    // Resets inactive stocks and sets formatting on active stock.
    let resetList = stockList.selectAll('a').classed('active',false).classed('inactive',true);
    let selectedStock = d3.select(this);
    selectedStock.classed('active',true).classed('inactive',false);

    // Sets selected stock just to value.
    selectedStock = selectedStock.attr('value');
    console.log(`Click @ StockSelection => ${selectedStock}`)
    if (selectedStock !== activeStock) {
        activeStock = selectedStock;
        dataCharting(activeStock, activeDate);
    };
});

// Listener for date selection changes.
function reformatDate(dateIn) {
    let segments = dateIn.split('/')
    let dateOut = `${segments[2]}-${segments[0]}-${segments[1]}`;
    return dateOut;
}
let dateList = d3.select('#dateDataset');
dateList.on('change', function() {
    let selectedDate = dateList.property('value');
    selectedDate = reformatDate(selectedDate);
    if (selectedDate !== activeDate) {
        activeDate = selectedDate;
        dataCharting(activeStock, activeDate)
    }
})

// Loads Ford data on page load.
function onPageLoad() {
    dataCharting(activeStock, activeDate);
};

onPageLoad();