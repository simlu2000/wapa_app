import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

// Parametri personalizzati
const _panelImageURL = '/data/asset/img/custom-gauge-panel.png';
const _animationDuration = 1000;
const _animationDurationUpdate = 1000;
const _animationEasingUpdate = 'quarticInOut';
const _valOnRadianMax = 200;
const _outerRadius = 200;
const _innerRadius = 170;
const _pointerInnerRadius = 40;
const _insidePanelRadius = 140;

const MoreDataCharts = ({ value }) => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { width } = windowSize;

    const renderItem = (params, api) => {
        const valOnRadian = api.value(1);
        const coords = api.coord([api.value(0), valOnRadian]);
        const polarEndRadian = coords[3];
        const imageStyle = {
            image: _panelImageURL,
            x: params.coordSys.cx - _outerRadius,
            y: params.coordSys.cy - _outerRadius,
            width: _outerRadius * 2,
            height: _outerRadius * 2
        };
        return {
            type: 'group',
            children: [
                {
                    type: 'image',
                    style: imageStyle,
                    clipPath: {
                        type: 'sector',
                        shape: {
                            cx: params.coordSys.cx,
                            cy: params.coordSys.cy,
                            r: _outerRadius,
                            r0: _innerRadius,
                            startAngle: 0,
                            endAngle: -polarEndRadian,
                            transition: 'endAngle',
                            enterFrom: { endAngle: 0 }
                        }
                    }
                },
                {
                    type: 'image',
                    style: imageStyle,
                    clipPath: {
                        type: 'polygon',
                        shape: {
                            points: makePointerPoints(params, polarEndRadian)
                        },
                        extra: {
                            polarEndRadian: polarEndRadian,
                            transition: 'polarEndRadian',
                            enterFrom: { polarEndRadian: 0 }
                        },
                        during: function (apiDuring) {
                            apiDuring.setShape(
                                'points',
                                makePointerPoints(params, apiDuring.getExtra('polarEndRadian'))
                            );
                        }
                    }
                },
                {
                    type: 'circle',
                    shape: {
                        cx: params.coordSys.cx,
                        cy: params.coordSys.cy,
                        r: _insidePanelRadius
                    },
                    style: {
                        fill: '#fff',
                        shadowBlur: 25,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowColor: 'rgba(76,107,167,0.4)'
                    }
                },
                {
                    type: 'text',
                    extra: {
                        valOnRadian: valOnRadian,
                        transition: 'valOnRadian',
                        enterFrom: { valOnRadian: 0 }
                    },
                    style: {
                        text: makeText(valOnRadian),
                        fontSize: 50,
                        fontWeight: 700,
                        x: params.coordSys.cx,
                        y: params.coordSys.cy,
                        fill: 'rgb(0,50,190)',
                        align: 'center',
                        verticalAlign: 'middle',
                        enterFrom: { opacity: 0 }
                    },
                    during: function (apiDuring) {
                        apiDuring.setStyle(
                            'text',
                            makeText(apiDuring.getExtra('valOnRadian'))
                        );
                    }
                }
            ]
        };
    };

    const convertToPolarPoint = (renderItemParams, radius, radian) => [
        Math.cos(radian) * radius + renderItemParams.coordSys.cx,
        -Math.sin(radian) * radius + renderItemParams.coordSys.cy
    ];

    const makePointerPoints = (renderItemParams, polarEndRadian) => [
        convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
        convertToPolarPoint(
            renderItemParams,
            _outerRadius,
            polarEndRadian + Math.PI * 0.03
        ),
        convertToPolarPoint(renderItemParams, _pointerInnerRadius, polarEndRadian)
    ];

    const makeText = (valOnRadian) => {
        if (valOnRadian < -10) {
            console.warn('illegal during val: ' + valOnRadian);
        }
        return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
    };

    const getOption = () => ({
        animationEasing: _animationEasingUpdate,
        animationDuration: _animationDuration,
        animationDurationUpdate: _animationDurationUpdate,
        animationEasingUpdate: _animationEasingUpdate,
        dataset: {
            source: [[1, value]]
        },
        tooltip: {},
        angleAxis: {
            type: 'value',
            startAngle: 0,
            show: false,
            min: 0,
            max: _valOnRadianMax
        },
        radiusAxis: {
            type: 'value',
            show: false
        },
        polar: {},
        series: [
            {
                type: 'custom',
                coordinateSystem: 'polar',
                renderItem: renderItem
            }
        ]
    });

    const chartStyle = {
        height: width < 576 ? "0rem" : "20rem",
        width: width < 576 ? "0rem" : "20rem"
    };

    return (
        <div className="MeteoCharts">
            {width >= 576 ? (
                <ReactECharts option={getOption()} style={chartStyle} />
            ) : (
                <div style={{ fontSize: "2rem", textAlign: "center", color: "rgb(0,50,190)" }}>
                    {((value / _valOnRadianMax) * 100).toFixed(0)}%
                </div>
            )}
        </div>
    );
};

export default MoreDataCharts;
