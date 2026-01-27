import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Box, Paper, Typography, Switch, Slider } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DistributionSelector } from './components/DistributionSelector';
import { ConvolutionControls } from './components/ConvolutionControls';
import { DistributionParamsControls } from './components/DistributionParamsControls';
import { LanguageSelector } from './components/LanguageSelector';
import { ProbabilityDistributionChart } from './components/ProbabilityDistributionChart';
import { AmplitudeChart } from './components/AmplitudeChart';
import { CumulativeDistributionChart } from './components/CumulativeDistributionChart';
import { CumulativeAmplitudeChart } from './components/CumulativeAmplitudeChart';
import { DISTRIBUTIONS } from './distributions';
import { convolve } from './utils/probability';
import {
  computeZTransform,
  computeCDFAmplitudeFromDistribution,
  computeStepFunctionAmplitude,
} from './utils/zTransform';
import {
  cloneDiscreteDistribution,
  isDiscreteDistribution,
  type DiscreteDistribution,
} from './types/discreteDistribution';
import type { DistributionType } from './distributions';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const { t } = useTranslation();
  const [distributionType, setDistributionType] =
    useState<DistributionType>('dice');
  const [convolutionCount, setConvolutionCount] = useState(6);
  const [isDb, setIsDb] = useState(false);
  const [isBarChart, setIsBarChart] = useState(false);
  const [distributionParams, setDistributionParams] = useState<number[]>([]);
  const [displayRange, setDisplayRange] = useState<number[]>([-60, 60]);
  const [isRangeFixed, setIsRangeFixed] = useState(false);

  const distribution = DISTRIBUTIONS[distributionType];
  const prevDistributionTypeRef = useRef<DistributionType>(distributionType);
  const xAxisLabel = useMemo(
    () =>
      distribution.xAxisLabelKey
        ? t(distribution.xAxisLabelKey)
        : t('distribution.xAxis'),
    [distribution.xAxisLabelKey, t],
  );

  // 分布が変更されたときにパラメータをリセット
  useEffect(() => {
    // 分布が変更された場合は常にパラメータをリセット
    if (prevDistributionTypeRef.current !== distributionType) {
      prevDistributionTypeRef.current = distributionType;
      if (distribution.params) {
        setDistributionParams(distribution.params.map((p) => p.defaultValue));
      } else {
        setDistributionParams([]);
      }
    }
  }, [distributionType, distribution.params]);

  const currentParams = useMemo(() => {
    if (distribution.params) {
      if (distributionParams.length === distribution.params.length) {
        return distributionParams;
      }
      return distribution.params.map((p) => p.defaultValue);
    }
    return [];
  }, [distribution.params, distributionParams]);

  // probabilitiesが関数の場合は呼び出す
  const distributionProbabilities: DiscreteDistribution = useMemo(() => {
    if (typeof distribution.probabilities === 'function') {
      const result = distribution.probabilities(currentParams);
      if (isDiscreteDistribution(result)) {
        return result;
      }
      return {
        offset: 0,
        distribution: result,
      };
    }
    return {
      offset: 0,
      distribution: distribution.probabilities,
    };
  }, [distribution, currentParams]);

  // 基礎となるz変換を計算（1回畳み込み）
  const baseZTransform = useMemo(() => {
    // ignore the offset (because it make no difference in the amplitude of the z transform)
    return computeZTransform(distributionProbabilities.distribution);
  }, [distributionProbabilities]);

  // ステップ関数の振幅特性を事前計算（angularFrequencyは固定間隔なので一度だけ計算）
  const stepAmplitudes = useMemo(() => {
    return baseZTransform.map((point) =>
      computeStepFunctionAmplitude(point.angularFrequency),
    );
  }, [baseZTransform]);

  const amplitudeDataArray = useMemo(() => {
    // 数学的性質を利用: n回の畳み込みのz変換は、元のz変換のn乗
    // |Z[f * f * ... * f]| = |Z[f]^n| = |Z[f]|^n
    // したがって、1回のz変換を計算し、その振幅をべき乗することで
    // 畳み込みを計算せずにn回畳み込みの振幅特性を求められる
    const result = [];
    for (let i = 1; i <= convolutionCount; i++) {
      result.push(
        baseZTransform.map((point) => ({
          angularFrequency: point.angularFrequency,
          amplitude: Math.pow(point.amplitude, i),
        })),
      );
    }
    return result;
  }, [baseZTransform, convolutionCount]);

  const cdfAmplitudeDataArray = useMemo(() => {
    // 確率分布のz変換結果に事前計算されたステップ関数の振幅特性を掛ける
    return amplitudeDataArray.map((amplitudeData) =>
      computeCDFAmplitudeFromDistribution(amplitudeData, stepAmplitudes),
    );
  }, [amplitudeDataArray, stepAmplitudes]);

  const distributionLabels = useMemo(() => {
    return Array.from({ length: convolutionCount }, (_, i) => {
      const count = i + 1;
      return `${count}x`;
    });
  }, [convolutionCount, distributionType, t]);

  const distributionsForChart = useMemo(() => {
    const result: DiscreteDistribution[] = [];
    if (convolutionCount >= 1) {
      // 1回畳み込みは元の分布そのもの
      let currentDistribution = cloneDiscreteDistribution(
        distributionProbabilities,
      );
      result.push(currentDistribution);

      // n回畳み込みの結果に元の分布を1回畳み込むことで、n+1回畳み込みを計算
      for (let i = 2; i <= convolutionCount; i++) {
        currentDistribution = convolve(
          currentDistribution,
          distributionProbabilities,
        );
        result.push(currentDistribution);
      }
    }
    return result;
  }, [distributionProbabilities, convolutionCount]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <title>{t('app.title')}</title>
      <Container
        maxWidth={false}
        sx={{
          py: 4,
          maxWidth: 1920,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            sx={{ flex: 1 }}
          >
            {t('app.title')}
          </Typography>
          <Paper sx={{ p: 1, minWidth: { xs: '100%', sm: 200 } }}>
            <LanguageSelector />
          </Paper>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: 3,
            }}
          >
            <Paper sx={{ p: 2, flex: 1 }}>
              <ProbabilityDistributionChart
                distributions={distributionsForChart}
                labels={distributionLabels}
                xAxisLabel={xAxisLabel}
                chartType={isBarChart ? 'bar' : 'line'}
                displayRangeMin={displayRange[0]}
                displayRangeMax={displayRange[1]}
                isRangeFixed={isRangeFixed}
              />
            </Paper>
            <Paper sx={{ p: 2, flex: 1 }}>
              <AmplitudeChart
                amplitudeDataArray={amplitudeDataArray}
                labels={distributionLabels}
                isDb={isDb}
              />
            </Paper>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: 3,
            }}
          >
            <Paper sx={{ p: 2, flex: 1 }}>
              <CumulativeDistributionChart
                distributions={distributionsForChart}
                labels={distributionLabels}
                xAxisLabel={xAxisLabel}
                displayRangeMin={displayRange[0]}
                displayRangeMax={displayRange[1]}
                isRangeFixed={isRangeFixed}
              />
            </Paper>
            <Paper sx={{ p: 2, flex: 1 }}>
              <CumulativeAmplitudeChart
                amplitudeDataArray={cdfAmplitudeDataArray}
                labels={distributionLabels}
                isDb={isDb}
              />
            </Paper>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Paper sx={{ p: 2, flex: 1 }}>
            <DistributionSelector
              value={distributionType}
              onChange={setDistributionType}
            />
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <ConvolutionControls
              value={convolutionCount}
              onChange={setConvolutionCount}
              min={1}
              max={10}
            />
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Switch
                checked={isBarChart}
                onChange={(_, checked) => setIsBarChart(checked)}
                slotProps={{
                  input: { 'aria-label': t('distribution.barChartSwitch') },
                }}
              />
              <Typography variant="body1">
                {t('distribution.barChartSwitch')}
              </Typography>
            </Box>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Switch
                checked={isDb}
                onChange={(_, checked) => setIsDb(checked)}
                slotProps={{ input: { 'aria-label': t('amplitude.dbSwitch') } }}
              />
              <Typography variant="body1">{t('amplitude.dbSwitch')}</Typography>
            </Box>
            <Box sx={{ mt: 3, width: '100%' }}>
              <Typography gutterBottom>
                {t('distribution.maxDisplayRange')}: [{displayRange[0]}, {displayRange[1]}]
              </Typography>
              <Slider
                value={displayRange}
                onChange={(_, newValue) => setDisplayRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={-200}
                max={200}
                step={10}
                disableSwap
              />
            </Box>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Switch
                checked={isRangeFixed}
                onChange={(_, checked) => setIsRangeFixed(checked)}
                slotProps={{
                  input: { 'aria-label': t('distribution.fixDisplayRange') },
                }}
              />
              <Typography variant="body1">
                {t('distribution.fixDisplayRange')}
              </Typography>
            </Box>
          </Paper>
          {distribution.params && distribution.params.length > 0 && (
            <Paper sx={{ p: 2, flex: 1 }}>
              <DistributionParamsControls
                params={distribution.params}
                values={currentParams}
                onChange={setDistributionParams}
              />
            </Paper>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
