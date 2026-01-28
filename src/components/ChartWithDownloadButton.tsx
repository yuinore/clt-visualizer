import type { ReactNode } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import { useTranslation } from 'react-i18next';

interface ChartWithDownloadButtonProps {
  children: ReactNode;
  onDownload: () => void;
}

export function ChartWithDownloadButton({
  children,
  onDownload,
}: ChartWithDownloadButtonProps) {
  const { t } = useTranslation();

  return (
    <CssVarsProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="sm" variant="outlined" onClick={onDownload}>
            {t('chart.download')}
          </Button>
        </Box>
        <AspectRatio
          variant="plain"
          ratio="8 / 4"
          sx={{
            width: '100%',
            minWidth: 0,
            // スマートフォンでは minHeight を優先
            '@media (max-width: 600px)': {
              height: 'auto',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              // スマートフォンでは flex で高さを確保
              '@media (max-width: 600px)': {
                flex: 1,
                minHeight: '300px',
              },
            }}
          >
            {children}
          </Box>
        </AspectRatio>
      </Box>
    </CssVarsProvider>
  );
}
