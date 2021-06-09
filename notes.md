Interactive Page Chart
    <!-- Relative Value over Date in 2017 -->
    <!-- Some Vertical Highlight on the Selected Date -->

Indicator for Strength of Time to Buy

Horizontal Line on Graph Indicating 'Good','Bad','Uncertain' 40-20-40?

Text Describing


PORTION FOR STOCK SELECTION IF IT GETS ADDED BACK IN
// Listener for stock selection changes.
// let stockList = d3.select('#stockList');
// stockList.selectAll('a').on('click', function() {
//     // Resets inactive stocks and sets formatting on active stock.
//     let resetList = stockList.selectAll('a').classed('active',false).classed('inactive',true);
//     let selectedStock = d3.select(this);
//     selectedStock.classed('active',true).classed('inactive',false);

//     // Sets selected stock just to value.
//     selectedStock = selectedStock.attr('value');
//     console.log(`Click @ StockSelection => ${selectedStock}`)
//     if (selectedStock !== activeStock) {
//         activeStock = selectedStock;
//         dataCharting(activeStock, activeDate);
//     };
// });
/* Stock Selection List */
#stockSelection {
    margin: 20px 0px 20px 0px;
}
#stockSelectionHeader {
    padding: 0px;
    margin: 0px;
    text-decoration: underline;
}
#stockList {
    list-style-type: none;
    padding: 0px;
    margin: 0px;
}
.stockLink {
    padding: 0px;
    margin: 0px;
}