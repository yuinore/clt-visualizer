import { Box, Slider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { DistributionParam } from '../distributions/base';

interface DistributionParamsControlsProps {
  params: DistributionParam[];
  values: number[];
  onChange: (values: number[]) => void;
}

export function DistributionParamsControls({
  params,
  values,
  onChange,
}: DistributionParamsControlsProps) {
  const { t } = useTranslation();

  const handleParamChange = (index: number, newValue: number) => {
    const newValues = [...values];
    newValues[index] = newValue;
    onChange(newValues);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {params.map((param, index) => (
        <Box key={param.name} sx={{ mb: 2 }}>
          <Typography gutterBottom>
            {t(`distribution.params.${param.name}`)}: {values[index]}
          </Typography>
          <Slider
            value={values[index]}
            onChange={(_, newValue) =>
              handleParamChange(index, newValue as number)
            }
            min={param.min}
            max={param.max}
            step={param.step}
            marks
            valueLabelDisplay="auto"
          />
        </Box>
      ))}
    </Box>
  );
}
