import { useMemo } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
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

  const chartData: ChartData<'line'> = useMemo(() => {
    const datasets = distributions.map((dist, index) => {
      const xValues: number[] = [];
      for (let i = 0; i < dist.length; i++) {
        xValues.push(i);
      }

      // 色は試行回数に基づいて固定
      const hue = [0, 25, 50, 70, 120, 180, 210, 250, 290, 330][index % 10];
      const luminance = [70, 60, 50, 48, 60, 50, 60, 70, 70, 70][index % 10];

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
    <CssVarsProvider>
      <AspectRatio
        variant="plain"
        ratio="8 / 4"
        sx={{ width: '100%', minWidth: 0 }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <Line data={chartData} options={options} />
        </Box>
      </AspectRatio>
    </CssVarsProvider>
  );
}
