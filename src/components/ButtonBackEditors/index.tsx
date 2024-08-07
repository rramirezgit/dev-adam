'use client';

import type { RootState } from 'src/store';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { Box, IconButton, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import {
  setMenu,
  setErrors,
  setShowEditor,
  setcurrentNota,
  setcurrentNotaID,
  setcurrentNotaDescription,
} from 'src/store/slices/noteStore';
import {
  setMenu as setMenuNewsletter,
  setErrors as setErrorsNewsletter,
  setShowEditor as setShowEditorNewsletter,
  setcurrentNewsletter as setCurrentNewsletterNewsletter,
  setcurrentNewsletterID as setCurrentNewsletterIdNewsletter,
} from 'src/store/slices/newsletterStore';

import useSaveDialogNota from 'src/sections/create-note/dialog-save';
import useSendNewsletter from 'src/sections/create-newsletter/header-editing';
import useEqualNewsletter from 'src/sections/create-newsletter/useEquealNewsletter';

import { Iconify } from '../iconify';

const ButtonBackEditors = () => {
  const pathname = usePathname();

  const NotaList = useSelector((state: RootState) => state.note.noteList);
  const currentNota = useSelector((state: RootState) => state.note.currentNota);
  const currentNotaId = useSelector((state: RootState) => state.note.currentNotaId);

  const NotaSaved = NotaList.find((news: any) => news.id === currentNotaId);

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
