plotter = (function(){
  var plotWidth = 1500,
      plotHeight = 1500,
      paddingX = 20,
      paddingY = 20,
      newData = [],
      previousData = [],
      xScale,
      yScale,
      canvas = d3.select("#canvas")
                      .append("svg:svg")
                      .attr({
                          width: plotWidth+(paddingX*2),
                          height: plotHeight+(paddingY*2)
                      });
      return {
        init: function(keyboard){
          xScale = d3.scale.linear().domain([0, 1]).range([0, 65]);
          yScale = d3.scale.linear().domain([0, 1]).range([0, 65]);

          var rows = canvas.selectAll("g.row-key")
            .data(keyboard)
            .enter().append("svg:g")

          rows.selectAll("rect.key")
            .data(function(d){return d})
            .enter()
            .append("rect")
            .attr("x", function(d){return xScale(d.x)})
            .attr("y", function(d){return yScale(d.y)})
            .attr("width", function(d){return xScale(d.width)})
            .attr("height", function(d){return yScale(d.height)})
            .attr("rx", function(d){return xScale(0.1)})
            .attr("ry", function(d){return xScale(0.1)})


          rows.selectAll("text.key-name")
            .data(function(d){return d})
            .enter()
            .append("svg:text")
            .text(function(d){return d.name.toUpperCase()})
            .attr({fill: 'white', "text-anchor": "middle", "font-size": function(d){return xScale(0.2)}})
            .attr("x", function(d){return xScale(d.x + d.width/2)})
            .attr("y", function(d){return yScale(d.y + d.height/2)})
        }
      }
})();

plotter.init(keyboard.build("apple"));