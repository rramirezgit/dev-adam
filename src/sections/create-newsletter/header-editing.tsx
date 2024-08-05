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
import { renderToString } from 'react-dom/server';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import newsletter, {
  setErrors,
  setNeswletterList,
  setShowEditor,
  setcurrentNewsletter,
  setcurrentNewsletterID,
} from 'src/store/slices/newsletterStore';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { SmsSearch, SmsTracking } from 'iconsax-react';
import { useRouter } from 'src/routes/hooks';
import dayjs from 'dayjs';
import { useBoolean } from 'src/hooks/use-boolean';
import NewsletterBody from './newsletter-body';
import SendDialog from './send-dialog';
import SendErrorDialog from './send-error-dialog';
import useEqualNewsletter from './useEquealNewsletter';
import SendDialogAprob from './send-dialog-aprob';
import ScheduleDialog from './schedule-dialog';
import SendDialogSubs from './send-dialog-subs';
import { htmlWrap } from './htmlWrap';
import { useAxios } from 'src/auth/axios/axios-provider';
import store, { RootState } from 'src/store';
import { ThemeProvider } from 'src/theme/theme-provider';
import { defaultSettings, SettingsProvider } from 'src/components/settings';
import { CONFIG } from 'src/config-global';
import { Iconify } from 'src/components/iconify';

export default function SendNewsletter() {
  const Theme = useTheme();

  const popover = usePopover();

  const router = useRouter();

  const axiosInstance = useAxios();

  const showPopup = useBoolean();

  const dispatch = useDispatch();

  const { deepEqual } = useEqualNewsletter();

  const images = useSelector((state: RootState) => state.newsletter.currentNewsletterImagesList);
  const newsletterList = useSelector((state: RootState) => state.newsletter.neswletterList);
  const currentNewsletter = useSelector((state: RootState) => state.newsletter.currentNewsletter);
  const currentNewsletterId = useSelector(
    (state: RootState) => state.newsletter.currentNewsletterId
  );
  const Subject = useSelector((state: RootState) => state.newsletter.subject);

  const newsletterSaveed = newsletterList.find((news) => news.id === currentNewsletterId);

  const errors = useSelector((state: RootState) => state.newsletter.errors);
  const emails = useSelector((state: RootState) => state.newsletter.emails);

  const [open, setOpen] = useState(false);
  const [openAprob, setOpenAprob] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openSendSubs, setOpenSendSubs] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [loading, setLoading] = useState(false);

  const buildHtml = async (option = '') => {
    const componenteComoString = renderToString(
      <SettingsProvider
        settings={defaultSettings}
        caches={CONFIG.isStaticExport ? 'localStorage' : 'cookie'}
      >
        <ThemeProvider>
          <Provider store={store}>
            <NewsletterBody isEmail />
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
        currentNewsletterId,
      });
    }

    return htmlWrap({
      body,
      option,
      currentNewsletterId,
    });
  };

  const sendEmailPost = async (option = '') => {
    const body = await buildHtml(option);

    const url =
      option === 'aprobar'
        ? `/newsletters/${currentNewsletterId}/request-approval`
        : option === 'subscriptores'
          ? `/newsletters/${currentNewsletterId}/send`
          : `/newsletters/${currentNewsletterId}/send-for-review`;

    const postData =
      option === 'aprobar'
        ? {
            subject: `${Subject}`,
            content: body,
            // objData: JSON.stringify(currentNewsletter),
            approverEmails: emails,
          }
        : option === 'subscriptores'
          ? {
              subject: `${Subject}`,
              content: body,
              // objData: JSON.stringify(currentNewsletter),
            }
          : {
              subject: Subject,
              content: body,
              // objData: JSON.stringify(currentNewsletter),
              reviewerEmails: emails,
            };

    await axiosInstance
      .post(url, postData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          const postDataNewsletter = {
            objData: JSON.stringify(currentNewsletter),
          };
          axiosInstance
            .patch(`/newsletters/${currentNewsletterId}`, postDataNewsletter)
            .then((res2) => {
              if (res2.status === 200 || res2.status === 201) {
                setOpen(false);
                setOpenAprob(false);
                setOpenSchedule(false);
                setOpenSendSubs(false);
                dispatch(setcurrentNewsletter([]));
                dispatch(setcurrentNewsletterID(''));
                dispatch(setErrors([]));
                dispatch(setShowEditor(false));
                router.push('/dashboard/create-newsletter');
              }
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setLoading(false);
    setOpenSendSubs(false);
  };

  const handleClickSendButton = async (e: any) => {
    const newErrors: any[] = [...errors];

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
    currentNewsletter.forEach(validateImages);

    // Validar textos vacíos
    currentNewsletter.forEach(validateTexts);

    // Validar tags vacíos
    currentNewsletter.forEach(validateTags);

    // Validar layouts
    currentNewsletter.forEach(validateLayouts);

    // Validar newsletters sin inputs
    const newslettersWithoutInputs = currentNewsletter.filter(
      (obj: any) => obj.inputs.length === 1 && obj.name === 'Blank'
    );

    newslettersWithoutInputs.forEach((obj: any) => {
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

    if (newErrors.length === 0) {
      /// busco es newsletterList si ya existe el currentNewsletterId

      const postDataNewsletterPost = {
        subject: Subject,
        content: await buildHtml(),
      };

      const postDataNewsletterPatch = {
        objData: JSON.stringify(currentNewsletter),
      };

      if (newsletterSaveed) {
        /// verifico si hay cambios comparando el  objData de newsletterExist con el objData de currentNewsletter
        const objDataExist = JSON.parse(newsletterSaveed.objData);
        const objDataCurrent = currentNewsletter;

        const newsleterEsqual = deepEqual(objDataExist, objDataCurrent);

        if (!newsleterEsqual) {
          /// si newsletterSaveed es true hacer un put y no un post

          /// si hay cambios guardo como draft
          if (newsletterSaveed) {
            setSaving(true);
            await axiosInstance
              .patch(`/newsletters/${currentNewsletterId}`, postDataNewsletterPatch)
              .then((res) => {
                if (res.status === 200 || res.status === 201) {
                  dispatch(setcurrentNewsletterID(res.data.id));
                  dispatch(setNeswletterList([...newsletterList, res.data]));
                  setSaving(false);
                }
              });
          } else {
            setSaving(true);
            await axiosInstance.post('/newsletters', postDataNewsletterPost).then((res) => {
              if (res.status === 200 || res.status === 201) {
                dispatch(setcurrentNewsletterID(res.data.id));
                dispatch(setNeswletterList([...newsletterList, res.data]));
                setSaving(false);
              }
            });
          }
        }
      } else {
        setSaving(true);
        await axiosInstance.post('/newsletters', postDataNewsletterPost).then((res) => {
          if (res.status === 200 || res.status === 201) {
            dispatch(setcurrentNewsletterID(res.data.id));
            dispatch(setNeswletterList([...newsletterList, res.data]));
            setSaving(false);
          }
        });
      }
    } else {
      dispatch(setErrors([...newErrors]));
      setOpenError(true);
    }

    return newErrors;
  };

  const handleClickSchedule = async ({ date }: any) => {
    setLoading(true);
    try {
      const data = {
        scheduleDate: date,
        subject: Subject,
        content: await buildHtml(),
        objData: JSON.stringify(currentNewsletter),
      };
      const res = await axiosInstance
        .post(`/newsletters/${currentNewsletterId}/schedule`, data)
        // eslint-disable-next-line consistent-return
        .then((response: any) => {
          if (response.status === 200 || response.status === 201) {
            return true;
          }
        })
        .catch((err) => {
          console.log(err);
          return false;
        });

      return res;
    } finally {
      setLoading(false);
    }
  };

  const handleclickDeleteNewsletter = () => {
    if (newsletterSaveed) {
      axiosInstance.delete(`/newsletters/${currentNewsletterId}`).then((res) => {
        if (res.status === 200 || res.status === 201) {
          router.push('/dashboard/create-newsletter');
          dispatch(setcurrentNewsletterID(''));
          dispatch(setErrors([]));
          dispatch(setShowEditor(false));
        }
      });
    } else {
      router.push('/dashboard/create-newsletter');
      dispatch(setcurrentNewsletterID(''));
      dispatch(setErrors([]));
      dispatch(setShowEditor(false));
    }
  };

  const callbackFunction = () => {
    router.push('/dashboard/create-newsletter');
    dispatch(setcurrentNewsletterID(''));
    setSaving(false);
    dispatch(setErrors([]));
    dispatch(setShowEditor(false));
    showPopup.onFalse();
  };

  const createNewNewsletter = async () => {
    const pathData = {
      objData: JSON.stringify(currentNewsletter),
    };

    const postData = {
      subject: Subject,
      content: await buildHtml(),
    };

    await axiosInstance.post('/newsletters', postData).then(async (res) => {
      if (res.status === 200 || res.status === 201) {
        await axiosInstance.patch(`/newsletters/${res.data.id}`, pathData).then((res) => {
          if (res.status === 200 || res.status === 201) {
            callbackFunction();
          }
        });
      }
    });
  };

  const handleclickAcept = async () => {
    setLoading(true);
    const postDataNewsletter = {
      subject: Subject,
      content: await buildHtml(),
      objData: JSON.stringify(currentNewsletter),
    };

    if (newsletterSaveed) {
      const objDataExist = JSON.parse(newsletterSaveed.objData);
      const objDataCurrent = currentNewsletter;

      const newsleterEsqual = deepEqual(objDataExist, objDataCurrent);

      if (!newsleterEsqual) {
        await axiosInstance
          .patch(`/newsletters/${currentNewsletterId}`, postDataNewsletter)
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              callbackFunction();
            }
          });

        return;
      }
    }
    await createNewNewsletter();
  };

  type Ioptions = 'Prueba' | 'Aprobacion' | 'Subscriptores' | 'schedule';

  const disableOption = (option: Ioptions) => {
    if (saving) {
      return true;
    }
    // verificar estado de la newsletter

    const nesletter = newsletterList.find((item) => item.id === currentNewsletterId);

    if (option === 'Aprobacion') {
      if (nesletter) {
        if (
          nesletter.status === 'APPROVED' ||
          nesletter.status === 'PENDING_APPROVAL' ||
          nesletter.status === 'SENDED'
        ) {
          return true;
        }
      }
    }

    if (option === 'Subscriptores' || option === 'schedule') {
      if (nesletter) {
        if (
          nesletter.status === 'DRAFT' ||
          nesletter.status === 'REJECTED' ||
          nesletter.status === 'SENDED' ||
          nesletter.status === 'PENDING_APPROVAL'
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
                router.push('/dashboard/create-newsletter');
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
        p: Theme.spacing(2, 0),
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
            if (newsletterSaveed) {
              const objDataExist = JSON.parse(newsletterSaveed.objData);
              const objDataCurrent = currentNewsletter;

              const newsleterEsqual = deepEqual(objDataExist, objDataCurrent);
              if (!newsleterEsqual) {
                showPopup.onTrue();
              } else {
                router.push('/dashboard/create-newsletter');
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
        <Typography variant="h5">Crea tu newsletter</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
        }}
      >
        <LoadingButton
          onClick={handleclickDeleteNewsletter}
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
          Eliminar Newsletter
        </LoadingButton>
        <Button
          onClick={async (e) => {
            handleClickSendButton(e).then((res) => {
              if (res.length === 0) {
                popover.onOpen(e);
              }
            });
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
          {saving ? 'Guardando...' : 'Enviar'}
        </Button>
      </Box>
      <CustomPopover open={popover.open} onClose={popover.onClose}>
        <MenuItem disabled={disableOption('Prueba')} onClick={() => setOpen(true)}>
          <SmsTracking size="24" />
          <ListItemText>Prueba</ListItemText>
        </MenuItem>
        <MenuItem disabled={disableOption('Aprobacion')} onClick={() => setOpenAprob(true)}>
          <SmsSearch size="24" />
          <ListItemText>Aprobacion</ListItemText>
        </MenuItem>
        <MenuItem disabled={disableOption('schedule')} onClick={() => setOpenSchedule(true)}>
          <Iconify icon="material-symbols:schedule-outline" width={24} height={24} />
          <ListItemText>Programar</ListItemText>
        </MenuItem>
        <MenuItem disabled={disableOption('Subscriptores')} onClick={() => setOpenSendSubs(true)}>
          <Iconify icon="fluent-mdl2:group" width={24} height={24} />
          <ListItemText>Enviar ahora</ListItemText>
        </MenuItem>
      </CustomPopover>
      <SendDialog
        open={open}
        setOpen={setOpen}
        handleclickRevision={async () => {
          popover.onClose();
          await sendEmailPost();
        }}
      />
      <SendDialogAprob
        open={openAprob}
        setOpen={setOpenAprob}
        handleclickRevision={async () => {
          popover.onClose();
          await sendEmailPost('aprobar');
        }}
      />
      <SendDialogSubs
        open={openSendSubs}
        setOpen={setOpenSendSubs}
        sendEmail={async () => {
          popover.onClose();
          await sendEmailPost('subscriptores');
        }}
      />
      <SendErrorDialog open={openError} setOpen={setOpenError} />
      <ScheduleDialog
        handleClickSchedule={handleClickSchedule}
        open={openSchedule}
        onClose={() => setOpenSchedule(false)}
        sendEmail={sendEmailPost}
      />
      {DialogosaveDraf}
    </Box>
  );
}
