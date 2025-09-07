import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";

const PressureCharts = ({ initialPressure }) => {
    const [pressure, setPressure] = useState(initialPressure);

    useEffect(() => {
        setPressure(initialPressure)
    }, [initialPressure]);

    const getOption = () => {
        return {
            title: {
                text: "Atmospheric pressure",
                left: "center",
                textStyle: {
                    fontSize: 20,
                    color: "#000000",
                }

            },
            tooltip: {
                formatter: '{a} <br/>{b} : {c}%',
                textStyle: {
                    color: "#000000",
                }

            },
            series: [
                {
                    name: 'Pressure',
                    type: 'gauge',
                    axisLine: {
                        lineStyle: {
                            color: [[0.2, '#f7f7f7'], [0.8, '#f7f7f7'], [1, '#f7f7f7']],
                            width: 10
                        }
                    },
                    title: {
                        textStyle: {
                            color: "#000000",
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#000000",
                        }
                    },
                    detail: {
                        formatter: '{value}',
                        textStyle: {
                            fontSize: 10,
                            color: "#000000",
                        }
                    },
                    data: [
                        {
                            value: pressure,
                            name: 'A. Pressure',
                            textStyle: {
                                color: "#000000",
                            },
                            itemStyle: {
                                color: "#000000",
                            }
                        }
                    ]
                }
            ]
        }
    };
    return (
        <div id="c3" className="charts">
            <ReactECharts
                option={getOption()}
                style={{ height: "20rem", width: "19rem" }}
            />
        </div>
    )
}
export default PressureCharts;
