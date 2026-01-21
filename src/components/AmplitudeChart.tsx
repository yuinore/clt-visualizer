import { useMemo } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import AspectRatio from '@mui/joy/AspectRatio';
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

interface AmplitudeChartProps {
  amplitudeDataArray: AmplitudePoint[][];
  labels: string[];
  isDb?: boolean;
}

export function AmplitudeChart({
  amplitudeDataArray,
  labels,
  isDb = false,
}: AmplitudeChartProps) {
  const { t } = useTranslation();

  const chartData: ChartData<'line'> = useMemo(() => {
    const datasets = amplitudeDataArray.map((amplitudeData, index) => {
      // 色は畳み込み回数に基づいて固定
      const hue = [0, 25, 50, 70, 120, 180, 210, 250, 290, 330][index % 10];
      const luminance = [70, 60, 50, 48, 60, 50, 60, 70, 70, 70][index % 10];
      const toDb = (amp: number) => 20 * Math.log10(Math.max(amp, 1e-12));

      return {
        label: labels[index] || `Amplitude ${index + 1}`,
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

    return {
      datasets,
    };
  }, [amplitudeDataArray, labels, isDb]);

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
        min: 0,
        max: Math.PI,
      },
      y: {
        title: {
          display: true,
          text: isDb ? t('amplitude.yAxisDb') : t('amplitude.yAxis'),
        },
        min: isDb ? -100 : undefined,
        max: isDb ? 10 : undefined,
        beginAtZero: !isDb,
      },
    },
  };

  return (
    <CssVarsProvider>
      <AspectRatio
        variant="plain"
        ratio="2 / 1"
        sx={{ width: '100%', minWidth: 0 }}
      >
        <Line data={chartData} options={options} />
      </AspectRatio>
    </CssVarsProvider>
  );
}
