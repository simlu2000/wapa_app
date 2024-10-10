import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-solid-svg-icons';

const Sunrise = ({ sunriseTime }) => {
    useEffect(() => {
        if (!sunriseTime) return; // Verifica ora

        const width = 300;
        const height = 300;
        const radius = Math.min(width, height) / 2 - 20;

        const colors = {
            sunrise: '#FFA500',
        };

        // Pulisci gli elementi precedenti
        d3.select("#sunrise-sunset-chart").selectAll("*").remove();

        const svg = d3.select("#sunrise-sunset-chart")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`)
            .attr("color", colors.circle);

        // Scala per l'angolo
        const xScale = d3.scaleLinear()
            .domain([0, 24]) // 24 ore
            .range([0, 2 * Math.PI]);

        // Ora alba in ore e minuti
        const date = new Date(sunriseTime * 1000);
        const hours = date.getHours() + date.getMinutes() / 60;
        
        const arc = d3.arc()
            .innerRadius(radius - 20)
            .outerRadius(radius)
            .startAngle(0)
            .endAngle(xScale(hours));

        // Crea l'arco
        svg.append("path")
            .attr("d", arc)
            .attr("fill", colors.sunrise);

        // Ora alba
        svg.append("text")
            .attr("text-anchor", "middle") 
            .attr("dominant-baseline", "central")
            .attr("y", radius - 50)
            .text(`Sunrise at ${date.toLocaleTimeString()}`)
            .attr("fill", colors.sunrise)
            .attr("font-size", 14);
    }, [sunriseTime]);

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
            <svg id="sunrise-sunset-chart"></svg>
            <FontAwesomeIcon icon={faSun} style={iconStyle} />
        </div>
    );
};

export default Sunrise;
