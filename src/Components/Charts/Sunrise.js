import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

const Sunrise = ({ time }) => {
    useEffect(() => {
        if (!time) return; //verifico ora

        const width = 300;
        const height = 300;
        const radius = Math.min(width, height) / 2 - 20;

        const colors = {
            sunrise: '#FFA500',
        };

        //pulisco elem prec
        d3.select("#sunrise-sunset-chart").selectAll("*").remove();

        const svg = d3.select("#sunrise-sunset-chart")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        //scales per posizionamento testo e arco
        const xScale = d3.scaleLinear()
            .domain([0, 24]) // 24 hours
            .range([0, 2 * Math.PI]);

        const yScale = d3.scaleLinear() // Not used
            .domain([0, width])
            .range([0, 0]);

        const arc = d3.arc()
            .innerRadius(radius - 20)
            .outerRadius(radius)
            .startAngle(0)
            .endAngle(xScale(new Date(time * 1000).getHours())); // Use only the hours

        //creo arco
        svg.append("path")
            .attr("d", arc)
            .attr("fill", colors.sunrise);

        //ora alba
        svg.append("text")
            .attr("text-anchor", "middle") // Center horizontally
            .attr("dominant-baseline", "central") // Center vertically
            .attr("y", radius - 100)
            .text(`${new Date(time * 1000).toLocaleTimeString()}`)
            .attr("fill", colors.sunrise)
            .attr("font-size", 20)
    }, [time]);

    //stile icona alba
    const iconStyle = {
        position: 'absolute',
        top: '135px',
        left: '150px',
        transform: 'translate(-50%, -50%)',
        color: '#FFA500',
        fontSize: '40px',
    };

    const timeStyle = {
        top: '150px',
        width: "300",
        height: "300",

    };

    return (
        <div className="light-chart" style={{ position: 'relative', width: '300px', height: '300px' }}>
            <svg id="sunrise-sunset-chart" style= {timeStyle}></svg>
            <FontAwesomeIcon icon={faArrowUp} style={iconStyle} />
        </div>
    );
};

export default Sunrise;
