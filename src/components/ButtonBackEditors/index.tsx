'use client';

import type { RootState } from 'src/store';

import React from 'react';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';

import { Box, IconButton, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import useCleanStateNote from 'src/store/cleanStore/note';
import useCleanStateNewsletter from 'src/store/cleanStore/newsletter';

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

  const { showPopup, DialogosaveNota } = useSaveDialogNota();

  const { showPopupNewsletterSave, DialogSaveNewsletter } = useSendNewsletter();

  const cleanStateNote = useCleanStateNote();
  const cleanStateNewsletter = useCleanStateNewsletter();

  const newsletterSaveed = newsletterList.find((news) => news.id === currentNewsletterId);

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
