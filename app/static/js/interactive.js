// Charting values.
const svgH = 400;
const svgW = 600;
const margin = { top:20, right:40, bottom:80, left:100 };
const chartH = svgH - (margin.top + margin.bottom);
const chartW = svgW - (margin.left + margin.right);

let svg = d3.select('#chart').append('svg').attr('height', svgH).attr('width', svgW);
let chartTitle = svg.append('h1').attr('id','chartTitle').attr('value','chart').text('Average Relative Score in 2017');
let chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
let xLabel;
let yLabel;

// Defaults to Ford as active stock.
let activeDate = '2017-11-1';

// Data
function dataCharting(activeDate) {

    let reset = d3.selectAll('g').remove();
    
    chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    console.log('--------------------');
    console.log(`Active Date: ${activeDate}`);

    // JSON grab for selected day only and for selected stock as a whole.
    Promise.all([d3.json(`/api/v1/${activeDate}/`),(d3.json(`/api/v1/stockData/`))]).then((data) => {
        // Parsing JSON grab.
        let selectedDayRelative = data[0][0];
        let selectedDayStockData = data[0][1];
        let allStockData = data[1];

        // Values for Charting
        let yVar = 'Relative';
        let xVar = 'Date';

        let xTimeScale = xScale(allStockData, xVar);
        const bottomAxis = d3
            .axisBottom(xTimeScale);
        let xAxis = chartGroup
            .append('g')
            .classed('x-axis', true)
            .attr('transform', `translate(0, ${chartH})`)
            .call(bottomAxis);
        xAxis = renderX(xTimeScale, xAxis);
        let yLinearScale = yScale(allStockData, yVar);
        const leftAxis = d3
            .axisLeft(yLinearScale);
        let yAxis = chartGroup
            .append('g')
            .classed('y-axis', true)
            .call(leftAxis);
        yAxis = renderY(yLinearScale, yAxis);
        let circlesGroup = chartGroup
            .selectAll('circle')
            .data(allStockData)
            .join('circle')
            .attr('cx', d => xTimeScale(d3.timeParse('%Y-%m-%d')(`${parseInt(d.Year)}-${parseInt(d.Month)}-${parseInt(d.Day)}`)))
            .attr('cy', d => yLinearScale(d[yVar]))
            .attr('r', 2)
            .attr('fill', 'cornflowerblue')
            .attr('opacity', 0.95)
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
    }); // End of Promise.all with JSON grabs.
}; // End of Data Charting Function



// Listener for date selection changes.
function reformatDate(dateIn) {
    let segments = dateIn.split('/');
    let dateOut = `${segments[2]}-${segments[0]}-${segments[1]}`;
    return dateOut;
};
let dateList = d3.select('#dateDataset');
dateList.on('change', function() {
    let selectedDate = dateList.property('value');
    selectedDate = reformatDate(selectedDate);
    if (selectedDate !== activeDate) {
        activeDate = selectedDate;
        dataCharting(activeDate);
    };
});

// Loads Ford data on page load.
function onPageLoad() {
    dataCharting(activeDate);
};

onPageLoad();