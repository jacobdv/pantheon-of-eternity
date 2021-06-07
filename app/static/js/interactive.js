let allDataLink = '/api/v1/allData/'
d3.json(allDataLink).then(data => {
    console.log(data[0])
})