// Adding universal nav functionality for all pages.
let body = d3.select('body');
let nav = body.append('div').attr('id','navDiv');

// Title
let title = nav.append('h1').text('Pantheon of Eternity')
    .attr('id','navTitle');

// Adding each page with linking.
let pageList = nav.append('ul').attr('id','navList');
let pages = ['Home','Interactive'];
pages.forEach(page => {
    let pageLink = pageList.append('a').classed('pageLink', true)
        .classed('active',false).classed('inactive',true).text(page);
    if (page === 'Home') {
        pageLink.attr('href','/');
    } else if (page === 'Interactive') {
        pageLink.attr('href','/interactive/');
    };
});
