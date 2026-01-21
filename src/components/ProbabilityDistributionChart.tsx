import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import type { ChartData } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProbabilityDistributionChartProps {
  distributions: number[][];
  labels: string[];
}

export function ProbabilityDistributionChart({
  distributions,
  labels,
}: ProbabilityDistributionChartProps) {
  const { t } = useTranslation();

  const chartData: ChartData<'line'> = useMemo(() => {
    const datasets = distributions.map((dist, index) => {
      const xValues: number[] = [];
      for (let i = 0; i < dist.length; i++) {
        xValues.push(i);
      }

      return {
        label: labels[index] || `Distribution ${index + 1}`,
        data: dist.map((prob, idx) => ({
          x: idx,
          y: prob,
        })),
        borderColor: `hsl(${(index * 360) / distributions.length}, 70%, 50%)`,
        backgroundColor: `hsla(${(index * 360) / distributions.length}, 70%, 50%, 0.1)`,
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5,
      };
    });

    return {
      datasets,
    };
  }, [distributions, labels]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('distribution.title'),
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: t('distribution.xAxis'),
        },
        type: 'linear',
        position: 'bottom',
      },
      y: {
        title: {
          display: true,
          text: t('distribution.yAxis'),
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
