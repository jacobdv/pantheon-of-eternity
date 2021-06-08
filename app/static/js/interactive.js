// Charting values.
const svgH = 400;
const svgW = 600;
const margin = { top:20, right:40, bottom:80, left:100 };
const chartH = svgH - (margin.top + margin.bottom);
const chartW = svgW - (margin.left + margin.right);

let svg = d3.select('#chart').append('svg').attr('height', svgH).attr('width', svgW);
let chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

// Defaults to Ford as active stock.
let activeStock = 'F';
let activeDate = '2017-11-1'

// Data
function dataCharting(activeStock, activeDate) {

    let reset = d3.selectAll('g')
    reset.remove()
    
    chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    console.log('--------------------')
    console.log(`Active Stock: ${activeStock}`)
    console.log(`Active Date: ${activeDate}`)

    let selectedDayObject = {};
    let stockArray = [];

    // JSON grab for selected day only and for selected stock as a whole.
    Promise.all([d3.json(`/api/v1/${activeDate}/`),(d3.json(`/api/v1/stockData/${activeStock}`))]).then((data) => {
        // Divides data from promise into its halves.
        singleDay = data[0];
        wholeStock = data[1];
        
        // Console.log for clarity.
        console.log(`ML On Click: ${singleDay[0]}`);

        singleDayData = singleDay[1][0];
        selectedDayObject = {
            'Symbol': activeStock,
            'Open': singleDayData.Open,
            'Close': singleDayData.Close,
            'Volume': singleDayData.Volume,
            'Date': `${singleDayData.Year}-${singleDayData.Month}-${singleDayData.Day}`
        }
        console.log('Daily Stock Object:')
        console.log(selectedDayObject);

        // Data organization and reformatting for whole stock.
        wholeStock.forEach(day => {
            let dailyObject = {
                'Symbol': activeStock,
                'Open': day.Open,
                'Close': day.Close,
                'Volume': day.Volume,
                'Date': `${day.Year}-${day.Month}-${day.Day}`
            }
            stockArray.push(dailyObject);
        });
        console.log('Whole Stock Array:')
        console.log(stockArray);

        let yVar = 'Volume';
        let xVar = 'Close';

        let xLinearScale = xScale(wholeStock, xVar)
        const bottomAxis = d3
            .axisBottom(xLinearScale);
        let xAxis = chartGroup
            .append('g')
            .classed('x-axis', true)
            .attr('transform', `translate(0, ${chartH})`)
            .call(bottomAxis);
        xAxis = renderX(xLinearScale, xAxis);
        let yLinearScale = yScale(wholeStock, yVar);
        const leftAxis = d3
            .axisLeft(yLinearScale);
        let yAxis = chartGroup
            .append('g')
            .classed('y-axis', true)
            .call(leftAxis);
        yAxis = renderY(yLinearScale, yAxis);
        let circlesGroup = chartGroup
            .selectAll('circle')
            .data(wholeStock)
            .join('circle')
            .attr('cx', d => xLinearScale(d[xVar]))
            .attr('cy', d => yLinearScale(d[yVar]))
            .attr('r', 2)
            .attr('fill', 'cornflowerblue')
            .attr('opacity', 0.95)
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
        const xGroup = chartGroup
            .append('g')
            .attr("transform", `translate(${chartW / 2}, ${chartH + 20})`);
        const xLabel = xGroup.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -(chartH/2))
            .attr('y', -50)
            .attr('value', 'closingPrice')
            .text('Closing Price');
        const yGroup = chartGroup
            .append('g');
    }); // End of Promise.all with JSON grabs.
}; // End of Data Charting Function

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