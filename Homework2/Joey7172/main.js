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

function drawChordDiagram(data) {
  // Prepare dimensions
  const svg = d3.select("#chart-parallel")
    .html("") // clear any previous chart
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", width + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${(width + margin.left) / 2}, ${(width + margin.top) / 2})`);

  // Get unique types
  const types = Array.from(new Set(data.flatMap(d => [d.Type1, d.Type2]))).filter(Boolean);
  const index = new Map(types.map((t, i) => [t, i]));
  const matrix = Array.from({ length: types.length }, () => Array(types.length).fill(0));

  // Build matrix: matrix[i][j] = count of Type1 i and Type2 j
  data.forEach(d => {
    if (d.Type1 && d.Type2) {
      const i = index.get(d.Type1);
      const j = index.get(d.Type2);
      matrix[i][j]++;
    }
  });

  const res = d3.chord().padAngle(0.05).sortSubgroups(d3.descending)(matrix);
  const arc = d3.arc().innerRadius(width / 2 - 100).outerRadius(width / 2 - 70);
  const ribbon = d3.ribbon().radius(width / 2 - 100);

  const color = d3.scaleOrdinal(d3.schemeCategory10).domain(types);

  // Draw outer arcs
  svg.append("g")
    .selectAll("path")
    .data(res.groups)
    .join("path")
    .attr("fill", d => color(types[d.index]))
    .attr("d", arc)
    .append("title")
    .text(d => `${types[d.index]}: ${d3.sum(matrix[d.index])} connections`);

  // Draw ribbons
  svg.append("g")
    .selectAll("path")
    .data(res)
    .join("path")
    .attr("d", ribbon)
    .attr("fill", d => color(types[d.source.index]))
    .attr("stroke", "#ccc")
    .append("title")
    .text(d => `${types[d.source.index]} → ${types[d.target.index]}: ${d.source.value}`);

  // Add labels
  svg.append("g")
    .selectAll("text")
    .data(res.groups)
    .join("text")
    .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr("dy", ".35em")
    .attr("transform", d => `
      rotate(${(d.angle * 180 / Math.PI - 90)})
      translate(${width / 2 - 60})
      ${d.angle > Math.PI ? "rotate(180)" : ""}
    `)
    .style("text-anchor", d => d.angle > Math.PI ? "end" : null)
    .text(d => types[d.index]);

    // Color by Type
    svg.append("g")
    .selectAll("path")
    .data(res.groups)
    .join("path")
    .attr("fill", d => color(types[d.index])) // 🟡 Color by Type
    .attr("d", arc)
    .append("title")
    .text(d => `${types[d.index]}: ${d3.sum(matrix[d.index])} connections`);
}
