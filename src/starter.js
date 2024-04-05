import * as d3 from "d3";
import "./viz.css";

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg
const svg = d3.select("#svg-container").append("svg").attr("id", "svg");

let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));
const margin = { top: 6, right: 30, bottom: 60, left: 50 };

// parsing & formatting
const parseTime = d3.timeParse("%Y-%m-%dT00:00:00Z");
const formatXAxis = d3.timeFormat("%b %Y");
const formatDate = d3.timeFormat("%b %d, %Y");
const formatPrice = d3.format(",.2f"); // thousand + 2 decimal point

// scale
const xScale = d3.scaleUtc().range([margin.left, width - margin.right]);
const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

//axis
const xAxis = d3
  .axisBottom(xScale)
  .ticks(5)
  .tickSize(-width + margin.right + margin.left)
  .tickFormat((d) => formatXAxis(d));

const yAxis = d3.axisBottom(yScale).ticks(5);

// line
const line = d3
  .line()
  .curve(d3.curveCardinal)
  .x((d) => xScale(d.date_parsed))
  .y((d) => yScale(d.price));

// svg elements
let path, circle, x, y;

//////////////////////////////////////////////////////////////////
//////////////////////////  Load CSV  ////////////////////////////

let data = [];
let parh, circle;

d3.json("./data/bitcoin-data.json").then((raw_data) => {
  //   console.log(raw_data);

  data = raw_data.map((d) => {
    // console.log(d);
    d.date_parsed = parseTime(d.timestamp);
    return d;
  });

  console.log(data.length - 1);
  console.log(data.length);

  // add path
  path = svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#8868cb")
    .attr("stroke-width", 2.2)
    .attr("d", line);

  circle = svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#8868cb")
    .attr("stroke-width", 2.2)
    .attr("d", line);

  // last value
  const lastvalue = data[data.length - 1];
  console.log(lastvalue);

  // console log(lastvalue):;

  d3.select("#price").text(formatPrice(lastvalue.price));
  d3.select("#date#").text(formatDate(lastvalue.date_parsed));

  svg
    .append("circle")
    .attr("cx", xScale(lastvalue.date_parsed))
    .attr("cy", yScale(lastvalue.price))
    .attr("r", 7)
    .attr("fill", "8868cb");

  //   scale
  xScale.domain(d3.extent(data, (d) => d.date_parsed));
  yScale.domain(d3.extent(data, (d) => d.price));

  // axis
  svg
    .append("g")
    .attr("class", "x-axis")
    // .attr("transform",'translate(0,100)').call(xAxis);
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);
});

// resize
window.addEventListener("resize", () => {
  // code goes here
  width = parseInt(d3.select("#svg-container").style("width"));
  height = parseInt(d3.select("#svg-container").style("height"));
  xScale.range([margin.left, width - margin.right]);
  yScale.range([height - margin.bottom, margin.top]);

  line.x((d) => xScale(d.date_parsed)).y((d) => yScale(d.price));

  path.attr("d", line);
});
