'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';

import { paper, varAlpha } from 'src/theme/styles';
import { FullScreenButton } from './fullscreen-button';

import type { Theme, SxProps } from '@mui/material/styles';
import { Iconify } from '../iconify';
import { Scrollbar } from '../scrollbar';
import { RootState } from 'src/store';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenNewsletterDrawer } from 'src/store/slices/newsletterStore';
import useSendNewsletter from 'src/sections/create-newsletter/header-editing';
import { NewsletterDraweOptions } from './newsletter-nav-options';

export type NewsletterDrawerProps = {
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------

export function NewsletterDrawer({ sx }: NewsletterDrawerProps) {
  const theme = useTheme();

  const { SendButtonJSX, CustomPopoverJSX } = useSendNewsletter();

  const { openNewsletterDrawer } = useSelector((state: RootState) => state.newsletter);

  const distpach = useDispatch();

  const renderHead = (
    <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Opciones de Nota
      </Typography>

      <FullScreenButton />

      <Tooltip title="Close">
        <IconButton onClick={() => distpach(setOpenNewsletterDrawer(false))}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const renderNav = <NewsletterDraweOptions />;

  return (
    <Drawer
      anchor="right"
      open={openNewsletterDrawer}
      onClose={() => distpach(setOpenNewsletterDrawer(false))}
      slotProps={{ backdrop: { invisible: true } }}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          ...paper({
            theme,
            color: varAlpha(theme.vars.palette.background.defaultChannel, 0.9),
          }),
          width: 360,
          ...sx,
        },
      }}
    >
      {renderHead}

      <Scrollbar>
        <Stack spacing={6} sx={{ px: 2.5, pb: 5 }}>
          {SendButtonJSX()}
          {CustomPopoverJSX}

          {renderNav}
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}
