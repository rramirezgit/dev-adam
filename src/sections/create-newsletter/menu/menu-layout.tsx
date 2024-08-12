import type { RootState } from 'src/store';
/* eslint-disable prefer-arrow-callback */
import type { TransitionProps } from '@mui/material/transitions';

import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, forwardRef } from 'react';

import {
  Box,
  Slide,
  Stack,
  Dialog,
  Button,
  useTheme,
  IconButton,
  Typography,
  DialogTitle,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import {
  setMenu,
  setImagesSaved,
  setDataImageCrop,
  setDataImageCroped,
  updateValueInputNewsletter,
} from 'src/store/slices/newsletterStore';

import { Iconify } from 'src/components/iconify';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IMenuLayout {
  children: React.ReactNode;
  title: string;
}

export default function MenuLayout({ children, title }: IMenuLayout) {
  const [opacityMenu, setopacityMenu] = useState(0);
  const [displayMenu, setdisplayMenu] = useState('none');
  const [position, setPosition] = useState('absolute');

  const showPopup = useBoolean();

  const [open, setOpenDrawer] = useState(false);
  const menu = useSelector((state: RootState) => state.newsletter.menuData.type);
  const imageSaved = useSelector((state: RootState) => state.newsletter.imageSaved);
  const menuData = useSelector((state: RootState) => state.newsletter.menuData);

  const dispatch = useDispatch();

  const mdUp = useResponsive('up', 'md');

  const drawerWidth = mdUp ? 454 : '100%';
  const drawerHeight = mdUp ? `calc(100vh - ${40 * 2.6}px)` : '100vh';

  useEffect(() => {
    if (menu === 'none') {
      setopacityMenu(0);
      setdisplayMenu('none');
      setOpenDrawer(false);
      setTimeout(() => {
        setPosition('absolute');
      }, 200);
    } else {
      setOpenDrawer(true);
      setPosition('initial');
      setTimeout(() => {
        setopacityMenu(1);
        setdisplayMenu('sticky');
      }, 200);
    }
  }, [menu]);

  const Theme = useTheme();

  const renderBody = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        gap: Theme.spacing(5),
        height: drawerHeight,
        padding: open ? Theme.spacing(2) : 0,
        alignItems: 'center',
        borderRadius: Theme.spacing(1),
        transition: Theme.transitions.create('all', {
          easing: Theme.transitions.easing.easeInOut,
          duration: Theme.transitions.duration.standard,
        }),
        width: open ? drawerWidth : 0,
        backgroundColor: Theme.palette.background.neutral,
        top: '10px',
        position: 'sticky',
      }}
    >
      <Box
        sx={{
          display: open ? 'flex' : 'none',
          opacity: opacityMenu,
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box>
          <Typography fontSize={20}>{title}</Typography>
        </Box>
        <Box>
          <IconButton
            sx={{
              width: 'fit-content',
              height: 'fit-content',
              padding: 0,
              margin: 0,
            }}
            onClick={() => {
              if (imageSaved) {
                dispatch(setMenu({ type: 'none' }));
              } else {
                showPopup.onTrue();
              }
            }}
          >
            <Iconify
              icon="material-symbols:cancel-outline-rounded"
              sx={{
                cursor: 'pointer',
              }}
            />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: displayMenu,
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );

  return (
    <>
      {mdUp ? (
        <>{renderBody}</>
      ) : (
        <Dialog
          fullScreen
          TransitionComponent={Transition}
          open={open}
          onClose={() => dispatch(setMenu({ type: 'none' }))}
          sx={{
            '& .MuiDialog-paper': {
              boxShadow: 'none',
            },
          }}
        >
          {renderBody}
        </Dialog>
      )}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={showPopup.value}
        onClose={showPopup.onFalse}
        transitionDuration={{
          enter: Theme.transitions.duration.shortest,
          exit: Theme.transitions.duration.shortest - 80,
        }}
      >
        <DialogTitle
          sx={{ minHeight: 76 }}
          style={{
            padding: Theme.spacing(5),
          }}
        >
          <Stack direction="column" justifyContent="space-between">
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                width: '100%',
                mb: Theme.spacing(5),
              }}
            >
              ¿Estás seguro que deseas descartar los cambios en la imagen?
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Button
                onClick={() => {
                  showPopup.onFalse();

                  const ids = {
                    templateId: menuData.templateId as string,
                    inputId: menuData.inputId as string,
                    parentId: menuData?.parentId as string,
                  };

                  dispatch(
                    updateValueInputNewsletter({
                      value: '',
                      ...ids,
                    })
                  );
                  dispatch(setMenu({ type: 'none' }));
                  dispatch(
                    setDataImageCrop({
                      imageData: '',
                      name: '',
                      type: '',
                    })
                  );

                  dispatch(
                    setDataImageCroped({
                      imageData: '',
                      name: '',
                      type: '',
                    })
                  );

                  dispatch(setImagesSaved(true));
                }}
                color="primary"
                variant="outlined"
                sx={{
                  '&.MuiButton-root': {
                    height: '48px',
                    padding: Theme.spacing(0, 7),
                    fontSize: { xs: '12px', md: '16px' },
                  },
                }}
              >
                Descartar
              </Button>
              <Button
                onClick={() => {
                  showPopup.onFalse();
                }}
                color="primary"
                variant="contained"
                sx={{
                  '&.MuiButton-root': {
                    height: '48px',
                    padding: Theme.spacing(0, 7),
                    fontSize: { xs: '12px', md: '16px' },
                  },
                }}
              >
                Cancelar
              </Button>
            </Stack>
          </Stack>
        </DialogTitle>
      </Dialog>
    </>
  );
}
