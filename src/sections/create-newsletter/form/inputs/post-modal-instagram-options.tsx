import type { Theme} from '@mui/material';

import { useField } from 'formik';

import { Box, styled, useTheme, Typography } from '@mui/material';

import { useLocales } from 'src/locales';

type TexAreaContainerProps = {
  error: boolean | undefined | string;
  theme: Theme;
};

const TexAreaContainer = styled(Box)(({ error, theme }: TexAreaContainerProps) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  borderRadius: 8,
  border: `1px solid ${error ? theme.palette.error.main : theme.palette.info.main}`,
  '&:focus': {
    border: `1px solid ${theme.palette.info.main} !important`,
  },
}));

const TextArea = styled('textarea')(({ theme }) => ({
  width: '100%',
  height: 140,
  fontFamily: theme.typography.fontFamily,
  backgroundColor: theme.palette.background.paper,
  padding: 16,
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 400,
  border: `none`,
  color: theme.palette.text.primary,
  resize: 'none',
  '&:focus': {
    outline: 'none',
  },
}));
interface IPostTextArea {
  name: string;
}

export default function InstagramOptions({ name }: IPostTextArea) {
  const theme = useTheme();
  const { currentLang } = useLocales();
  const [field, , helpers] = useField(name);
  const { t } = useLocales();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    helpers.setValue(e.target.value);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        padding: {
          xs: '16px 16px',
          sm: '16px 24px',
        },
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '11px',
        backgroundColor: theme.palette.background.neutral,
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>
        {t('Dashboard.Create_Newsletter.Create.Modal.Instagram_Options')}
      </Typography>
      <TexAreaContainer error={false} theme={theme}>
        <TextArea
          lang={currentLang.label}
          value={field.value}
          onChange={handleChange}
          style={{ height: 103 }}
          placeholder={t('Dashboard.Create_Newsletter.Create.Modal.Options_Placeholder_Insta')}
        />
      </TexAreaContainer>
    </Box>
  );
}
