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

import { getTranslation } from '../utils/i18n';

interface RadarChartProps {
  domainScores: Record<string, number>;
  lang: string;
  isPrintTheme?: boolean;
}

export default function RadarChart({ domainScores, lang, isPrintTheme = false }: RadarChartProps) {
  const data = {
    labels: Object.keys(domainScores).map(domain => getTranslation(lang, domain) || domain),
    datasets: [
      {
        label: 'Domain Score',
        data: Object.values(domainScores),
        backgroundColor: isPrintTheme ? 'rgba(0, 0, 0, 0.1)' : 'rgba(57, 255, 20, 0.15)',
        borderColor: isPrintTheme ? '#000000' : 'rgba(57, 255, 20, 1)',
        pointBackgroundColor: isPrintTheme ? '#ffffff' : '#070b09',
        pointBorderColor: isPrintTheme ? '#000000' : 'rgba(57, 255, 20, 1)',
        pointHoverBackgroundColor: isPrintTheme ? '#000000' : '#fff',
        pointHoverBorderColor: isPrintTheme ? '#000000' : 'rgba(57, 255, 20, 1)',
        borderWidth: isPrintTheme ? 3 : 2,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: isPrintTheme ? 'rgba(0,0,0,0.2)' : 'rgba(255, 255, 255, 0.1)' },
        grid: { color: isPrintTheme ? 'rgba(0,0,0,0.2)' : 'rgba(255, 255, 255, 0.1)' },
        pointLabels: {
          color: isPrintTheme ? '#000000' : 'rgba(255, 255, 255, 0.8)',
          font: { size: 12, family: 'sans-serif', weight: 'bold' as const },
        },
        ticks: {
          display: false,
          min: 0,
          max: 100,
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isPrintTheme ? '#fff' : 'rgba(0, 0, 0, 0.9)',
        titleColor: isPrintTheme ? '#000' : '#39ff14',
        bodyColor: isPrintTheme ? '#333' : '#fff',
        borderColor: isPrintTheme ? '#000' : '#39ff14',
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
