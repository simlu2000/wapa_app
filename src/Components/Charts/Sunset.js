import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

const Sunset = ({ sunsetTime }) => {
    useEffect(() => {
        if (!sunsetTime) return; // Verifica ora

        const width = 300;
        const height = 300;
        const radius = Math.min(width, height) / 2 - 20;

        const colors = {
            sunset: '#350151',
            circle :"#350151"
        };

        //Pulizia elem precedenti
        d3.select("#sunset-chart").selectAll("*").remove();

        const svg = d3.select("#sunset-chart")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        //Scala per l'angolo
        const xScale = d3.scaleLinear()
            .domain([0, 24]) // 24 ore
            .range([0, 2 * Math.PI]);

        //Ora tramonto in ore e min
        const date = new Date(sunsetTime * 1000);
        const hours = date.getHours() + date.getMinutes() / 60;
        
        const arc = d3.arc()
            .innerRadius(radius - 20)
            .outerRadius(radius)
            .startAngle(xScale(hours))
            .endAngle(xScale(hours + 1)); // Tramonto copre un'ora

        //Creazione arco
        svg.append("path")
            .attr("d", arc)
            .attr("fill", colors.sunset);

        //Ora tramonto
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("y", radius - 50)
            .text(`Sunset at ${date.toLocaleTimeString()}`)
            .attr("fill", colors.sunset)
            .attr("font-size", 28);
    }, [sunsetTime]);

    const iconStyle = {
        position: 'absolute',
        top: '135px',
        left: '150px',
        transform: 'translate(-50%, -50%)',
        color: '#350151',
        fontSize: '40px',
    };

    return (
        <div id="light2" className="light-chart" style={{ position: 'relative', width: '300px', height: '300px' }}>
            <svg id="sunset-chart"></svg>
            <FontAwesomeIcon icon={faMoon} style={iconStyle} />
        </div>
    );
};

export default Sunset;
