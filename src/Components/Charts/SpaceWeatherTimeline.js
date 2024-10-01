import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Api_Key_NASA } from '../../Utils/API_KEYS';
import "../../Styles/style_spaceweathertimeline.css";

// Registrazione dei componenti di chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const SpaceWeatherTimeline = () => {
  const [eventData, setEventData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dates, setDates] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    const API_KEY = Api_Key_NASA;
    const url = 'https://api.nasa.gov/DONKI/FLR';
    const params = {
      startDate: '2024-08-01',
      endDate: '2024-08-31',
      api_key: API_KEY,
    };

    axios.get(url, { params })
      .then(response => {
        const events = response.data.map(event => ({
          date: new Date(event.beginTime).toLocaleDateString(),
          type: event.classType,
          description: `Eruzione solare di classe ${event.classType}`,
        }));
        setEventData(events);

        // Trova tutte le date uniche
        const uniqueDates = Array.from(new Set(events.map(event => event.date))).sort();
        setDates(uniqueDates);
        setCurrentDate(uniqueDates[0]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Errore nel recupero dei dati:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (currentDate) {
      const filtered = eventData.filter(event => event.date === currentDate);
      setFilteredEvents(filtered);
    }
  }, [currentDate, eventData]);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error while loading data: {error.message}</p>;

  const data = {
    labels: filteredEvents.map(event => event.date),
    datasets: [
      {
        label: 'Eruzioni Solari',
        data: filteredEvents.map(event => event.type.charCodeAt(0) - 65),
        fill: false,
        backgroundColor: 'red',
        borderColor: 'red',
      },
    ],
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: currentIndex => setCurrentDate(dates[currentIndex]),
  };

  return (
    <section id="space-weather-timeline">
      <h2>Timeline of Solar Eruptions</h2>
      <div className="chart-container">
        <Line data={data} />
      </div>
      <Slider {...sliderSettings}>
        {dates.map((date, index) => (
          <div key={index} className="slider-item">
            <h3>{date}</h3>
            <div className="event-grid">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <div className="event-card" key={index}>
                    <h4>{event.date}</h4>
                    <p>{event.description}</p>
                  </div>
                ))
              ) : (
                <p>No data available for this date.</p>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default SpaceWeatherTimeline;
