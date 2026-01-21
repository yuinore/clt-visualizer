import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { DistributionType } from '../utils/probability';

interface DistributionSelectorProps {
  value: DistributionType;
  onChange: (value: DistributionType) => void;
}

export function DistributionSelector({
  value,
  onChange,
}: DistributionSelectorProps) {
  const { t } = useTranslation();

  return (
    <FormControl fullWidth>
      <InputLabel id="distribution-select-label">
        {t('distribution.select')}
      </InputLabel>
      <Select
        labelId="distribution-select-label"
        id="distribution-select"
        value={value}
        label={t('distribution.select')}
        onChange={(e) => onChange(e.target.value as DistributionType)}
      >
        <MenuItem value="coin">{t('distribution.coin')}</MenuItem>
        <MenuItem value="dice">{t('distribution.dice')}</MenuItem>
        <MenuItem value="fir">{t('distribution.fir')}</MenuItem>
        <MenuItem value="iir">{t('distribution.iir')}</MenuItem>
        <MenuItem value="uniform">{t('distribution.uniform')}</MenuItem>
      </Select>
    </FormControl>
  );
}
