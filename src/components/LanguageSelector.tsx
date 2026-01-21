import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/config';

export function LanguageSelector() {
  const { t, i18n: i18nInstance } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18nInstance.changeLanguage(lang);
  };

  const currentLanguage =
    i18nInstance.resolvedLanguage || i18nInstance.language;
  const normalizedLanguage = currentLanguage?.startsWith('ja')
    ? 'ja'
    : currentLanguage?.startsWith('en')
      ? 'en'
      : 'en';

  return (
    <FormControl fullWidth>
      <InputLabel id="language-select-label">{t('language.select')}</InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={normalizedLanguage}
        label={t('language.select')}
        onChange={(e) => handleLanguageChange(e.target.value)}
      >
        <MenuItem value="ja">{t('language.japanese')}</MenuItem>
        <MenuItem value="en">{t('language.english')}</MenuItem>
      </Select>
    </FormControl>
  );
}
