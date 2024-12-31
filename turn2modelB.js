<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Accessible Bar Chart Example</title>
    <script src="https://d3js.org/d3.v6.min.js"></script>
    <style>
        .bar {
            fill: steelblue;
        }
        .bar:hover {
            fill: orange;
        }
        .axis--x path,
        .axis--y path {
            display: none;
        }
    </style>
</head>
<body>
<svg width="600" height="400"></svg>
<script>
    // Hypothetical data for the visualization
    const data = [
        { name: 'January', value: 50 },
        { name: 'February', value: 75 },
        { name: 'March', value: 90 },
        { name: 'April', value: 80 },
        { name: 'May', value: 65 }
    ];

    // Utility function to create scales
    const createScales = (data, width, height) => {
        const xScale = d3.scaleBand()
            .domain(data.map((d) => d.name))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)])
            .range([height, 0]);

        return { xScale, yScale };
    };

    // Function to render the bar chart
    const renderBarChart = (data) => {
        const svg = d3.select("svg"),
            margin = {top: 20, right: 30, bottom: 40, left: 40},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        const { xScale, yScale } = createScales(data, width, height);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create the bars
        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", (d) => xScale(d.name))
            .attr("y", (d) => yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => height - yScale(d.value))
            .attr("aria-describedby", "bar-chart-description") // Associate bars with the description
            .on("mouseover", () => {
                const tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .text((d) => `${d.name}: ${d.value}`);
            })
            .on("mouseout", () => {
                d3.select("body").select(".tooltip").remove();
            });

        // Add the x-axis
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll(".tick text")
            .attr("aria-hidden", "true"); // Hide tick texts from screen readers

        // Add the y-axis
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(yScale))
            .selectAll(".tick text")
            .attr("aria-hidden", "true"); // Hide tick texts from screen readers

        // Add a description of the chart for screen readers
        svg.append("desc")
            .attr("id", "bar-chart-description")
            .text("This bar chart represents monthly sales data from January to May. The bars show the sales value for each month, with the highest sales in March and the lowest in May.");
    };

    // Call the render function
    renderBarChart(data);
</script>
<style>
    .tooltip {
        position: absolute;
        background-color: white;
        padding: 4px;
        border: 1px solid black;
        border-radius: 3px;
        font-size: 12px;
        margin-left: 10px;
    }
</style>
</body>
</html>
