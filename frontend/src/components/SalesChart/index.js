// src/components/SalesChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import api from '../api'; // Import the configured Axios instance

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SalesChart = () => {
    const [salesData, setSalesData] = useState([]);
    const [timeframe, setTimeframe] = useState('monthly');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data using the configured Axios instance
                const response = await api.get(`/api/analytics/sales-over-time/${timeframe}`);
                setSalesData(response.data);
            } catch (err) {
                console.error('Error fetching sales data:', err);
            }
        };

        fetchData();
    }, [timeframe]);

    const data = {
        labels: salesData.map((entry) => entry._id),
        datasets: [
            {
                label: `Total Sales (${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)})`,
                data: salesData.map((entry) => entry.totalSales),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Total Sales Over Time (${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)})`,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Sales Amount (USD)',
                },
            },
        },
    };

    return (
        <div>
            <h2>Total Sales Over Time</h2>
            <select onChange={(e) => setTimeframe(e.target.value)} value={timeframe}>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
            </select>
            <Line data={data} options={options} />
        </div>
    );
};

export default SalesChart;
