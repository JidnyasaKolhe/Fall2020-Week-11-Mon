function barplot(values, bins, ax,
    title = "",
    xL = "",
    yL = "",
    margin = 100) {

        function brushedEnd() {

            let selected_items = d3.brushSelection(this); 
            let bin_level_0 = bins.indexOf(scaleBandInvert(scale_X)(selected_items[0]));
            let bin_level_1 = bins.indexOf(scaleBandInvert(scale_X)(selected_items[1]));
            let filtered = []
            
            for(let i = 0 ; i < bins.length; i++) {
            if(bin_level_0 <= i && i <= bin_level_1){
              filtered.push(bins[i]);
            }
            }
            scale_X.domain(filtered)
            
            
            }
            
            function scaleBandInvert(scale) {
                let domain = scale.domain();
                let paddingOuter = scale(domain[0]);
                let eachBand = scale.step();
                return function (value) {
                let index = Math.round(((value - paddingOuter) / eachBand));
                return domain[Math.floor(Math.min(index, domain.length-1))];
                }
                }
axis = d3.select(`${ax}`);

scale_X = d3.scaleBand().domain(bins).range([margin, 1000 - margin]);
scale_X.padding(0.4);
console.log(scale_X)
scale_Y = d3.scaleLinear().domain([0, d3.max(values)]).range([1000 - margin, margin]);


x_axis = d3.axisBottom(scale_X);// x and y Axis function
y_axis = d3.axisLeft(scale_Y).ticks(6);// x and y Axis function

xAxis = axis.append("g").attr("class", "axis")//X Axis
.attr("transform", `translate(${0},${1000 - margin})`)
.call(x_axis)

axis.append("g").attr("class", "axis")// Y Axis
.attr("transform", `translate(${margin},${0})`)
.call(y_axis)



axis.append("g").attr("class", "label")// Labels
.attr("transform", `translate(${500},${1000 - 10})`)
.append("text")
.attr("class", "label")
.text(xL)

axis.append("g")
.attr("transform", `translate(${35},${500}) rotate(270)`)
.append("text")
.attr("class", "label")
.text(yL)

axis.append('text')// Title
.attr('x', 500)
.attr('y', 80)
.attr("text-anchor", "middle")
.text(title)
.attr("class", "title")


axis.append("defs").append("svg:clipPath")
.attr("id", "clip")
.append("svg:rect")
.attr("width", 1000 - margin )
.attr("height", 1000 - margin )
.attr("x", margin)
.attr("y", margin);

axis.append('g')
.attr("clip-path", "url(#clip)")
.selectAll(".bar")
.data(values)
.enter().append("rect")
.attr("class", "bar")
.attr("x", function (d, i) {
return scale_X(bins[i]);
})
.attr("y", function (d) {
return scale_Y(d);
})
.attr("width", scale_X.bandwidth())
.attr("height", function (d) {
return 1000 - margin - scale_Y(d);
});


let brush = d3
.brushX()
.on("end", brushedEnd)
.extent([
[margin, margin],
[1000 - margin, 1000 - margin]
]);


axis
.append("g")
.attr("class", "brush")
.call(brush);



}