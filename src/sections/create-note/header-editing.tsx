import { Button, Dialog, DialogTitle, Stack, Typography, useTheme } from '@mui/material';
import { renderToString } from 'react-dom/server';
import { usePopover } from 'src/components/custom-popover';
import {
  setErrors,
  setnoteList,
  setShowEditor,
  setcurrentNotaID,
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from 'src/store/slices/noteStore';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { AppDispatch, RootState, store } from 'src/store';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { htmlWrap } from './htmlWrap';
import NotaBody from './Nota-body';
import { ThemeProvider } from 'src/theme/theme-provider';
import { CONFIG } from 'src/config-global';
import { SettingsProvider, defaultSettings } from 'src/components/settings';

const useSendNota = () => {
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

  const handleSaveNota = async () => {
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

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(setcurrentNotaID(result.payload.id));
      dispatch(
        setnoteList([...NotaList.filter((item) => item.id !== currentNotaId), result.payload])
      );
    }

    setLoading(false);
    showPopup.onFalse();
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
            ¿Deseas guardar los cambios?
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
              onClick={showPopup.onFalse}
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
              onClick={handleSaveNota}
              sx={{
                width: '180px',
              }}
            >
              Aceptar
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
    DialogosaveDraf,
    setOpen,
    open,
    popover,
    showPopup,
  };
};

export default useSendNota;
