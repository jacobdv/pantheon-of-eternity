const svgH = 500;
const svgW = 960;
const margin = { top:20, right:40, bottom:80, left:100 };
const chartH = svgH - (margin.top + margin.bottom);
const chartW = svgW - (margin.left + margin.right);

const svg = d3.select('chart').append('svg').attr('height', svgH).attr('width', svgW);
const chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);


/*
Functions for drawing the chart and updating it.
*/
// Sets up x axis.
function xScale(data, xVariable) {
    const xLinearScale = d3
        .scaleLinear()
        .range([0, chartW])
        .domain([d3.min(data, d => d[xVariable]) * 0.8,
            (d3.max(data, d => d[xVariable])) * 1.2]);
    return xLinearScale;
};
// Sets up y axis.
function yScale(data, yVariable) {
    const yLinearScale = d3
        .scaleLinear()
        .range([chartH, 0])
        .domain([d3.min(data, d => d[yVariable]) * 0.8,
            (d3.max(data, d => d[yVariable])) * 1.2]);
    return yLinearScale;
};
// Draws circles.
function renderCircles(circlesGroup, newXScale, newYScale, xVariable, yVariable) {
    circlesGroup
        .transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[xVariable]))
        .attr('cy', d => newYScale(d[yVariable]));
    console.log(circlesGroup)
    return circlesGroup;
};
// Draws x axis.
function renderX(newXScale, xAxis) {
    const bottomAxis = d3  
        .axisBottom(newXScale);
    xAxis
        .transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
};
// Draws y axis.
function renderY(newYScale, yAxis) {
    const leftAxis = d3
        .axisLeft(newYScale);
    yAxis
        .transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
};