import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Box, Paper, Typography, Switch } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DistributionSelector } from './components/DistributionSelector';
import { ConvolutionControls } from './components/ConvolutionControls';
import { LanguageSelector } from './components/LanguageSelector';
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
    useState<DistributionType>('dice');
  const [convolutionCount, setConvolutionCount] = useState(6);
  const [isDb, setIsDb] = useState(false);

  const distribution = DISTRIBUTIONS[distributionType];

  const amplitudeDataArray = useMemo(() => {
    const result = [];
    for (let i = 1; i <= convolutionCount; i++) {
      const dist = convolveMultiple(distribution.probabilities, i);
      result.push(computeZTransform(dist));
    }
    return result;
  }, [distribution.probabilities, convolutionCount]);

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
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 3,
          }}
        >
          <Paper sx={{ p: 2, flex: 1 }}>
            <ProbabilityDistributionChart
              distributions={distributionsForChart}
              labels={distributionLabels}
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
          </Paper>
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
