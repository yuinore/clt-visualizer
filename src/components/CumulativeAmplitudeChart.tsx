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
import type { AmplitudePoint } from '../utils/zTransform';
import { computeStepFunctionAmplitude } from '../utils/zTransform';
import { getHue, getLuminance, toDb } from '../utils/chartUtils';
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

interface CumulativeAmplitudeChartProps {
  amplitudeDataArray: AmplitudePoint[][];
  labels: string[];
  isDb?: boolean;
}

export function CumulativeAmplitudeChart({
  amplitudeDataArray,
  labels,
  isDb = false,
}: CumulativeAmplitudeChartProps) {
  const { t } = useTranslation();
  const { chartRef, handleDownload } = useChartDownload(
    'cumulative-amplitude-chart.png'
  );

  const chartData: ChartData<'line'> = useMemo(() => {
    // 既存のCDF振幅特性のデータセット
    const datasets = amplitudeDataArray.map((amplitudeData, index) => {
      const hue = getHue(index);
      const luminance = getLuminance(index);

      return {
        label: labels[index] || `CDF Amplitude ${index + 1}`,
        data: amplitudeData.map((point) => ({
          x: point.angularFrequency,
          y: isDb ? toDb(point.amplitude) : point.amplitude,
        })),
        borderColor: `hsl(${hue}, 80%, ${luminance}%)`,
        backgroundColor: `hsla(${hue}, 80%, ${luminance}%, 0.08)`,
        fill: index === amplitudeDataArray.length - 1 ? 'start' : '+1',
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
      };
    });

    // ステップ関数の振幅特性を灰色の点線で追加
    if (amplitudeDataArray.length > 0) {
      const firstAmplitudeData = amplitudeDataArray[0];
      const stepFunctionData = {
        label: t('cdfAmplitude.stepFunction'),
        data: firstAmplitudeData.map((point) => {
          const stepAmplitude = computeStepFunctionAmplitude(point.angularFrequency);
          return {
            x: point.angularFrequency,
            y: isDb ? toDb(stepAmplitude) : stepAmplitude,
          };
        }),
        borderColor: 'gray',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        fill: false,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
      };
      datasets.push(stepFunctionData as any);
    }

    return {
      datasets,
    };
  }, [amplitudeDataArray, labels, isDb, t]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('cdfAmplitude.title'),
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
        min: 0,
        max: Math.PI,
      },
      y: {
        title: {
          display: true,
          text: isDb ? t('amplitude.yAxisDb') : t('amplitude.yAxis'),
        },
        min: isDb ? -100 : undefined,
        max: isDb ? 40 : 10,
        beginAtZero: !isDb,
      },
    },
  };

  return (
    <ChartWithDownloadButton onDownload={handleDownload}>
      <Line ref={chartRef} data={chartData} options={options} />
    </ChartWithDownloadButton>
  );
}
