'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { useTheme, useColorScheme } from '@mui/material/styles';

import COLORS from 'src/theme/core/colors.json';
import { paper, varAlpha } from 'src/theme/styles';
import { defaultFont } from 'src/theme/core/typography';
import PRIMARY_COLOR from 'src/theme/with-settings/primary-color.json';

import { BaseOption } from './base-option';
import { NavOptions } from './nav-options';
import { FontOptions } from './font-options';
import { PresetsOptions } from './presets-options';
import { FullScreenButton } from './fullscreen-button';

import type { Theme, SxProps } from '@mui/material/styles';
import { defaultSettings, useSettingsContext } from '../settings';
import { Iconify } from '../iconify';
import { Scrollbar } from '../scrollbar';
import { RootState } from 'src/store';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenNewsDrawer } from 'src/store/slices/noteStore';
import StateBtn from '../StateBtn';
import { useAxios } from 'src/auth/axios/axios-provider';
import useNotes from 'src/utils/useNotes';

export type NewsDrawerProps = {
  sx?: SxProps<Theme>;
  hideFont?: boolean;
  hideCompact?: boolean;
  hidePresets?: boolean;
  hideNavColor?: boolean;
  hideContrast?: boolean;
  hideDirection?: boolean;
  hideNavLayout?: boolean;
  hideColorScheme?: boolean;
};

// ----------------------------------------------------------------------

export function NewsDrawer({
  sx,
  hideFont,
  hideCompact,
  hidePresets,
  hideNavColor,
  hideContrast,
  hideNavLayout,
  hideDirection,
  hideColorScheme,
}: NewsDrawerProps) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { mode, setMode } = useColorScheme();

  const { openNewsDrawer } = useSelector((state: RootState) => state.note);

  const newsletterList = useSelector((state: RootState) => state.note.noteList);
  const currentNotaId = useSelector((state: RootState) => state.note.currentNotaId);

  const nota = newsletterList.find((item) => item.id === currentNotaId);

  const { loadNotes } = useNotes();

  const axiosInstance = useAxios();

  const distpach = useDispatch();

  const renderHead = (
    <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Opciones de Nota
      </Typography>

      <FullScreenButton />

      <Tooltip title="Close">
        <IconButton onClick={() => distpach(setOpenNewsDrawer(false))}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const renderNav = <NavOptions />;

  const changeStatusNote = async (status: string) => {
    await axiosInstance.patch(`posts/${currentNotaId}/status/${status}`);

    const tabMapping: Record<string, number> = {
      REVIEW: 1,
      APPROVED: 2,
      PUBLISHED: 3,
      ADAC: 4,
    };
    loadNotes({ tab: tabMapping[status] || 0 });
  };

  return (
    <Drawer
      anchor="right"
      open={openNewsDrawer}
      onClose={() => distpach(setOpenNewsDrawer(false))}
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
          <StateBtn Nota={nota} onChange={changeStatusNote} />

          {renderNav}
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}
