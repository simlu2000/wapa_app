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
                text: "Temperature",
                left: "center",
                textStyle: {
                    color: "#F7F7F7",
                    fontSize:20,

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
                    itemStyle: { color: "#F7F7F7" },
                    progress: { show: true, width: 30 },
                    pointer: { show: false },
                    axisLine: { lineStyle: { width: 32 } },
                    axisTick: { distance: -40, splitNumber: 5, lineStyle: { width: 2, color: "#999" } },
                    splitLine: { distance: -50, length: 14, lineStyle: { width: 2, color: "#F7F7F7" } },
                    axisLabel: { distance: 5, color: "#F7F7F7", fontSize: 10 },
                    detail: {
                        valueAnimation: true,
                        width: "60%",
                        lineHeight: 40,
                        borderRadius: 8,
                        offsetCenter: [0, "-15%"],
                        fontSize: 24,
                        fontWeight: "bolder",
                        formatter: "{value} °C",
                        color: "#F7F7F7"
                    },
                    data: [{ value: temperature }]
                }
            ]
        };
    };

    const chartStyle = { /*regolazione grandezza in base a grandezza schermo*/
        height: window.innerWidth < 576 ? "2rem" : "20rem",
        width: window.innerWidth < 576 ? "2rem" : "20rem"
    };

    return (
        <div className="charts">
            <ReactECharts option={getOption()} style={chartStyle} />
        </div>
    );
};

export default TempCharts;
