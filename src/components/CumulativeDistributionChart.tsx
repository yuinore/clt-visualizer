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
import type { DiscreteDistribution } from '../types/discreteDistribution';
import { limitRange } from '../types/discreteDistribution';

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
  distributions: DiscreteDistribution[];
  labels: string[];
  xAxisLabel?: string;
  displayRangeMin?: number;
  displayRangeMax?: number;
  isRangeFixed?: boolean;
}

export function CumulativeDistributionChart({
  distributions,
  labels,
  xAxisLabel,
  displayRangeMin = -100,
  displayRangeMax = 100,
  isRangeFixed = false,
}: CumulativeDistributionChartProps) {
  const { t } = useTranslation();
  const { chartRef, handleDownload } = useChartDownload<ChartJS<'line'>>(
    'cumulative-distribution-chart.png',
  );

  const chartData: ChartData<'line'> = useMemo(() => {
    const datasets = distributions.map((dist, index) => {
      // CDFを計算
      const cdf = computeCDF(dist);

      const hue = getHue(index);
      const luminance = getLuminance(index);

      // 表示範囲を制限
      const displayCdf = limitRange(cdf, displayRangeMin, displayRangeMax);

      const xValues: number[] = [];
      for (let i = 0; i < displayCdf.distribution.length; i++) {
        xValues.push(i + displayCdf.offset);
      }

      return {
        label: labels[index] || `CDF ${index + 1}`,
        data: displayCdf.distribution.map((prob, idx) => ({
          x: idx + displayCdf.offset,
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
  }, [distributions, labels, displayRangeMin, displayRangeMax]);

  const options: ChartOptions<'line'> = useMemo(
    () => ({
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
          ticks: {
            stepSize: 1,
          },
          ...(isRangeFixed && {
            min: displayRangeMin,
            max: displayRangeMax,
          }),
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
    }),
    [t, xAxisLabel, isRangeFixed, displayRangeMin, displayRangeMax],
  );

  return (
    <ChartWithDownloadButton onDownload={handleDownload}>
      <Line ref={chartRef} data={chartData} options={options} />
    </ChartWithDownloadButton>
  );
}
