/**
 * Created by Griffin on 6/15/2017.
 */
var ratData = [400,900,300];

var svg = d3.select('body')
    .append('svg')
    .attr('width',500)
    .attr('height',150);

function drawChart(dataArray){
    var selection = svg.selectAll('rect')
        .data(dataArray);

    selection.enter()
        .append('rect')
        .attr('x', function(d,i){
            return i * 25;
        })
        .attr('width', 15)
        .attr('fill', '#d1c9b8')
        .merge(selection)
        .attr('height', function(d){
            return d/10 * 1.5;
        })
        .attr('y', function(d){
            return 150 - d/10 * 1.5;
        });

    selection.exit()
        .remove();
}

drawChart(ratData);