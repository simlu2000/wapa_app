import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import "../../Styles/style_naturalevents.css";
import { Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);
const NaturalEventsChart = () => {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://eonet.gsfc.nasa.gov/api/v3/events');
        // Trasforma i dati in un formato adatto per i grafici
        const data = response.data.events.reduce((acc, event) => {
          const category = event.categories[0].title;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        // Converti l'oggetto in un array per Chart.js
        const formattedData = {
          labels: Object.keys(data),
          datasets: [{
            label: 'Numero di Eventi',
            data: Object.values(data),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        };
        setEventsData(formattedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p className="text-no-data">Loading data...</p>;
  if (error) return <p className="text-no-data">Error while loading data. Try later.</p>;

  return (
    <section id="natural-events">
            <h2>Distribution of natural events by category</h2> 
      <Bar 
        data={eventsData} 
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Distributions of natural events by category',
            },
          },
        }}
      />
    </section>
  );
};

export default NaturalEventsChart;
