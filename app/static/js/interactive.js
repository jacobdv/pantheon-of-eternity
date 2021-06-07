// Setting Up Variables
let allDataLink = '/api/v1/allData/';
let interactiveData = [];

// Looping
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

        // Pushing Data Object to Array
        interactiveData.push(dataObj);
    });
});
