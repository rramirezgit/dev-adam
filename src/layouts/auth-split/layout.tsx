'use client';

import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import Alert from '@mui/material/Alert';

import { useBoolean } from 'src/hooks/use-boolean';

import { Section } from './section';
import { Main, Content } from './main';
import { HeaderBase } from '../core/header-base';
import { LayoutSection } from '../core/layout-section';
import { Box, Card, keyframes } from '@mui/material';
import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

export type AuthSplitLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  section?: {
    title?: string;
    imgUrl?: string;
    subtitle?: string;
  };
};

const spiner = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export function AuthSplitLayout({ sx, section, children }: AuthSplitLayoutProps) {
  const mobileNavOpen = useBoolean();

  const layoutQuery: Breakpoint = 'md';

  return (
    <LayoutSection
      headerSection={
        /** **************************************
         * Header
         *************************************** */
        <HeaderBase
          disableElevation
          layoutQuery={layoutQuery}
          onOpenNav={mobileNavOpen.onTrue}
          slotsDisplay={{
            signIn: false,
            account: false,
            purchase: false,
            contacts: false,
            searchbar: false,
            workspaces: false,
            menuButton: false,
            localization: false,
            notifications: false,
            helpLink: false,
            settings: false,
            back: false,
          }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
          }}
          slotProps={{ container: { maxWidth: false } }}
          sx={{ position: { [layoutQuery]: 'fixed' } }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      sx={sx}
      cssVars={{
        '--layout-auth-content-width': '420px',
      }}
    >
      <Main layoutQuery={layoutQuery}>
        <Content layoutQuery={layoutQuery}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translate(-50%, -50%)',
              zIndex: -1,
              opacity: 0.2,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src="/logo/adac-logo.svg"
              alt="Logo"
              sx={{
                width: '80vmin', // Ajusta el tamaño según sea necesario
                height: '80vmin', // Ajusta el tamaño según sea necesario
                animation: `${spiner} 90s linear infinite`,
              }}
            />
          </Box>
          <Card
            elevation={5}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              padding: 3,
              width: '100%',
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(18.683377265930176px)',
            }}
          >
            {children}
          </Card>
        </Content>
      </Main>
    </LayoutSection>
  );
}
