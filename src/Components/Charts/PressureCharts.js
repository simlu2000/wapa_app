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
                text: "Pressure",
                left: "center",
                textStyle: {
                    fontSize:20,
                    color: "#f7f7f7"
                }

            },
            tooltip: {
                formatter: '{a} <br/>{b} : {c}%',
                textStyle: {
                    color: "#f7f7f7"
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
                            color: "#f7f7f7"
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#f7f7f7"
                        }
                    },
                    detail: {
                        formatter: '{value}',
                        textStyle: {
                            fontSize: 10,
                            color: "#f7f7f7"
                        }
                    },
                    data: [
                        {
                            value: pressure,
                            name: 'Pressure',
                            textStyle: {
                                color: "#F7F7F7",
                            },
                            itemStyle: {
                                color: "#F7F7F7",
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
