import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faCalendar, faLightbulb } from '@fortawesome/free-solid-svg-icons';

const LunarPhases = () => {
    const [lunarPhase, setLunarPhase] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLunarPhases = async () => {
            try {
                const currentTimestamp = Math.floor(Date.now() / 1000);
                const response = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${currentTimestamp}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data about lunar phases');
                }
                const data = await response.json();
                console.log("Response data:", data);

                if (data.length > 0) {
                    setLunarPhase(data[0]);
                    console.log("LUNAR OK", data[0]);
                } else {
                    console.log("No data available for the provided date.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLunarPhases();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <p className="text-no-data">Error while loading data. Try later.</p>;

    return (
        <div className="lunar-phase">
            <h3 className="data-title">Lunar Phases for today</h3>
            <div className="info-container">
                <FontAwesomeIcon icon={faMoon} color={'#F7F7F7'} />
                <p>Phase: {lunarPhase.Phase || 'N/A'}</p>
            </div>
            <hr className="line"></hr>
            <div className="info-container">
                <FontAwesomeIcon icon={faLightbulb} color={'#F7F7F7'}/>
                <p>Illumination: {lunarPhase.Illumination || 'N/A'}%</p>
            </div>
            <hr className="line"></hr>
            <div className="info-container">
                <FontAwesomeIcon icon={faCalendar} color={'#F7F7F7'} />
                <p>Date: {lunarPhase.TargetDate ? new Date(lunarPhase.TargetDate * 1000).toLocaleDateString() : 'N/A'}</p>
            </div>
        </div>
    );
};

export default LunarPhases;
