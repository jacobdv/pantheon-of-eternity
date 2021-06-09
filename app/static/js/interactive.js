// Charting values.
const svgH = 600;
const svgW = 900;
const margin = { top:20, right:40, bottom:80, left:100 };
const chartH = svgH - (margin.top + margin.bottom);
const chartW = svgW - (margin.left + margin.right);

let svg = d3.select('#chart').append('svg').attr('height', svgH).attr('width', svgW);
let chartTitle = svg.append('h1').attr('id','chartTitle').attr('value','chart').text('Average Relative Score in 2017');
let chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
let predictionGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
let xLabel = svg.append('text').classed('xLabel',true).attr('text-anchor','end').attr('x',chartW).attr('y',chartH-10).text('Month');
let yLabel = svg.append('text').classed('yLabel',true).attr('text-anchor','end').attr('y',10).attr('dy','.75em').attr('transform','rotate(-90)').text('Relative Value');

// Defaults to Ford as active stock.
let activeDate = '2017-11-1';

// Data
function dataCharting(activeDate) {
    console.log('--------------------');
    console.log(`Active Date: ${activeDate}`);

    // JSON grab for selected day only and for selected stock as a whole.
    Promise.all([d3.json(`/api/v1/${activeDate}/`),(d3.json(`/api/v1/stockData/`))]).then((data) => {
        // Parsing JSON grab.
        let selectedDayRelative = data[0][0];
        let selectedDayStockData = data[0][1];
        let allStockData = data[1];

        // Removes November Data
        let l = allStockData.length;
        allStockData = allStockData.slice(0, (l-48)) //48 for Nov, 180 to remove October

        // Values for Charting
        let yVar = 'Relative';
        let xVar = 'Date';

        let xTimeScale = xScale();
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
            .attr('r', 3)
            .attr('fill', 'cornflowerblue')
            .attr('opacity', 0.95);

        predictionGroup.selectAll('circle').remove();
        predictionGroup.selectAll('rect').remove();
        let day = predictionGroup
            .append('circle')
            .attr('cx', xTimeScale(d3.timeParse('%Y-%m-%d')(activeDate)))
            .attr('cy', yLinearScale(selectedDayRelative))
            .attr('r',4)
            .attr('fill', 'red')
            .attr('opacity', 0.95)
            .attr('stroke', 'black')
            .attr('stroke-width', 1);

        // let top40 = predictionGroup
        //     .append('rect')
        //     .attr('x', 0).attr('y', 0)
        //     .attr('width', chartW)
        //     .attr('height', yLinearScale(145))
        //     .attr('fill', 'mediumseagreen')
        //     .attr('opacity', 0.2);
        // let mid20 = predictionGroup
        //     .append('rect')
        //     .attr('x', 0).attr('y', yLinearScale(145))
        //     .attr('width', chartW)
        //     .attr('height', yLinearScale(172))
        //     .attr('fill', 'gold')
        //     .attr('opacity', 0.2);
        // let bottom40 = predictionGroup
        //     .append('rect')
        //     .attr('x', 0).attr('y', yLinearScale(135))
        //     .attr('width', chartW)
        //     .attr('height', yLinearScale(156))
        //     .attr('fill', 'firebrick')
        //     .attr('opacity', 0.2);

        let indicator = d3.select('#indicator');
        indicator.attr('style',`background-color: ${getIndicatorColor(selectedDayRelative)}`);

        let belowChart = d3.select('#belowChart');
        belowChart.html('')
        belowChart.append('h1').attr('id','belowChartHeader').text(`${activeDate} Stock Prices`);
        let stockPrices = belowChart.append('ul');
        selectedDayStockData.forEach(stock => {
            let stockSymbol = 'F'
            if (parseInt(stock.Symbol_F) === 1) {
                stockSymbol = 'F';
            } else if (parseInt(stock.Symbol_GM) === 1) {
                stockSymbol = 'GM';
            } else if (parseInt(stock.Symbol_HMC) === 1) {
                stockSymbol = 'HMC';
            } else if (parseInt(stock.Symbol_RACE) === 1) {
                stockSymbol = 'RACE';
            } else if (parseInt(stock.Symbol_TM) === 1) {
                stockSymbol = 'TM';
            } else if (parseInt(stock.Symbol_TTM) === 1) {
                stockSymbol = 'TTM';
            }; 
            stockPrices.append('li')
                .classed('stockListBelowChart', true)
                .attr('value', stockSymbol)
                .text(`${stockSymbol} Closing Price: $${stock.Close}, Volume: ${stock.Volume}`);   
        });

    }); // End of Promise.all with JSON grabs.
}; // End of Data Charting Function

function getIndicatorColor(value) {
    if (value > 144) {
        return 'mediumseagreen';
    } else if (value > 134) {
        return 'gold';
    } else {
        return 'firebrick';
    }
}

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

dataCharting(activeDate);