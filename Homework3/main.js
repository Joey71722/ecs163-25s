// Load the Pokemon dataset

// Load the Pokemon dataset
d3.csv("data/pokemon_alopez247.csv").then(function(data) {
    console.log(data);  // Check if the data is loaded correctly

    // Shared color scale
    const colorMap = {
        "Grass": "lightgreen",
        "Fire": "red",
        "Water": "blue",
        "Bug": "darkgreen",
        "Normal": "magenta",
        "Psychic": "purple",
        "Rock": "brown",
        "Dark": "darkgray",
        "Steel": "gray",
        "Fairy": "pink",
        "Dragon": "orange",
        "Ghost": "violet",
        "Ice": "cyan",
        "Poison": "darkviolet",
        "Electric": "yellow",
        "Ground": "tan",
        "Flying": "turquoise",
        "Fighting": "darkred"
    };

    const getColor = (type) => colorMap[type] || "gray";

    // Store selected type globally
    let selectedType = null;

    // ----- Bar Chart -----
    const marginBar = { top: 40, right: 20, bottom: 60, left: 50 };
    const widthBar = 500 - marginBar.left - marginBar.right;
    const heightBar = 300 - marginBar.top - marginBar.bottom;

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

    const bars = svgBar.selectAll(".bar")
        .data(Array.from(type1Count.entries()))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xBar(d[0]))
        .attr("y", d => yBar(d[1]))
        .attr("width", xBar.bandwidth())
        .attr("height", d => heightBar - yBar(d[1]))
        .attr("fill", d => getColor(d[0]))
        .style("cursor", "pointer")
        .on("mouseover", (event, d) => highlightType(d[0]))
        .on("mouseout", () => { if (!selectedType) resetHighlight(); })
        .on("click", (event, d) => {
            if (selectedType === d[0]) {
                selectedType = null;
                resetHighlight();
                updateBarHighlight();
            } else {
                selectedType = d[0];
                highlightType(d[0]);
                updateBarHighlight();
            }
        });

    svgBar.append("g").call(d3.axisLeft(yBar));

    svgBar.append("g")
        .attr("transform", "translate(0," + heightBar + ")")
        .call(d3.axisBottom(xBar))
        .selectAll("text")
        .style("font-size", "6px");

    svgBar.append("text")
        .attr("x", widthBar / 2)
        .attr("y", heightBar + 40)
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("Type");

    svgBar.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 0 - heightBar / 2)
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("Number of Pokémon");

    d3.select("#bar-chart-title")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Distribution of Pokémon Types");

    // ----- Scatter Plot -----
    const marginScatter = { top: 40, right: 150, bottom: 60, left: 50 };
    const widthScatter = 500 - marginScatter.left - marginScatter.right;
    const heightScatter = 300 - marginScatter.top - marginScatter.bottom;

    const svgScatter = d3.select("#scatter-plot").append("svg")
        .attr("width", widthScatter + marginScatter.left + marginScatter.right)
        .attr("height", heightScatter + marginScatter.top + marginScatter.bottom)
        .append("g")
        .attr("transform", "translate(" + marginScatter.left + "," + marginScatter.top + ")");

    const xScatter = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.Defense)])
        .range([0, widthScatter]);

    const yScatter = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.Attack)])
        .range([heightScatter, 0]);

    const scatterDots = svgScatter.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScatter(+d.Defense))
        .attr("cy", d => yScatter(+d.Attack))
        .attr("r", 2)
        .attr("fill", d => getColor(d.Type_1));

    d3.select("#scatter-plot-legend-title")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("Legend: Pokémon Types");

    const legendData = Array.from(new Set(data.map(d => colorMap[d.Type_1] ? d.Type_1 : "Other")));

    const legendScatter = svgScatter.selectAll(".legend")
        .data(legendData)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(0," + (i * 15) + ")");

    legendScatter.append("rect")
        .attr("x", widthScatter + 50)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", d => getColor(d));

    legendScatter.append("text")
        .attr("x", widthScatter + 70)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("font-size", "8px")
        .text(d => d);

    svgScatter.append("g").call(d3.axisLeft(yScatter));
    svgScatter.append("g")
        .attr("transform", "translate(0," + heightScatter + ")")
        .call(d3.axisBottom(xScatter));

    svgScatter.append("text")
        .attr("x", widthScatter / 2)
        .attr("y", heightScatter + 40)
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("Defense");

    svgScatter.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 0 - heightScatter / 2)
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("Attack");

    d3.select("#scatter-plot-title")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Attack vs Defense of Pokémon");

    // ----- Parallel Coordinates -----
    const marginParallel = { top: 40, right: 150, bottom: 20, left: 100 };
    const widthParallel = 1000 - marginParallel.left - marginParallel.right;
    const heightParallel = 400 - marginParallel.top - marginParallel.bottom;

    const svgParallelCoordinates = d3.select("#parallel-coordinates").append("svg")
        .attr("width", widthParallel + marginParallel.left + marginParallel.right)
        .attr("height", heightParallel + marginParallel.top + marginParallel.bottom)
        .append("g")
        .attr("transform", `translate(${marginParallel.left},${marginParallel.top})`);

    const dimensions = ["HP", "Attack", "Defense", "Speed"];

    const yScales = {};
    dimensions.forEach(dim => {
        yScales[dim] = d3.scaleLinear()
            .domain(d3.extent(data, d => +d[dim]))
            .range([heightParallel, 0]);
    });

    const xParallel = d3.scalePoint()
        .domain(dimensions)
        .range([0, widthParallel]);

    function path(d) {
        return d3.line()(dimensions.map(p => [xParallel(p), yScales[p](+d[p])]));
    }

    const parallelPaths = svgParallelCoordinates.selectAll(".line")
        .data(data)
        .enter().append("path")
        .attr("class", "line")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", d => getColor(d.Type_1))
        .attr("stroke-opacity", 0.3)
        .attr("stroke-width", 1);

    dimensions.forEach(dim => {
        svgParallelCoordinates.append("g")
            .attr("transform", `translate(${xParallel(dim)},0)`)
            .call(d3.axisLeft(yScales[dim]))
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -10)
            .style("font-size", "8px")
            .text(dim)
            .style("fill", "black")
            .style("font-weight", "bold");
    });

    d3.select("#parallel-coordinates-title")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Pokémon Stats");

    const legendParallelCoordinates = svgParallelCoordinates.selectAll(".legend")
        .data(legendData)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0,${i * 15})`);

    legendParallelCoordinates.append("rect")
        .attr("x", widthParallel + 50)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", d => getColor(d));

    legendParallelCoordinates.append("text")
        .attr("x", widthParallel + 70)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("font-size", "8px")
        .text(d => d);

    // Interaction
    function highlightType(type) {
    scatterDots.transition()
        .duration(500)
        .attr("opacity", d => d.Type_1 === type ? 1 : 0.1);

    parallelPaths.transition()
        .duration(500)
        .attr("stroke-opacity", d => d.Type_1 === type ? 1 : 0.05);
}

    function resetHighlight() {
    scatterDots.transition()
        .duration(500)
        .attr("opacity", 1);

    parallelPaths.transition()
        .duration(500)
        .attr("stroke-opacity", 0.3);
}

    function updateBarHighlight() {
        bars.attr("fill", d => {
            if (selectedType && selectedType !== d[0]) return "#ccc";
            return getColor(d[0]);
        });

        // Add a transparent rect behind the parallel coordinates plot
svgParallelCoordinates.append("rect")
    .attr("width", widthParallel)
    .attr("height", heightParallel)
    .attr("fill", "transparent")
    .lower()
    .on("click", () => {
        selectedType = null;
        resetHighlight();
    });
    }
});

