let allDataLink = '/api/v1/allData/'
d3.json(allDataLink).then(data => {
    console.log(data)
    console.log('In json grab under the data console log.')
});