import React from "react";
import ReactECharts from "echarts-for-react";

const WindCharts = ({ windSpeed}) => {
    const getOption = () => {
        return {
            title: {
                text: "Wind speed",
                left: "center",
                textStyle:{
                    fontSize:20,
                    color:"#f7f7f7"
                }
                
                
            },
            series: [{
                type: "gauge",
                progress: {
                    show: true,
                    width: 18
                },
                axisLine: {
                    lineStyle: {
                        width: 18
                    }
                },
                axisTick: {
                    splitNumber: 10,
                    length: 10,
                    lineStyle: {
                        width: 2
                    }
                },
                splitLine: {
                    length: 20,
                    lineStyle: {
                        width: 3
                    }
                },
                axisLabel: {
                    distance: 25,
                    textStyle:{
                        fontSize:16,
                        color:"#f7f7f7"
                    }
                },
                pointer: {
                    width: 5,
                    length: '80%'
                },
                detail: {
                    valueAnimation: true,
                    formatter: '{value} m/s',
                    textStyle:{
                        fontSize:16,
                        color:"#f7f7f7"
                    }
                },
                data: [{
                    value: windSpeed
                }]
            }]
        };
    };

   

    return (
        <div  className="charts" id="c1">
        <ReactECharts
            option={getOption()}
            style={{ height: "25rem", width: "25rem"}}
        />
        </div>
    );
};

export default WindCharts;