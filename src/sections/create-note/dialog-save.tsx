import type { RootState, AppDispatch} from 'src/store';

import { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { Provider, useDispatch, useSelector } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import { Stack, Button, Dialog, useTheme, Typography, DialogTitle } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import useNotes from 'src/utils/useNotes';

import { store } from 'src/store';
import { CONFIG } from 'src/config-global';
import { ThemeProvider } from 'src/theme/theme-provider';
import {
  setErrors,
  createNote,
  updateNote,
  deleteNote,
  setShowEditor,
  setcurrentNotaID,
} from 'src/store/slices/noteStore';

import { usePopover } from 'src/components/custom-popover';
import { defaultSettings, SettingsProvider } from 'src/components/settings';

import NotaBody from './Nota-body';
import { htmlWrap } from './htmlWrap';

const useSaveDialogNota = () => {
  const Theme = useTheme();
  const popover = usePopover();
  const router = useRouter();
  const showPopup = useBoolean();
  const dispatch = useDispatch<AppDispatch>();

  const images = useSelector((state: RootState) => state.note.currentNotaImagesList);
  const NotaList = useSelector((state: RootState) => state.note.noteList);
  const currentNota = useSelector((state: RootState) => state.note.currentNota);
  const currentNotaId = useSelector((state: RootState) => state.note.currentNotaId);
  const Subject = useSelector((state: RootState) => state.note.subject);

  const { loadNotes } = useNotes();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [NotaSaved, setNotaSaved] = useState<any>();

  useEffect(() => {
    setNotaSaved(NotaList.find((news: any) => news.id === currentNotaId));
  }, [NotaList, currentNotaId]);

  const buildHtml = (option = '') => {
    const componenteComoString = renderToString(
      <SettingsProvider
        settings={defaultSettings}
        caches={CONFIG.isStaticExport ? 'localStorage' : 'cookie'}
      >
        <ThemeProvider>
          <Provider store={store}>
            <NotaBody isEmail />
          </Provider>
        </ThemeProvider>
      </SettingsProvider>
    );

    let body = componenteComoString;
    if (images.length > 0) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(componenteComoString, 'text/html');
      images.forEach((img: any) => {
        const imgElement = doc.getElementById(`img-${img.inputId}`);
        imgElement?.setAttribute('src', img.url);
      });
      body = doc.documentElement.innerHTML;
    }

    return htmlWrap({ body, option, currentNotaId });
  };

  const handleDeleteNota = async () => {
    if (NotaSaved) {
      const result = await dispatch(deleteNote(currentNotaId));
      if (result.meta.requestStatus === 'fulfilled') {
        router.push('/dashboard/create-note');
        dispatch(setcurrentNotaID(''));
        dispatch(setErrors([]));
        dispatch(setShowEditor(false));
      }
    } else {
      router.push('/dashboard/create-note');
      dispatch(setcurrentNotaID(''));
      dispatch(setErrors([]));
      dispatch(setShowEditor(false));
    }
  };

  const handleSaveNota = async (exitEditor: boolean) => {
    setLoading(true);
    const postDataNota = {
      title: Subject,
      content: buildHtml(),
      objData: JSON.stringify(currentNota),
    };
    let result = null;

    if (NotaSaved || (NotaSaved?.origin === 'AI' && !NotaSaved?.content)) {
      result = await dispatch(updateNote({ id: currentNotaId, updatedData: postDataNota }));
    } else {
      result = await dispatch(createNote(postDataNota));
    }

    if (result.meta.requestStatus === 'fulfilled' && exitEditor) {
      loadNotes({ tab: 0 });
    }

    setLoading(false);
    showPopup.onFalse();
  };

  const DialogosaveNota = ({ exitEditor }: { exitEditor: boolean }) => (
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
            ¿Deseas guardar los cambios de la nota?
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
                router.push('/dashboard/create-note');
                dispatch(setErrors([]));
                dispatch(setShowEditor(false));
                showPopup.onFalse();
              }}
              variant="outlined"
              color="primary"
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
            <LoadingButton
              variant="contained"
              color="primary"
              loading={loading}
              onClick={() => handleSaveNota(exitEditor)}
              sx={{
                width: '180px',
              }}
            >
              Guardar
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogTitle>
    </Dialog>
  );

  return {
    buildHtml,
    handleDeleteNota,
    handleSaveNota,
    DialogosaveNota,
    setOpen,
    open,
    popover,
    showPopup,
  };
};

export default useSaveDialogNota;
