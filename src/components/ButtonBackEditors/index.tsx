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
import useSaveDialogNota from 'src/sections/create-note/dialog-save';
import useSendNewsletter from 'src/sections/create-newsletter/header-editing';

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

  const router = useRouter();

  const dispatch = useDispatch();

  const { showPopup, DialogosaveNota } = useSaveDialogNota();

  const { showPopupNewsletterSave, DialogSaveNewsletter } = useSendNewsletter();

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
          showPopupNewsletterSave.onTrue();
        } else {
          cleanStateNewsletter();
          router.push('/dashboard/create-newsletter');
        }
      } else {
        showPopupNewsletterSave.onTrue();
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
          router.push('/dashboard/create-note');
        }
      } else {
        showPopup.onTrue();
      }
    }
  };

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

      {DialogSaveNewsletter({ exitEditor: true })}
      {DialogosaveNota({ exitEditor: true })}
    </Box>
  );
};

export default ButtonBackEditors;
