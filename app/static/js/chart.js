const minDate = ('2017-01-01');
const maxDate = ('2017-11-10');

/*
Functions for drawing the chart and updating it.
*/
// Sets up x axis.
function xScale() {
    const xTimeScale = d3
        .scaleTime()
        .range([0, chartW])
        .domain([d3.timeParse('%Y-%m-%d')(minDate), d3.timeParse('%Y-%m-%d')(maxDate)]);
    return xTimeScale;
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
        .attr('cx', d => d3.timeParse('%Y-%m-%d')(`${parseInt(d.Year)}-${parseInt(d.Month)}-${parseInt(d.Day)}`))
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