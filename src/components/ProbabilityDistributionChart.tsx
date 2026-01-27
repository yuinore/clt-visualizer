import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface ProbabilityDistributionChartProps {
  distributions: number[][];
  labels: string[];
  xAxisLabel?: string;
  chartType?: 'line' | 'bar';
}

export function ProbabilityDistributionChart({
  distributions,
  labels,
  xAxisLabel,
  chartType = 'line',
}: ProbabilityDistributionChartProps) {
  const { t } = useTranslation();
  const lineChartRef = useChartDownload<ChartJS<'line'>>(
    'probability-distribution-chart.png',
  );
  const barChartRef = useChartDownload<ChartJS<'bar'>>(
    'probability-distribution-chart.png',
  );

  // 共通のデータセット準備ロジック
  const datasets = useMemo(() => {
    return distributions.map((dist, index) => {
      const hue = getHue(index);
      const luminance = getLuminance(index);

      // 表示を最初の101サンプルに制限
      const displayDist = dist.slice(0, 101);

      const baseDataset = {
        label: labels[index] || `Distribution ${index + 1}`,
        data: displayDist.map((prob, idx) => ({
          x: idx,
          y: prob,
        })),
        borderColor: `hsl(${hue}, 80%, ${luminance}%)`,
        backgroundColor: `hsla(${hue}, 80%, ${luminance}%, ${chartType === 'bar' ? 0.6 : 0.08})`,
      };

      if (chartType === 'line') {
        return {
          ...baseDataset,
          fill: true,
          tension: 0,
          pointRadius: 3,
          pointHoverRadius: 5,
        };
      } else {
        return {
          ...baseDataset,
          borderWidth: 1,
        };
      }
    });
  }, [distributions, labels, chartType]);

  const chartData = useMemo(() => {
    return { datasets };
  }, [datasets]);

  // 共通のオプション準備ロジック
  const options = useMemo(
    () => ({
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
          mode: 'index' as const,
          intersect: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: xAxisLabel ?? t('distribution.xAxis'),
          },
          type: 'linear' as const,
          position: 'bottom' as const,
          ticks: {
            stepSize: 1,
          },
        },
        y: {
          title: {
            display: true,
            text: t('distribution.yAxis'),
          },
          beginAtZero: true,
        },
      },
    }),
    [t, xAxisLabel],
  );

  return (
    <>
      {chartType === 'line' ? (
        <ChartWithDownloadButton onDownload={lineChartRef.handleDownload}>
          <Line
            ref={lineChartRef.chartRef}
            data={chartData as ChartData<'line'>}
            options={options as ChartOptions<'line'>}
          />
        </ChartWithDownloadButton>
      ) : (
        <ChartWithDownloadButton onDownload={barChartRef.handleDownload}>
          <Bar
            ref={barChartRef.chartRef}
            data={chartData as unknown as ChartData<'bar'>}
            options={options as ChartOptions<'bar'>}
          />
        </ChartWithDownloadButton>
      )}
    </>
  );
}
