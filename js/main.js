var margin1 = { top: 10, right: -20, bottom: 90, left: 80 }
    //Map
var width1 = 500 - margin1.left - margin1.right,
    height1 = 400 - margin1.top - margin1.bottom;
var svg = d3.select("#map-area")
    .append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform", "translate(" + -60 + ", " + margin1.top + ")");


var time = 0;
var Interval;
var formattedData;
var margin2 = { top: 20, right: 40, bottom: 80, left: 20 }
    // bar chart
var width2 = 500 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;
var chart = d3.select("#chart-area")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin2.left + ", " + margin2.top + ")");

var bar = chart.append("g")
    .attr("transform", "translate(" + margin2.left + ", " + margin2.top + ")")
var tipbar = d3.tip().attr("class", "d3-tip")
    .html(function(d) {
 
        text = "<strong>Average value:</strong> <span style='color:red'>" + d3.format(".2f")(d) + "</span><br>";
        return text;
    });
bar.call(tipbar);

// x label
bar.append("text")
    .attr("class", "x-axis label")
    .attr("x", width2 / 2)
    .attr("y", height2 + 60)
    .attr("font-size", "30px")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("text-decoration", "bold")
    .style("font-weight", 900)
    .text("Categories of Crime")

// y label
bar.append("g")
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "scale(1.3)translate(-30, 120)rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .style("font-weight", 900)
    .style("font-family", "times_new_roman")
    .text("Value");

var x = d3.scaleBand()
    .range([0, width1])
    .padding(0.2);

var y = d3.scaleLinear()
    .domain([0, 10])
    .range([height1, 0]);

var xAxisGroup = bar.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0, " + height1 + ")")
    .selectAll("text")
    .attr("transform", "translate(0,10)rotate(-0)") //Rotate x-axis labels
    .style("text-anchor", "middle");

var yAxisGroup = bar.append("g")
    .attr("class", "y axis")
    .selectAll("text")

updateBar();




function updateBar(a = "CAN", b = "Canada") {
    bar.selectAll("rect")
        .remove()
        .exit()
    bar.selectAll(".title").remove().exit()
    bar.selectAll(".x-axis").remove().exit()
    bar.selectAll(".y-axis").remove().exit()
    

    d3.csv("data/hfi_cc4.csv").then(data => {
        filteredData = data.filter(function(row) {
            return row["ISO_code"] == a //&& arr.includes(row["year"]);
        })

        filteredData.forEach(row => {
            row.pf_ss_homicide = +row.pf_ss_homicide
            row.pf_ss_disappearances_disap = +row.pf_ss_disappearances_disap
            row.pf_ss_disappearances_violent = +row.pf_ss_disappearances_violent
            row.pf_ss_disappearances_organized = +row.pf_ss_disappearances_organized
            row.pf_ss_disappearances_fatalities = +row.pf_ss_disappearances_fatalities
            row.pf_ss_disappearances_injuries = +row.pf_ss_disappearances_injuries
        });
        var name = []
        var value = []
        var columns = ["pf_ss_disappearances_disap", "pf_ss_disappearances_fatalities", "pf_ss_disappearances_injuries",
            "pf_ss_disappearances_organized", "pf_ss_disappearances_violent", "pf_ss_homicide"
        ]
        var shortForm = ["Disappereance", "Terrorism_Fatalities", "Terrorism_Injuries", "Organized_Conflicts", "Violent_Conflicts", "Homicide"]
        var finalBar = d3.nest()
            .rollup(function(v) {
                return {
                    'Disappereance': d3.mean(v, function(d) { return d[columns[0]]; }),
                    'Terrorism_Fatalities': d3.mean(v, function(d) { return d[columns[1]]; }),
                    'Terrorism_Injuries': d3.mean(v, function(d) { return d[columns[2]]; }),
                    'Organized_Conflicts': d3.mean(v, function(d) { return d[columns[3]]; }),
                    'Violent_Conflicts': d3.mean(v, function(d) { return d[columns[4]]; }),
                    'Homicide': d3.mean(v, function(d) { return d[columns[5]]; })
                };
            })
            .entries(filteredData);

        for (const [k, v] of Object.entries(finalBar)) {
            name.push(k)
            value.push(d3.format(".2f")(v))

        }

        x.domain(name);
        y.domain([0, 10]);


        var xAxisCall = d3.axisBottom(x);
        bar.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0, " + height2 + ")")
            .call(xAxisCall)
            .selectAll("text")
            .attr("transform", "translate(0,10)rotate(-15)") //Rotate x-axis labels
            .attr("y", "10")
            .attr("x", "-5")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", 600)

        var yAxisCall = d3.axisLeft(y)
            .tickFormat(function(d) {
                return d;
            });
        bar.append("g")
            .attr("class", "y-axis")
            .call(yAxisCall)
            .selectAll("text")
            .style("font-size", "12px")
            .style("text-decoration", "bold")
            .style("font-weight", 600)

        // X Axis
        var xAxisCall = d3.axisBottom(x);
        xAxisGroup.call(xAxisCall)


        // Y Axis
        var yAxisCall = d3.axisLeft(y)
            .tickFormat(function(d) { return d; });
        yAxisGroup.call(yAxisCall);

        const yAxisGrid = d3.axisLeft(y).tickSize(-width2).tickFormat('').ticks(12);

        bar.append('g')
            .attr('class', 'y axis-grid')
            .call(yAxisGrid);

        //TITLE
        bar.append("text")
            .attr("class", "title")
            .attr("x", (width2 / 2))
            .attr("y", 0 - (margin2.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("text-decoration", "bold")
            .style("font-weight", 600)
            .text("Average Crime Occurence in " + b);


        var rectangles = bar.selectAll("rect")
            .remove()
            .exit()
            .data(Object.values(finalBar))
        console.log(Object.values(finalBar))
        rectangles.enter()
            .append("rect")
            .attr("x", function(d, i) {
                return x(name[i]);
            })
            .attr("y", function(d) {
                return y(d);
            })
            .attr("width", x.bandwidth)
            .attr('height', function(d) {
                return height2 - y(d);
            })
            .attr("fill", "#4E79A7")
            .on("mouseover", tipbar.show)
            .on("mouseout", tipbar.hide);
    })
}


// Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth()
    .scale(width1 / 2 / Math.PI)
    .translate([width1 / 2, height1 / 2])
var path = d3.geoPath()
    .projection(projection);

var data = d3.map();
// Legend
var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");

var tip = d3.tip().attr("class", "d3-tip")
    .html(function(d) {
        var text = "<strong>Country:</strong> <span style='color:red'>" + d["properties"]["name"] + "</span><br>";
        text += "<strong>Code:</strong> <span style='color:red;text-transform:capitalize'>" + d.id + "</span><br>";
        text += "<strong>Average crime_cases:</strong> <span style='color:red'>" + d3.format(".2f")(d.total) + "</span><br>";
        return text;
    });
g.call(tip);

var value = []
    
var arr = ["2018","2017","2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008"]


function updateMap(value) {
    data = d3.map();
    if (value == "All") {
        d3.csv("data/hfi_cc3.csv", d => {
            // d.filter(function(row){
            if (arr.includes(d["year"])) {
                data.set(d.ISO_code, +d.pf_score)
            }

        })
    } else {
        d3.csv("data/hfi_cc4.csv", d => {
            // d.filter(function(row){
            if (d["region"] == "Eastern Europe" && arr.includes(d["year"])) {
                data.set(d.ISO_code, +d.crime_cases)
            }

        })
    }
    ready(d3.json("http://enjalot.github.io/wwsd/data/world/world-110m.geojson"));

}

var promises = [
    d3.json("http://enjalot.github.io/wwsd/data/world/world-110m.geojson"),
    d3.csv("data/hfi_cc4.csv", function(d) {
        data.set(d.ISO_code, +d.pf_score)
    })

]
$("#continent-select")
    .on("change", function(d) {
        var selectedOption = d3.select(this).property("value")
            // console.log(selectedOption)
        updateMap(selectedOption)
    });



var colorScheme = d3.schemeRdBu[5];
colorScheme.unshift("#eee")
var colorScale = d3.scaleLinear()
    .domain([4, 10])
    // .range(d3.schemeRdBu[10])
    .range(["red", "green"])
   

Promise.all(promises).then(function(mylist) {
    ready(mylist[0]);
}).catch(function(error) {
    console.log(error);
});

function ready(topo) {
    g.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .append('h2')
        .data(topo.features)
        .enter().append("path")
        .attr("fill", function(d) {
            // Pull data for this country
            d.total = data.get(d.id) || 0;
            if (d.total > 0){
                return colorScale(d.total);
            }
            else{
                return "white"
            }
            
        })
        .attr("d", path)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .on("click", function(d) {
            bar.exit().remove()
            updateBar(d["id"], d["properties"]["name"]);
        });
    g.append("text")
        .attr("x", 330)
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("font-weight", "bold")
        .style("font-weight", 900)
        .attr("font-size", "22px")
        .text("Average crime_cases by Country");


    // timeLabel.text(+(time + 1800))
    $("#year")[0].innerHTML = +(time + 1800)

    $("#date-slider").slider("value", +(time + 1800))
}