// main.js

// Load the Pokemon dataset
d3.csv("data/pokemon_alopez247.csv").then(function(data) {
    console.log(data);  // Check if the data is loaded correctly

    // ----- Bar Chart: Distribution of Pokémon by Type_1 -----
    const marginBar = { top: 60, right: 40, bottom: 80, left: 60 };
    const widthBar = 800 - marginBar.left - marginBar.right;
    const heightBar = 400 - marginBar.top - marginBar.bottom;

    const type1Count = d3.rollup(data, v => v.length, d => d.Type_1);

    const svgBar = d3.select("#bar-chart").append("svg")
        .attr("width", widthBar + marginBar.left + marginBar.right)
        .attr("height", heightBar + marginBar.top + marginBar.bottom)
      .append("g")
        .attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");

    const xBar = d3.scaleBand()
        .domain(Array.from(type1Count.keys()))
        .range([0, widthBar])
        .padding(0.1);

    const yBar = d3.scaleLinear()
        .domain([0, d3.max(Array.from(type1Count.values()))])
        .nice()
        .range([heightBar, 0]);

    // Create bars
    svgBar.selectAll(".bar")
        .data(Array.from(type1Count.entries()))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xBar(d[0]))
        .attr("y", d => yBar(d[1]))
        .attr("width", xBar.bandwidth())
        .attr("height", d => heightBar - yBar(d[1]))
        .attr("fill", d => {
            if (d[0] === "Grass") return "lightgreen";
            else if (d[0] === "Fire") return "red";
            else if (d[0] === "Water") return "blue";
            else if (d[0] === "Bug") return "darkgreen";
            else if (d[0] === "Normal") return "cyan";
            else if (d[0] === "Psychic") return "purple";
            else if (d[0] === "Rock") return "brown";
            else if (d[0] === "Dark") return "darkgray";
            else if (d[0] === "Steel") return "gray";
            else if (d[0] === "Fairy") return "pink";
            else if (d[0] === "Dragon") return "orange";
            else if (d[0] === "Ghost") return "violet";
            else if (d[0] === "Ice") return "iceblue";
            else if (d[0] === "Poison") return "darkviolet";
            else if (d[0] === "Electric") return "yellow";
            else if (d[0] === "Ground") return "tan";
            else if (d[0] === "Flying") return "lightblue";
            else if (d[0] === "Fighting") return "darkred";
            else return "gray"; // Default color for other types
        });

    // Create Y-axis
    svgBar.append("g")
        .call(d3.axisLeft(yBar));

    // Create X-axis
    svgBar.append("g")
        .attr("transform", "translate(0," + heightBar + ")")
        .call(d3.axisBottom(xBar));

    // Add X-axis title (only once)
    svgBar.append("text")
        .attr("x", widthBar / 2)
        .attr("y", heightBar + 40)
        .style("text-anchor", "middle")
        .text("Type");

    // Add Y-axis title (only once)
    svgBar.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20 - marginBar.left)
        .attr("x", 0 - heightBar / 2)
        .style("text-anchor", "middle")
        .text("Number of Pokémon");

    // Title for Bar Chart
    d3.select("#bar-chart-title")
        .style("text-anchor", "middle")
        .text("Distribution of Pokémon Types");

    // ----- Scatter Plot: Attack vs Defense -----
    const marginScatter = { top: 60, right: 200, bottom: 80, left: 60 };
    const widthScatter = 800 - marginScatter.left - marginScatter.right;
    const heightScatter = 600 - marginScatter.top - marginScatter.bottom;

    const svgScatter = d3.select("#scatter-plot").append("svg")
        .attr("width", widthScatter + marginScatter.left + marginScatter.right)
        .attr("height", heightScatter + marginScatter.top + marginScatter.bottom)
      .append("g")
        .attr("transform", "translate(" + marginScatter.left + "," + marginScatter.top + ")");

    const xScatter = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.Attack)])
        .range([0, widthScatter]);

    const yScatter = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.Defense)])
        .range([heightScatter, 0]);

    // Create scatter plot dots
    const color = d3.scaleOrdinal()
        .domain(Array.from(new Set(data.map(d => d.Type_1))));

    svgScatter.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScatter(+d.Attack))
        .attr("cy", d => yScatter(+d.Defense))
        .attr("r", 3)
        .attr("fill", d => {
            if (d.Type_1 === "Grass") return "lightgreen";
            else if (d.Type_1 === "Fire") return "red";
            else if (d.Type_1 === "Water") return "blue";
            else if (d.Type_1 === "Bug") return "darkgreen";
            else if (d.Type_1 === "Normal") return "cyan";
            else if (d.Type_1 === "Psychic") return "purple";
            else if (d.Type_1 === "Rock") return "brown";
            else return "gray";
        }); // most common types are coloured, rest are purple

    // Add legend
    //legend title
    d3.select("#scatter-plot-legend-title")
        .style("text-anchor", "middle")
        .text("Legend: Pokémon Types");
    //legend
    const otherTypes = ["Dark", "Steel", "Fairy", "Dragon", "Ghost", "Ice", "Poison", "Electric", "Ground", "Flying", "Fighting"];
    const legendData = Array.from(new Set(data.map(d => otherTypes.includes(d.Type_1) ? "Other" : d.Type_1)));

    const legendScatter = svgScatter.selectAll(".legend")
        .data(legendData)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(0," + (i * 20) + ")");

    legendScatter.append("rect")
        .attr("x", widthScatter + 80)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => {
            if (d === "Grass") return "lightgreen";
            else if (d === "Fire") return "red";
            else if (d === "Water") return "blue";
            else if (d === "Bug") return "darkgreen";
            else if (d === "Normal") return "cyan";
            else if (d === "Psychic") return "purple";
            else if (d === "Rock") return "brown";
            else if (d === "Other") return "darkgray";
            else return "gray";
        });

    legendScatter.append("text")
        .attr("x", widthScatter + 110)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(d => d);

    // Create Y-axis
    svgScatter.append("g")
        .call(d3.axisLeft(yScatter));

    // Create X-axis
    svgScatter.append("g")
        .attr("transform", "translate(0," + heightScatter + ")")
        .call(d3.axisBottom(xScatter));

    // Add X-axis title (only once)
    svgScatter.append("text")
        .attr("x", widthScatter / 2)
        .attr("y", heightScatter + 40)
        .style("text-anchor", "middle")
        .text("Attack");

    // Add Y-axis title (only once)
    svgScatter.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20 - marginScatter.left)
        .attr("x", 0 - heightScatter / 2)
        .style("text-anchor", "middle")
        .text("Defense");

    // Title for Scatter Plot
    d3.select("#scatter-plot-title")
        .style("text-anchor", "middle")
        .text("Attack vs Defense of Pokémon");

    // ----- Parallel Coordinates: Pokémon Stats -----
const marginParallel = { top: 60, right: 200, bottom: 20, left: 50 };
const widthParallel = 1200 - marginParallel.left - marginParallel.right;
const heightParallel = 500 - marginParallel.top - marginParallel.bottom;

const svgParallelCoordinates = d3.select("#parallel-coordinates").append("svg")
    .attr("width", widthParallel + marginParallel.left + marginParallel.right)
    .attr("height", heightParallel + marginParallel.top + marginParallel.bottom)
    .append("g")
    .attr("transform", `translate(${marginParallel.left},${marginParallel.top})`);

const dimensions = ["HP", "Attack", "Defense", "Speed"];

// Y-axis scales
const yScales = {};
dimensions.forEach(dim => {
    yScales[dim] = d3.scaleLinear()
        .domain(d3.extent(data, d => +d[dim]))
        .range([heightParallel, 0]);
});

//x-axis scales
const xParallel = d3.scalePoint()
    .domain(dimensions)
    .range([0, widthParallel]);

// Draw the lines
function path(d) {
    return d3.line()(dimensions.map(p => [xParallel(p), yScales[p](+d[p])]));
}

// Draw the axes
svgParallelCoordinates.selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", d => {
        if (d.Type_1 === "Grass") return "lightgreen";
        else if (d.Type_1 === "Fire") return "red";
        else if (d.Type_1 === "Water") return "blue";
        else if (d.Type_1 === "Bug") return "darkgreen";
        else if (d.Type_1 === "Normal") return "cyan";
        else if (d.Type_1 === "Psychic") return "purple";
        else if (d.Type_1 === "Rock") return "brown";
        else return "gray";
    })
    .attr("stroke-opacity", 0.3)
    .attr("stroke-width", 1);

    // Draw the axes
dimensions.forEach(dim => {
    svgParallelCoordinates.append("g")
        .attr("transform", `translate(${xParallel(dim)},0)`)
        .call(d3.axisLeft(yScales[dim]))
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -10)
        .text(dim)
        .style("fill", "black")
        .style("font-weight", "bold");
});

// Legend
d3.select("#parallel-coordinates-title")
    .style("text-anchor", "middle")
    .text("Pokémon Stats");

const legendParallelCoordinates = svgParallelCoordinates.selectAll(".legend")
    .data(legendData)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

legendParallelCoordinates.append("rect")
    .attr("x", widthParallel + 80)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", d => {
        if (d === "Grass") return "lightgreen";
        else if (d === "Fire") return "red";
        else if (d === "Water") return "blue";
        else if (d === "Bug") return "darkgreen";
        else if (d === "Normal") return "cyan";
        else if (d === "Psychic") return "purple";
        else if (d === "Rock") return "brown";
        else return "gray";
    });

legendParallelCoordinates.append("text")
    .attr("x", widthParallel + 110)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(d => d);

});
