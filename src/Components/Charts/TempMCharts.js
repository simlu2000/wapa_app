import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";

const TempCharts = ({ initialTemperature }) => {
    const [temperature, setTemperature] = useState(initialTemperature);
    
    useEffect(() => {
        setTemperature(initialTemperature);
    }, [initialTemperature]);

    const getOption = () => {
        return {
            title: {
                
                left: "center",
                textStyle: {
                    

                }
            },
            series: [
                {
                    type: "gauge",
                    center: ["50%", "60%"],
                    startAngle: 200,
                    endAngle: -20,
                    min: 0,
                    max: 60,
                    itemStyle: { color: "#47BFFF" },
                    progress: { show: true, width: 30 },
                    pointer: { show: false },
                    axisLine: { lineStyle: { width: 32 } },
                    axisTick: { distance: -40, splitNumber: 5, lineStyle: { width: 2, color: "#999" } },
                    splitLine: { distance: -50, length: 14, lineStyle: { width: 2, color: "#000000" } },
                    axisLabel: { distance: 5, color: "#000000", fontSize: 10 },
                    detail: {
                        valueAnimation: true,
                        width: "60%",
                        lineHeight: 40,
                        borderRadius: 8,
                        offsetCenter: [0, "-15%"],
                        fontSize: 24,
                        fontWeight: "bolder",
                        formatter: "{value} °C",
                        color: "#000000"
                    },
                    data: [{ value: temperature }]
                }
            ]
        };
    };

    const chartStyle = { /*regolazione grandezza in base a grandezza schermo*/
        height: window.innerWidth < 576 ? "2rem" : "20rem",
        width: window.innerWidth < 576 ? "2rem" : "20rem",
        
    };

    return (
        <div className="MeteoCharts">
            <ReactECharts option={getOption()} style={chartStyle} />
        </div>
    );
};

export default TempCharts;
