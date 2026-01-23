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
import { computeCDF } from '../utils/probability';
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
  Filler,
);

interface CumulativeDistributionChartProps {
  distributions: number[][];
  labels: string[];
  xAxisLabel?: string;
}

export function CumulativeDistributionChart({
  distributions,
  labels,
  xAxisLabel,
}: CumulativeDistributionChartProps) {
  const { t } = useTranslation();
  const { chartRef, handleDownload } = useChartDownload(
    'cumulative-distribution-chart.png',
  );

  const chartData: ChartData<'line'> = useMemo(() => {
    const datasets = distributions.map((dist, index) => {
      // CDFを計算
      const cdf = computeCDF(dist);

      const xValues: number[] = [];
      for (let i = 0; i < cdf.length; i++) {
        xValues.push(i);
      }

      const hue = getHue(index);
      const luminance = getLuminance(index);

      // 表示を最初の101サンプルに制限
      const displayCdf = cdf.slice(0, 101);

      return {
        label: labels[index] || `CDF ${index + 1}`,
        data: displayCdf.map((prob, idx) => ({
          x: idx,
          y: prob,
        })),
        borderColor: `hsl(${hue}, 80%, ${luminance}%)`,
        backgroundColor: `hsla(${hue}, 80%, ${luminance}%, 0.08)`,
        fill: false,
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
        text: t('cdf.title'),
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
          text: t('cdf.yAxis'),
        },
        beginAtZero: true,
        // max: 1.0,
      },
    },
  };

  return (
    <ChartWithDownloadButton onDownload={handleDownload}>
      <Line ref={chartRef} data={chartData} options={options} />
    </ChartWithDownloadButton>
  );
}
