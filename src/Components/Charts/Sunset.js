import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';


const Sunset = ({ time }) => {
    useEffect(() => {
        if (!time) return; // Verifica presenza ora (check if time is defined)

        const width = 300;
        const height = 300;
        const radius = Math.min(width, height) / 2 - 20;

        const colors = {
            sunset: '#FFA500',
        };

        // Rimuovo (pulisco) elementi precedenti (remove previous elements)
        d3.select("#sunset-chart").selectAll("*").remove();

        const svg = d3.select("#sunset-chart")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Scala per arco (scale for arc)
        const xScale = d3.scaleLinear()
            .domain([0, 24]) // 24 ore (24 hours)
            .range([0, 2 * Math.PI]);

        // Arco tramonto (sunset arc)
        const sunsetArc = d3.arc()
            .innerRadius(radius - 20)
            .outerRadius(radius)
            .startAngle(xScale(new Date(time * 1000).getHours()))
            .endAngle(xScale(new Date(time * 1000).getHours() + 1)); // Sunset covers a full hour

        // Creo arco tramonto (create sunset arc)
        svg.append("path")
            .attr("d", sunsetArc)
            .attr("fill", colors.sunset);

        // Calcolo ora tramonto (calculate sunset time)
        const sunsetTime = new Date((time + 12) * 1000);

        // Testo tramonto centrato verticalmente (sunset text centered vertically)
        svg.append("text")
            .attr("text-anchor", "middle") // Centro orizzontale (center horizontally)
            .attr("dominant-baseline", "central") // Centro verticale con 'dominant-baseline'
            .attr("y", radius - 100)
            .text(`${sunsetTime.toLocaleTimeString()}`)
            .attr("fill", colors.sunset)
            .attr("font-size", 20);
    }, [time]);

    const iconStyle = {
        position: 'absolute',
        top: '135px',
        left: '150px',
        transform: 'translate(-50%, -50%)',
        color: '#FFA500',
        fontSize: '40px',
      };
    

    return (
        <div className="light-chart" style={{ position: 'relative', width: '300px', height: '300px' }}>
            <svg id="sunset-chart" width="600" height="600"></svg>
            <FontAwesomeIcon icon={faArrowDown} style={iconStyle} />
        </div>
    );
};

export default Sunset;
