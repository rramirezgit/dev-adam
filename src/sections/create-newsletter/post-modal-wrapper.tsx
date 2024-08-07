/* eslint-disable prefer-arrow-callback */
import type { RootState } from 'src/store';
import type { TransitionProps } from '@mui/material/transitions';

import { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Slide,
  AppBar,
  Dialog,
  Toolbar,
  IconButton,
  Typography,
  DialogContent,
} from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { setOpenDrawer } from 'src/store/slices/post';

import { Iconify } from 'src/components/iconify';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface PostModalProps {
  children: React.ReactNode;
}

export default function PostModalWrepper({ children }: PostModalProps) {
  const dispatch = useDispatch();
  const mdUp = useResponsive('up', 'md');
  const { openDrawer: openModal, showCropSection } = useSelector((state: RootState) => state.post);

  const handleBack = () => {
    dispatch(setOpenDrawer(false));
  };

  return (
    <Box>
      <Dialog
        maxWidth="lg"
        fullWidth
        fullScreen={!mdUp}
        open={openModal}
        TransitionComponent={Transition}
        onClose={() => dispatch(setOpenDrawer(false))}
        aria-describedby="alert-dialog-slide-description"
      >
        {!mdUp ? (
          <>
            <AppBar position="relative" color="default">
              {!showCropSection && (
                <Toolbar>
                  <IconButton color="inherit" edge="start" onClick={handleBack}>
                    <Iconify icon="eva:close-outline" />
                  </IconButton>

                  <Typography variant="h6" sx={{ flex: 1 }}>
                    Cerrar
                  </Typography>
                </Toolbar>
              )}
            </AppBar>
            <DialogContent>{children}</DialogContent>
          </>
        ) : (
          <DialogContent>{children}</DialogContent>
        )}
      </Dialog>
    </Box>
  );
}
