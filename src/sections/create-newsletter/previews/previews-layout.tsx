import { Box } from '@mui/material';
import Logo from 'src/components/logo';
import PreviewContainer from './preview-container';

interface Props {
  children: React.ReactNode;
}

export default function PreviewaLayout({ children }: Props) {
  return (
    <Box
      sx={{
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          padding: '0 0 5% 0',
          alignSelf: 'end',
        }}
      >
        <Logo mini disabledLink />
      </Box>
      <PreviewContainer>{children}</PreviewContainer>
    </Box>
  );
}
