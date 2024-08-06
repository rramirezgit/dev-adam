'use client';

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Iconify } from '../iconify';
import { usePathname } from 'next/navigation';
import { RootState } from 'src/store';
import { useDispatch, useSelector } from 'react-redux';
import useEqualNewsletter from 'src/sections/create-newsletter/useEquealNewsletter';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';
import {
  setErrors as setErrorsNewsletter,
  setShowEditor as setShowEditorNewsletter,
  setMenu as setMenuNewsletter,
  setcurrentNewsletter as setCurrentNewsletterNewsletter,
  setcurrentNewsletterID as setCurrentNewsletterIdNewsletter,
} from 'src/store/slices/newsletterStore';
import {
  setErrors,
  setShowEditor,
  setMenu,
  setcurrentNota,
  setcurrentNotaID,
  setcurrentNotaDescription,
  setShowSaved,
} from 'src/store/slices/noteStore';
import { LoadingButton } from '@mui/lab';

const ButtonBackEditors = () => {
  const pathname = usePathname();

  const NotaList = useSelector((state: RootState) => state.note.noteList);
  const currentNota = useSelector((state: RootState) => state.note.currentNota);
  const currentNotaId = useSelector((state: RootState) => state.note.currentNotaId);

  const NotaSaved = NotaList.find((news: any) => news.id === currentNotaId);

  const [loading, setLoading] = useState(false);

  const Theme = useTheme();

  const newsletterList = useSelector((state: RootState) => state.newsletter.newsletterList);
  const currentNewsletter = useSelector((state: RootState) => state.newsletter.currentNewsletter);
  const currentNewsletterId = useSelector(
    (state: RootState) => state.newsletter.currentNewsletterId
  );

  const { deepEqual } = useEqualNewsletter();

  const showPopup = useBoolean();

  const router = useRouter();

  const dispatch = useDispatch();

  const newsletterSaveed = newsletterList.find((news) => news.id === currentNewsletterId);

  const cleanStateNote = () => {
    dispatch(setErrors([]));
    dispatch(setMenu({ type: 'none' }));
    dispatch(setShowEditor(false));
    dispatch(setcurrentNotaID(''));
    dispatch(setcurrentNota(null));
    dispatch(setcurrentNotaDescription(''));
  };

  const cleanStateNewsletter = () => {
    dispatch(setErrorsNewsletter([]));
    dispatch(setShowEditorNewsletter(false));
    dispatch(setMenuNewsletter({ type: 'none' }));
    dispatch(setCurrentNewsletterNewsletter(null));
    dispatch(setCurrentNewsletterIdNewsletter(''));
  };

  const backNewsletterList = () => {
    if (pathname?.includes('create-newsletter')) {
      if (newsletterSaveed) {
        const objDataExist = JSON.parse(newsletterSaveed.objData);
        const objDataCurrent = currentNewsletter;
        const newsleterEsqual = deepEqual(objDataExist, objDataCurrent);
        if (!newsleterEsqual) {
          showPopup.onTrue();
        } else {
          cleanStateNewsletter();
          router.push(pathname);
        }
      } else {
        showPopup.onTrue();
      }
    } else if (pathname?.includes('create-note')) {
      if (NotaSaved) {
        const objDataExist = JSON.parse(NotaSaved.objData);
        const objDataCurrent = currentNota;
        const notaEqual = deepEqual(objDataExist, objDataCurrent);

        if (!notaEqual) {
          showPopup.onTrue();
        } else {
          cleanStateNote();
          router.push(pathname);
        }
      } else {
        showPopup.onTrue();
      }
    }
  };

  const DialogosaveDraf = (
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
            Tienes cambios sin guardar ¿Deseas salir sin guardar?
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <LoadingButton
              variant="outlined"
              color="primary"
              loading={loading}
              onClick={() => {
                showPopup.onFalse();
                if (pathname?.includes('create-newsletter')) {
                  cleanStateNewsletter();
                  router.push(pathname);
                } else if (pathname?.includes('create-note')) {
                  cleanStateNote();
                  router.push(pathname);
                }
              }}
              sx={{
                width: '180px',
              }}
            >
              Salir sin guardar
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="primary"
              loading={loading}
              onClick={() => {
                showPopup.onFalse();
                dispatch(setShowSaved(true));
              }}
              sx={{
                width: '180px',
              }}
            >
              Cancelar
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogTitle>
    </Dialog>
  );

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <IconButton
        onClick={() => {
          backNewsletterList();
        }}
        style={{ marginRight: 5 }}
      >
        <Iconify icon="eva:arrow-back-fill" width={24} height={24} color="black" />
      </IconButton>
      <Typography variant="h5">Volver</Typography>
      {DialogosaveDraf}
    </Box>
  );
};

export default ButtonBackEditors;
