import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Box, Paper, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DistributionSelector } from './components/DistributionSelector';
import { ConvolutionControls } from './components/ConvolutionControls';
import { ProbabilityDistributionChart } from './components/ProbabilityDistributionChart';
import { AmplitudeChart } from './components/AmplitudeChart';
import {
  DISTRIBUTIONS,
  convolveMultiple,
  type DistributionType,
} from './utils/probability';
import { computeZTransform } from './utils/zTransform';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const { t } = useTranslation();
  const [distributionType, setDistributionType] =
    useState<DistributionType>('coin');
  const [convolutionCount, setConvolutionCount] = useState(1);

  const distribution = DISTRIBUTIONS[distributionType];
  const convolvedDistribution = useMemo(() => {
    return convolveMultiple(distribution.probabilities, convolutionCount);
  }, [distribution.probabilities, convolutionCount]);

  const amplitudeData = useMemo(() => {
    return computeZTransform(convolvedDistribution);
  }, [convolvedDistribution]);

  const distributionLabels = useMemo(() => {
    return Array.from({ length: convolutionCount }, (_, i) => {
      const count = i + 1;
      return `${t(`distribution.${distributionType}`)} (${count}x)`;
    });
  }, [convolutionCount, distributionType, t]);

  const distributionsForChart = useMemo(() => {
    const result: number[][] = [];
    for (let i = 1; i <= convolutionCount; i++) {
      result.push(convolveMultiple(distribution.probabilities, i));
    }
    return result;
  }, [distribution.probabilities, convolutionCount]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('app.title')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mt: 3,
          }}
        >
          <Box
            sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Paper sx={{ p: 2 }}>
              <DistributionSelector
                value={distributionType}
                onChange={setDistributionType}
              />
            </Paper>
            <Paper sx={{ p: 2 }}>
              <ConvolutionControls
                value={convolutionCount}
                onChange={setConvolutionCount}
                min={1}
                max={10}
              />
            </Paper>
            <Paper sx={{ p: 2, flex: 1, minHeight: 500 }}>
              <Box sx={{ height: '100%', minHeight: 450 }}>
                <ProbabilityDistributionChart
                  distributions={distributionsForChart}
                  labels={distributionLabels}
                />
              </Box>
            </Paper>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 2, minHeight: 500 }}>
              <Box sx={{ height: '100%', minHeight: 450 }}>
                <AmplitudeChart
                  amplitudeData={amplitudeData}
                  label={`${t(`distribution.${distributionType}`)} (${convolutionCount}x)`}
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
