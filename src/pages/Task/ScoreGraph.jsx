import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import './ScoreGraph.css'; // Import your custom CSS file for styles

ChartJS.register(
    LinearScale,
    CategoryScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function ScoreGraph({ scores }) {
    const data = {
        labels: scores.map((_, index) => `Task ${index + 1}`),
        datasets: [
            {
                label: 'Score Progress',
                data: scores,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.3, // Smoother line
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 16,
                        family: 'Arial, sans-serif',
                    },
                },
            },
            tooltip: {
                titleFont: {
                    size: 14,
                    family: 'Arial, sans-serif',
                },
                bodyFont: {
                    size: 12,
                    family: 'Arial, sans-serif',
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(200, 200, 200, 0.5)', // Grid color
                },
                ticks: {
                    font: {
                        size: 12,
                        family: 'Arial, sans-serif',
                    },
                },
            },
            y: {
                grid: {
                    color: 'rgba(200, 200, 200, 0.5)', // Grid color
                },
                ticks: {
                    font: {
                        size: 12,
                        family: 'Arial, sans-serif',
                    },
                },
            },
        },
    };

    return (
        <div className="score-graph-container">
            <h2>Score Progress</h2>
            <Line data={data} options={options} />
        </div>
    );
}

export default ScoreGraph;
