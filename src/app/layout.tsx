import 'src/global.css';
// editor
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

// ----------------------------------------------------------------------

import type { Viewport } from 'next';

import { LocalizationProvider } from 'src/utils/localization-provider';

import { CONFIG } from 'src/config-global';
import { primary } from 'src/theme/core/palette';
import { ReduxProvider } from 'src/store/Provider';
import { ThemeProvider } from 'src/theme/theme-provider';
import { getInitColorSchemeScript } from 'src/theme/color-scheme-script';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import AuthInitialize from 'src/components/AuthInitialize';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { detectSettings } from 'src/components/settings/server';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AxiosProvider } from 'src/auth/axios/axios-provider';

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const settings = CONFIG.isStaticExport ? defaultSettings : await detectSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {getInitColorSchemeScript}
        <ReduxProvider>
          <LocalizationProvider>
            <SettingsProvider
              settings={settings}
              caches={CONFIG.isStaticExport ? 'localStorage' : 'cookie'}
            >
              <ThemeProvider>
                <MotionLazy>
                  <Snackbar />
                  <ProgressBar />
                  <SettingsDrawer />
                  <AxiosProvider>
                    <AuthInitialize>{children}</AuthInitialize>
                  </AxiosProvider>
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </LocalizationProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
