// Define your visualization function
function visualizeMath() {
    // Create an SVG container
    const svg = d3.select("#visualization");

    // Create a circle using a path element
    const path = svg.append("path")
        .attr("d", "M100,100 m-100,0 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0")
        .attr("transform", "translate(100, 50)")
        .attr("r", 50)
        .attr("fill", "blue");

    // Transition the path to a star
    path.transition()
        .duration(3000)
        .attr("fill", "black");
}

// Call the visualization function
visualizeMath();
