import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Box, Paper, Typography, Switch } from '@mui/material';
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
import { convolveMultiple, type DistributionType } from './utils/probability';
import { computeZTransform, computeCDFAmplitudeFromDistribution } from './utils/zTransform';

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
  const [distributionParams, setDistributionParams] = useState<number[]>([]);

  const distribution = DISTRIBUTIONS[distributionType];
  const prevDistributionTypeRef = useRef<DistributionType>(distributionType);
  const xAxisLabel = useMemo(
    () =>
      distribution.xAxisLabelKey
        ? t(distribution.xAxisLabelKey)
        : t('distribution.xAxis'),
    [distribution.xAxisLabelKey, t]
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
  const distributionProbabilities = useMemo(() => {
    if (typeof distribution.probabilities === 'function') {
      return distribution.probabilities(currentParams);
    }
    return distribution.probabilities;
  }, [distribution, currentParams]);

  const amplitudeDataArray = useMemo(() => {
    const result = [];
    for (let i = 1; i <= convolutionCount; i++) {
      const dist = convolveMultiple(distributionProbabilities, i);
      result.push(computeZTransform(dist));
    }
    return result;
  }, [distributionProbabilities, convolutionCount]);

  const cdfAmplitudeDataArray = useMemo(() => {
    // 確率分布のz変換結果を再利用して、ステップ関数の振幅特性を掛ける
    return amplitudeDataArray.map((amplitudeData) =>
      computeCDFAmplitudeFromDistribution(amplitudeData)
    );
  }, [amplitudeDataArray]);

  const distributionLabels = useMemo(() => {
    return Array.from({ length: convolutionCount }, (_, i) => {
      const count = i + 1;
      return `${count}x`;
    });
  }, [convolutionCount, distributionType, t]);

  const distributionsForChart = useMemo(() => {
    const result: number[][] = [];
    for (let i = 1; i <= convolutionCount; i++) {
      result.push(convolveMultiple(distributionProbabilities, i));
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
              convolutionCount={convolutionCount}
            />
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <ConvolutionControls
              value={convolutionCount}
              onChange={setConvolutionCount}
              min={1}
              max={10}
            />
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
          <Paper
            sx={{
              p: 2,
              flex: 1,
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
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
