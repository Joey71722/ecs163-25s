const margin = { top: 50, right: 30, bottom: 50, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

d3.csv("data/pokemon.csv").then(data => {
  // Parse numeric values
  data.forEach(d => {
    d.Attack = +d.Attack;
    d.Defense = +d.Defense;
    d.HP = +d.HP;
    d.Speed = +d.Speed;
    d.Generation = +d.Generation;
  });

  drawBarChart(data);
  drawScatterPlot(data);
  drawParallelCoordinates(data);
});

function drawBarChart(data) {
  const svg = d3.select("#chart-overview")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const color = d3.scaleOrdinal()
    .domain(generations)
    .range(d3.schemeSet2); // or try d3.schemeTableau10, d3.schemeCategory10

  svg.selectAll("rect")
    .data(dataByGeneration)
    .enter()
    .append("rect")
    .attr("fill", d => color(d.generation));


  const generations = d3.rollup(data, v => v.length, d => d.Generation);
  const x = d3.scaleBand()
    .domain([...generations.keys()])
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(generations.values())])
    .nice()
    .range([height - margin.top, 0]);

  svg.selectAll("rect")
    .data([...generations])
    .enter()
    .append("rect")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d[1]))
    .attr("width", x.bandwidth())
    .attr("height", d => height - margin.top - y(d[1]))
    .attr("fill", "#69b3a2");

  svg.append("g").attr("transform", `translate(0,${height - margin.top})`).call(d3.axisBottom(x));
  svg.append("g").call(d3.axisLeft(y));

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Pokémon Count by Generation");
}

function drawScatterPlot(data) {
  const svg = d3.select("#chart-scatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain([0, d3.max(data, d => d.Attack)]).nice().range([0, width]);
  const y = d3.scaleLinear().domain([0, d3.max(data, d => d.Defense)]).nice().range([height - margin.top, 0]);

  svg.append("g").attr("transform", `translate(0,${height - margin.top})`).call(d3.axisBottom(x));
  svg.append("g").call(d3.axisLeft(y));

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.Attack))
    .attr("cy", d => y(d.Defense))
    .attr("r", 4)
    .style("fill", "#ff6666")
    .style("opacity", 0.7);

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Attack vs Defense");
}

function drawParallelCoordinates(data) {
  const dimensions = ["HP", "Attack", "Defense", "Speed"];

  const y = {};
  for (let dim of dimensions) {
    y[dim] = d3.scaleLinear()
      .domain([d3.min(data, d => d[dim]), d3.max(data, d => d[dim])])
      .range([height - margin.top, 0]);
  }

  const x = d3.scalePoint()
    .domain(dimensions)
    .range([0, width]);

  const line = d3.line()
    .defined(([, value]) => value != null)
    .x(([dim]) => x(dim))
    .y(([dim, value]) => y[dim](value));

  const svg = d3.select("#chart-parallel")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + 20)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  svg.selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("d", d => line(dimensions.map(dim => [dim, d[dim]])))
    .style("fill", "none")
    .style("stroke", "#4682b4")
    .style("opacity", 0.4);

  const types = [...new Set(data.map(d => d.Type1))];
  const color = d3.scaleOrdinal()
    .domain(types)
    .range(d3.schemeCategory10);

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("fill", d => color(d.Type1));   


  dimensions.forEach(dim => {
    svg.append("g")
      .attr("transform", `translate(${x(dim)},0)`)
      .call(d3.axisLeft(y[dim]));

    svg.append("text")
      .attr("x", x(dim))
      .attr("y", -10)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text(dim);
  });

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Parallel Coordinates of Stats");
}