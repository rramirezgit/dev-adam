/* eslint-disable prefer-arrow-callback */
import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Iconify } from 'src/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';
import { RootState } from 'src/store';
import { setOpenDrawer } from 'src/store/slices/post';

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
