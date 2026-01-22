import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
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
    <>
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
          <MenuItem value="diceLoaded">{t('distribution.diceLoaded')}</MenuItem>
          <MenuItem value="uniform">{t('distribution.uniform')}</MenuItem>
          <MenuItem value="bernoulli">{t('distribution.bernoulli')}</MenuItem>
          <MenuItem value="poisson">{t('distribution.poisson')}</MenuItem>
          <MenuItem value="binomial">{t('distribution.binomial')}</MenuItem>
          <MenuItem value="degenerate">{t('distribution.degenerate')}</MenuItem>
          <MenuItem value="lattice">{t('distribution.lattice')}</MenuItem>
          <MenuItem value="differential">
            {t('distribution.differential')}
          </MenuItem>
          <MenuItem value="differentialCentral">
            {t('distribution.differentialCentral')}
          </MenuItem>
          <MenuItem value="iir">{t('distribution.iir')}</MenuItem>
          <MenuItem value="fir">{t('distribution.fir')}</MenuItem>
          <MenuItem value="customFir">{t('distribution.customFir')}</MenuItem>
        </Select>
      </FormControl>
      {value === 'coin' && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('distribution.coinDescription')}
        </Typography>
      )}
      {value === 'dice' && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('distribution.diceDescription')}
        </Typography>
      )}
      {value === 'diceLoaded' && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('distribution.diceLoadedDescription')}
        </Typography>
      )}
      {value === 'degenerate' && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('distribution.degenerateDescription')}
        </Typography>
      )}
      {value === 'lattice' && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('distribution.latticeDescription')}
        </Typography>
      )}
      {value === 'fir' && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('distribution.firDescription')}
        </Typography>
      )}
      {value === 'customFir' && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('distribution.customFirDescription')}
        </Typography>
      )}
      {value === 'iir' && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('distribution.iirDescription')}
        </Typography>
      )}
      {value === 'differential' && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('distribution.differentialDescription')}
        </Typography>
      )}
      {value === 'differentialCentral' && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('distribution.differentialCentralDescription')}
        </Typography>
      )}
    </>
  );
}
