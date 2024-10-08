'use client';

import type { RootState } from 'src/store';
import type { IconButtonProps } from '@mui/material/IconButton';

import { useSelector } from 'react-redux';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { varAlpha } from 'src/theme/styles';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnimateAvatar } from 'src/components/animate';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export type AccountDrawerProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountDrawer({ data = [], sx, ...other }: AccountDrawerProps) {
  const theme = useTheme();

  const router = useRouter();

  const pathname = usePathname();

  const { userAuth0 } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);

  const handleOpenDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleCloseDrawer();
      router.push(path);
    },
    [handleCloseDrawer, router]
  );

  console.log('userAuth0', userAuth0);

  const renderAvatar = (
    <AnimateAvatar
      width={96}
      slotProps={{
        avatar: { src: userAuth0?.picture, alt: userAuth0?.name },
        overlay: {
          border: 2,
          spacing: 3,
          color: `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.mainChannel, 0)} 25%, ${theme.vars.palette.primary.main} 100%)`,
        },
      }}
    >
      {userAuth0?.name?.charAt(0).toUpperCase()}
    </AnimateAvatar>
  );

  return (
    <>
      <AccountButton
        open={open}
        onClick={handleOpenDrawer}
        photoURL={userAuth0?.picture}
        displayName={userAuth0?.name}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={handleCloseDrawer}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        <IconButton
          onClick={handleCloseDrawer}
          sx={{ top: 12, left: 12, zIndex: 9, position: 'absolute' }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Stack alignItems="center" sx={{ pt: 8 }}>
            {renderAvatar}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {userAuth0?.name}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
              {userAuth0?.email}
            </Typography>
          </Stack>

          {userAuth0?.email === 'general@adac.mx' && (
            <Stack
              sx={{
                mt: 5,
                py: 3,
                px: 2.5,
                borderTop: `dashed 1px ${theme.vars.palette.divider}`,
                borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
              }}
            >
              {data.map((option) => {
                const rootLabel = pathname?.includes('/dashboard') ? 'Home' : 'Dashboard';

                const rootHref = pathname?.includes('/dashboard') ? '/' : paths.dashboard.root;

                return (
                  <MenuItem
                    key={option.label}
                    onClick={() =>
                      handleClickItem(option.label === 'Home' ? rootHref : option.href)
                    }
                    sx={{
                      py: 1,
                      color: 'text.secondary',
                      '& svg': { width: 24, height: 24 },
                      '&:hover': { color: 'text.primary' },
                    }}
                  >
                    {option.icon}

                    <Box component="span" sx={{ ml: 2 }}>
                      {option.label === 'Home' ? rootLabel : option.label}
                    </Box>

                    {option.info && (
                      <Label color="error" sx={{ ml: 1 }}>
                        {option.info}
                      </Label>
                    )}
                  </MenuItem>
                );
              })}
            </Stack>
          )}
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={handleCloseDrawer} />
        </Box>
      </Drawer>
    </>
  );
}
