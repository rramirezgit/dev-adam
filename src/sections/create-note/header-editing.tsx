/* eslint-disable no-nested-ternary */
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import { renderToString } from 'react-dom/server';
import { usePopover } from 'src/components/custom-popover';
import Nota, {
  setCoverImageError,
  setErrors,
  setNeswletterList,
  setShowEditor,
  setcurrentNota,
  setcurrentNotaID,
} from 'src/store/slices/note';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { RootState, store } from 'src/store';
import { SmsSearch, SmsTracking } from 'iconsax-react';
import ThemeProvider from 'src/theme';
import { SettingsProvider } from 'src/components/settings';
import { useRouter } from 'src/routes/hooks';
import dayjs from 'dayjs';
import { useAxios } from 'src/auth/context/axios/axios-provider';
import { useBoolean } from 'src/hooks/use-boolean';
import SendDialog from './send-dialog';
import SendErrorDialog from './send-error-dialog';
import SendDialogAprob from './send-dialog-aprob';
import ScheduleDialog from './schedule-dialog';
import SendDialogSubs from './send-dialog-subs';
import { htmlWrap } from './htmlWrap';
import useEqualNota from './useEquealNota';
import NotaBody from './Nota-body';
import useNotes from './view/useNotes';

export default function SendNota() {
  const Theme = useTheme();

  const popover = usePopover();

  const router = useRouter();

  const axiosInstance = useAxios();

  const showPopup = useBoolean();

  const dispatch = useDispatch();

  const { deepEqual } = useEqualNota();

  const { loadNotes } = useNotes();

  const images = useSelector((state: RootState) => state.note.currentNotaImagesList);
  const NotaList = useSelector((state: RootState) => state.note.neswletterList);
  const currentNota = useSelector((state: RootState) => state.note.currentNota);
  const currentNotaId = useSelector((state: RootState) => state.note.currentNotaId);
  const coverImage = useSelector((state: RootState) => state.note.coverImage);
  const Subject = useSelector((state: RootState) => state.note.subject);

  const errors = useSelector((state: RootState) => state.note.errors);
  const emails = useSelector((state: RootState) => state.note.emails);

  const [open, setOpen] = useState(false);
  const [openAprob, setOpenAprob] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openSendSubs, setOpenSendSubs] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [loading, setLoading] = useState(false);
  const [NotaSaveed, setNotaSaved] = useState<any>();

  useEffect(() => {
    setNotaSaved(NotaList.find((news: any) => news.id === currentNotaId));
  }, []);

  const buildHtml = (option = '') => {
    const componenteComoString = renderToString(
      <SettingsProvider
        defaultSettings={{
          themeMode: 'light', // 'light' | 'dark'
          themeDirection: 'ltr', //  'rtl' | 'ltr'
          themeContrast: 'default', // 'default' | 'bold'
          themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
          themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
          themeStretch: false,
        }}
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
      /// buscar todas la <img src="data: ... " id=`img-${props.inputId}` /> y reemplazarlas por la url de la imagen subida a s3

      // Crear un nuevo DOMParser
      const parser = new DOMParser();

      // Parsear el string HTML a un documento DOM
      const doc = parser.parseFromString(componenteComoString, 'text/html');

      // Ahora puedes trabajar con el NodeList 'images'
      images.forEach((img: any) => {
        const imgElement = doc.getElementById(`img-${img.inputId}`);
        imgElement?.setAttribute('src', img.url);
      });
      // Serializar el documento DOM a HTML
      body = doc.documentElement.innerHTML;

      return htmlWrap({
        body,
        option,
        currentNotaId,
      });
    }

    return htmlWrap({
      body,
      option,
      currentNotaId,
    });
  };

  const validatenota = () => {
    const newErrors: any[] = [...errors];

    if (coverImage === '') {
      dispatch(setCoverImageError(true));
      setOpenError(true);
      return false;
    }

    const validateInputs = (obj: any, inputType: string, errorMessage?: string) => {
      obj.inputs.forEach((input: any) => {
        if (input.type === inputType && !input?.value?.length) {
          if (!newErrors.some((error) => error.inputId === input.inputId)) {
            newErrors.push({
              name: obj.name,
              inputId: input.inputId,
              templateId: obj.templateId,
              type: input.variant,
              message: errorMessage || `El input ${input.errorName} es obligatorio`,
            });
          }
        }
      });
    };

    const validTags = (obj: any) => {
      obj.inputs.forEach((input: any) => {
        if (input.type === 'tags' && !input?.tags?.length) {
          if (!newErrors.some((error) => error.inputId === input.inputId)) {
            newErrors.push({
              name: obj.name,
              inputId: input.inputId,
              templateId: obj.templateId,
              type: input.variant,
              message: `Debe cargar al menos una Tag`,
            });
          }
        } else if (input.type === 'tags' && input?.tags?.length) {
          // si alguna tag no tiene valor mostrar error
          input.tags.forEach((tag: any, i: number) => {
            if (!tag.value || tag.value === '<p><br></p>') {
              if (!newErrors.some((error) => error.inputId === input.inputId)) {
                newErrors.push({
                  name: obj.name,
                  inputId: tag.inputId,
                  templateId: obj.templateId,
                  type: input.variant,
                  message: `El Tag ${i + 1} no tiene valor`,
                });
              }
            }
          });
        }
      });
    };

    const validLayouts = (obj: any) => {
      obj.inputs.forEach((input: any) => {
        if (input.type === 'layout' && input?.inputs?.length) {
          input.inputs.forEach((input2: any) => {
            if (input2.type === 'image' && !input2?.ImageData?.name) {
              if (!newErrors.some((error) => error.inputId === input2.inputId)) {
                newErrors.push({
                  name: obj.name,
                  inputId: input2.inputId,
                  templateId: obj.templateId,
                  type: input2.variant,
                  message: `Debe cargar una imagen`,
                });
              }
            }
            if (input2.type === 'text' && !input2?.value?.length) {
              if (!newErrors.some((error) => error.inputId === input2.inputId)) {
                newErrors.push({
                  name: obj.name,
                  inputId: input2.inputId,
                  templateId: obj.templateId,
                  type: input2.variant,
                  message: `El input ${input2.errorName} es obligatorio`,
                });
              }
            }
          });
        }
      });
    };

    const validateImages = (obj: any) => {
      validateInputs(obj, 'image', 'Debe completar todas las imágenes');
    };

    const validateTexts = (obj: any) => {
      validateInputs(obj, 'text');
    };

    const validateTags = (obj: any) => {
      validTags(obj);
    };

    const validateLayouts = (obj: any) => {
      validLayouts(obj);
    };

    // Validar imágenes vacías
    currentNota.forEach(validateImages);

    // Validar textos vacíos
    currentNota.forEach(validateTexts);

    // Validar tags vacíos
    currentNota.forEach(validateTags);

    // Validar layouts
    currentNota.forEach(validateLayouts);

    // Validar Notas sin inputs
    const NotasWithoutInputs = currentNota.filter(
      (obj: any) => obj.inputs.length === 1 && obj.name === 'Blank'
    );

    NotasWithoutInputs.forEach((obj: any) => {
      obj.inputs.forEach((input: any) => {
        if (!newErrors.some((error) => error.inputId === input.inputId)) {
          newErrors.push({
            name: obj.name,
            inputId: input.inputId,
            templateId: obj.templateId,
            type: input.type,
            message: 'Debe cargar al menos un input',
          });
        }
      });
    });

    if (newErrors.length > 0) {
      dispatch(setErrors([...newErrors]));
      setOpenError(true);
      return false;
    }

    return true;
  };

  const handleClickSendButton = async (e: any) => {
    const postDataNota = {
      title: Subject,
      content: buildHtml(),
      objData: JSON.stringify(currentNota),
      coverImageUrl: coverImage,
    };

    if (NotaSaveed) {
      /// verifico si hay cambios comparando el  objData de NotaExist con el objData de currentNota
      const objDataExist = JSON.parse(NotaSaveed.objData);
      const objDataCurrent = currentNota;

      const newsleterEsqual = deepEqual(objDataExist, objDataCurrent);
      /// si es Nota.origin === 'AI' y no tiene Nota.content y no hay cambios guardo como Draf
      if (!newsleterEsqual || (NotaSaveed.origin === 'AI' && !NotaSaveed.content)) {
        /// si hay cambios guardo como draft
        if (NotaSaveed) {
          setSaving(true);
          await axiosInstance.patch(`/posts/${currentNotaId}`, postDataNota).then((res) => {
            if (res.status === 200 || res.status === 201) {
              dispatch(setcurrentNotaID(res.data.id));
              // dispatch(setNeswletterList([...NotaList, res.data]));
              setNotaSaved(res.data);
              setSaving(false);
              router.push('/dashboard/create_note');
            }
          });
        } else {
          setSaving(true);
          await axiosInstance.post('/posts', postDataNota).then((res) => {
            if (res.status === 200 || res.status === 201) {
              dispatch(setcurrentNotaID(res.data.id));
              setNotaSaved(res.data);
              setSaving(false);
              router.push('/dashboard/create_note');
            }
          });
        }
      }
    } else {
      setSaving(true);
      await axiosInstance.post('/posts', postDataNota).then((res) => {
        if (res.status === 200 || res.status === 201) {
          dispatch(setcurrentNotaID(res.data.id));
          // dispatch(setNeswletterList([...NotaList, res.data]));
          setNotaSaved(res.data);
          setSaving(false);
          router.push('/dashboard/create_note');
        }
      });
    }

    return true;
  };

  const handleClickSendADAC = async (e: any) => {
    await axiosInstance.patch(`posts/${currentNotaId}/published/adac`).then(() => {
      loadNotes({ tab: 4 });
    });
    return true;
  };

  const handleclickDeleteNota = () => {
    if (NotaSaveed) {
      axiosInstance.delete(`/posts/${currentNotaId}`).then((res) => {
        if (res.status === 200 || res.status === 201) {
          router.push('/dashboard/create_note');
          dispatch(setcurrentNotaID(''));
          dispatch(setErrors([]));
          dispatch(setShowEditor(false));
        }
      });
    } else {
      router.push('/dashboard/create_note');
      dispatch(setcurrentNotaID(''));
      dispatch(setErrors([]));
      dispatch(setShowEditor(false));
    }
  };

  const handleclickAcept = async () => {
    setLoading(true);
    const postDataNota = {
      title: Subject,
      content: buildHtml(),
      objData: JSON.stringify(currentNota),
    };

    if (NotaSaveed) {
      const objDataExist = JSON.parse(NotaSaveed.objData);
      const objDataCurrent = currentNota;

      const newsleterEsqual = deepEqual(objDataExist, objDataCurrent);

      if (!newsleterEsqual) {
        await axiosInstance.patch(`/posts/${currentNotaId}`, postDataNota).then((res) => {
          if (res.status === 200 || res.status === 201) {
            router.push('/dashboard/create_note');
            dispatch(setcurrentNotaID(''));
            setSaving(false);
            setNotaSaved(undefined);
            dispatch(setErrors([]));
            dispatch(setShowEditor(false));
            showPopup.onFalse();
          }
        });
      } else {
        await axiosInstance.post('/posts', postDataNota).then((res) => {
          if (res.status === 200 || res.status === 201) {
            router.push('/dashboard/create_note');
            dispatch(setcurrentNotaID(''));
            setSaving(false);
            setNotaSaved(undefined);
            dispatch(setErrors([]));
            dispatch(setShowEditor(false));
            showPopup.onFalse();
          }
        });
      }
    } else {
      await axiosInstance.post('/posts', postDataNota).then((res) => {
        if (res.status === 200 || res.status === 201) {
          router.push('/dashboard/create_note');
          dispatch(setcurrentNotaID(''));
          setSaving(false);
          setNotaSaved(undefined);
          dispatch(setErrors([]));
          dispatch(setShowEditor(false));
          showPopup.onFalse();
        }
      });
    }
  };

  type Ioptions = 'ADAC';

  const disableOption = (option: Ioptions) => {
    if (saving) {
      return true;
    }

    const newsletter = NotaList.find((item) => item.id === currentNotaId);

    if (option === 'ADAC') {
      if (newsletter) {
        if (
          newsletter.status === 'DRAFT' ||
          newsletter.status === 'REJECTED' ||
          newsletter.status === 'REVIEW'
        ) {
          return true;
        }
      }
    }

    return false;
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
              onClick={() => {
                router.push('/dashboard/create_note');
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
              onClick={handleclickAcept}
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

  return (
    <Box
      sx={{
        display: 'flex',
        width: 1,
        height: '100%',
      }}
    >
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
            if (NotaSaveed) {
              const objDataExist = JSON.parse(NotaSaveed.objData);
              const objDataCurrent = currentNota;

              const newsleterEsqual = deepEqual(objDataExist, objDataCurrent);
              if (!newsleterEsqual) {
                showPopup.onTrue();
              } else {
                loadNotes({ tab: 0 });
                dispatch(setErrors([]));
                dispatch(setShowEditor(false));
              }
            } else {
              showPopup.onTrue();
            }
          }}
          style={{ marginRight: 5 }}
        >
          <Iconify icon="eva:arrow-back-fill" width={24} height={24} color="black" />
        </IconButton>
        <Typography variant="h5">Crea tu Nota</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
        }}
      >
        <LoadingButton
          onClick={handleclickDeleteNota}
          loading={false}
          startIcon={<Iconify icon="material-symbols-light:delete" width={24} height={24} />}
          variant="soft"
          color="error"
          sx={{
            mb: Theme.spacing(2),
            height: '48px',
            padding: '0 20px',
          }}
        >
          Eliminar Nota
        </LoadingButton>
        <Button
          onClick={async (e) => {
            const isValid = validatenota();

            if (isValid) {
              popover.onOpen(e);
            }
          }}
          endIcon={
            <Iconify
              icon={
                saving
                  ? ''
                  : popover.open
                  ? 'eva:arrow-ios-upward-fill'
                  : 'eva:arrow-ios-downward-fill'
              }
              width={15}
              height={15}
            />
          }
          variant="contained"
          color="info"
          sx={{
            mb: Theme.spacing(2),
            height: '48px',
            padding: '0 20px',
          }}
        >
          {saving ? 'Guardando...' : 'Guardar como'}
        </Button>
      </Box>
      <CustomPopover open={popover.open} onClose={popover.onClose} hiddenArrow>
        <MenuItem onClick={() => setOpen(true)}>
          <ListItemText>Guardar Nota</ListItemText>
        </MenuItem>
        {/* <MenuItem disabled={disableOption('ADAC')} onClick={() => setOpenAprob(true)}>
          <ListItemText>Publicar nota en ADAC</ListItemText>
        </MenuItem> */}
        {/* <MenuItem disabled={disableOption('schedule')} onClick={() => setOpenSchedule(true)}>
          <Iconify icon="material-symbols:schedule-outline" width={24} height={24} />
          <ListItemText>Programar</ListItemText>
        </MenuItem>
        <MenuItem disabled={disableOption('Subscriptores')} onClick={() => setOpenSendSubs(true)}>
          <Iconify icon="fluent-mdl2:group" width={24} height={24} />
          <ListItemText>Enviar ahora</ListItemText>
        </MenuItem> */}
      </CustomPopover>
      <SendDialog
        open={open}
        setOpen={setOpen}
        handleclickSaved={async (e) => {
          handleClickSendButton(e).then((res) => {
            popover.onClose();
          });
        }}
        title="¿Deseas guardar la nota Actual?"
        titleSend="Guardar"
        successTitle="Nota guardada exitosamente"
      />

      {DialogosaveDraf}
    </Box>
  );
}
