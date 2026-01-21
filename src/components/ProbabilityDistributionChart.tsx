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
  Filler,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import type { ChartData } from 'chart.js';
import { getHue, getLuminance } from '../utils/chartUtils';
import { useChartDownload } from '../hooks/useChartDownload';
import { ChartWithDownloadButton } from './ChartWithDownloadButton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProbabilityDistributionChartProps {
  distributions: number[][];
  labels: string[];
  xAxisLabel?: string;
}

export function ProbabilityDistributionChart({
  distributions,
  labels,
  xAxisLabel,
}: ProbabilityDistributionChartProps) {
  const { t } = useTranslation();
  const { chartRef, handleDownload } = useChartDownload(
    'probability-distribution-chart.png'
  );

  const chartData: ChartData<'line'> = useMemo(() => {
    const datasets = distributions.map((dist, index) => {
      const xValues: number[] = [];
      for (let i = 0; i < dist.length; i++) {
        xValues.push(i);
      }

      const hue = getHue(index);
      const luminance = getLuminance(index);

      // 表示を最初の101サンプルに制限
      const displayDist = dist.slice(0, 101);

      return {
        label: labels[index] || `Distribution ${index + 1}`,
        data: displayDist.map((prob, idx) => ({
          x: idx,
          y: prob,
        })),
        borderColor: `hsl(${hue}, 80%, ${luminance}%)`,
        backgroundColor: `hsla(${hue}, 80%, ${luminance}%, 0.08)`,
        fill: true,
        tension: 0,
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
          text: xAxisLabel ?? t('distribution.xAxis'),
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

  return (
    <ChartWithDownloadButton onDownload={handleDownload}>
      <Line ref={chartRef} data={chartData} options={options} />
    </ChartWithDownloadButton>
  );
}
