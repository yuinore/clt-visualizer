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
import type { AmplitudePoint } from '../utils/zTransform';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AmplitudeChartProps {
  amplitudeData: AmplitudePoint[];
  label: string;
}

export function AmplitudeChart({ amplitudeData, label }: AmplitudeChartProps) {
  const { t } = useTranslation();

  const chartData: ChartData<'line'> = useMemo(() => {
    return {
      datasets: [
        {
          label,
          data: amplitudeData.map((point) => ({
            x: point.angularFrequency,
            y: point.amplitude,
          })),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 3,
        },
      ],
    };
  }, [amplitudeData, label]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('amplitude.title'),
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
          text: t('amplitude.xAxis'),
        },
        type: 'linear',
        position: 'bottom',
      },
      y: {
        title: {
          display: true,
          text: t('amplitude.yAxis'),
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
