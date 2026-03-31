'use client';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// We must register the Chart.js components we want to use
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  domainScores: Record<string, number>;
}

export default function RadarChart({ domainScores }: RadarChartProps) {
  const data = {
    // The 6 domains become the points on our spider web
    labels: Object.keys(domainScores),
    datasets: [
      {
        label: 'Domain Score',
        data: Object.values(domainScores),
        backgroundColor: 'rgba(57, 255, 20, 0.15)', // Faded neon green fill
        borderColor: 'rgba(57, 255, 20, 1)',       // Solid neon green border
        pointBackgroundColor: '#070b09',           // Dark center dot
        pointBorderColor: 'rgba(57, 255, 20, 1)',  // Neon green dot border
        pointHoverBackgroundColor: '#fff',         // White dot on hover
        pointHoverBorderColor: 'rgba(57, 255, 20, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: { size: 12, family: 'sans-serif', weight: 'bold' as const },
        },
        ticks: {
          display: false, // Hides the 0-100 numbers along the web lines for a cleaner look
          min: 0,
          max: 100,
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: { display: false }, // Hides the dataset label at the top
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#39ff14',
        bodyColor: '#fff',
        borderColor: '#39ff14',
        borderWidth: 1,
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-[400px] md:h-[500px] relative">
      <Radar data={data} options={options} />
    </div>
  );
}
