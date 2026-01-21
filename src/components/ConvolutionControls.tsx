import { Box, Slider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ConvolutionControlsProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function ConvolutionControls({
  value,
  onChange,
  min = 1,
  max = 10,
}: ConvolutionControlsProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography gutterBottom>
        {t('distribution.convolutionCount')}: {value}
      </Typography>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number)}
        min={min}
        max={max}
        step={1}
        marks
        valueLabelDisplay="auto"
      />
    </Box>
  );
}
