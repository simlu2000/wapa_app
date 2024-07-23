import React from 'react';

const PercentageBox = ({ label, percentage }) => {
    const backgroundColor = `rgba(${Math.min(255, (percentage / 100) * 255)}, ${Math.min(255, 255 - (percentage / 100) * 255)}, 0, 0.8)`;

    const boxStyle = {
        backgroundColor,
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        borderRadius: '10px',
        fontSize: '20px',
        width: '150px',
        margin: '10px auto',
    };

    return (
        <div className="meteo-box" style={boxStyle}>
            {label}: {percentage}%
        </div>
    );
};

export default PercentageBox;
