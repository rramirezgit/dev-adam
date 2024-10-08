'use client';

import type { RootState } from 'src/store';

import { useState, useCallback } from 'react';
import { renderToString } from 'react-dom/server';
import { SmsSearch, SmsTracking } from 'iconsax-react';
import { Provider, useDispatch, useSelector } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Dialog,
  Button,
  useTheme,
  MenuItem,
  Typography,
  DialogTitle,
  ListItemText,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import store from 'src/store';
import { CONFIG } from 'src/config-global';
import { ThemeProvider } from 'src/theme/theme-provider';
import {
  setErrors,
  setShowEditor,
  setNeswletterList,
  setcurrentNewsletterID,
} from 'src/store/slices/newsletterStore';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { defaultSettings, SettingsProvider } from 'src/components/settings';

import { useAxios } from 'src/auth/axios/axios-provider';

import { htmlWrap } from './htmlWrap';
import SendDialog from './send-dialog';
import NewsletterBody from './newsletter-body';
import ScheduleDialog from './schedule-dialog';
import SendDialogSubs from './send-dialog-subs';
import SendErrorDialog from './send-error-dialog';
import SendDialogAprob from './send-dialog-aprob';
import useEqualNewsletter from './useEquealNewsletter';

const useSendNewsletter = () => {
  const Theme = useTheme();
  const popover = usePopover();
  const router = useRouter();
  const axiosInstance = useAxios();
  const showPopupNewsletterSave = useBoolean();
  const dispatch = useDispatch();
  const { deepEqual } = useEqualNewsletter();

  const images = useSelector((state: RootState) => state.newsletter.currentNewsletterImagesList);
  const newsletterList = useSelector((state: RootState) => state.newsletter.newsletterList);
  const currentNewsletter = useSelector((state: RootState) => state.newsletter.currentNewsletter);
  const currentNewsletterId = useSelector(
    (state: RootState) => state.newsletter.currentNewsletterId
  );
  const Subject = useSelector((state: RootState) => state.newsletter.subject);

  const newsletterSaveed = newsletterList.find((news) => news.id === currentNewsletterId);
  const errors = useSelector((state: RootState) => state.newsletter.errors);
  const emails = useSelector((state: RootState) => state.newsletter.emails);
  const emailsAprob = useSelector((state: RootState) => state.newsletter.emailsAprob);

  const [openPopover, setOpenPopove] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openAprob, setOpenAprob] = useState(false);
  const [openSendSubs, setOpenSendSubs] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [openSendDialog, setOpenSendDialog] = useState(false);

  const buildHtml = useCallback(
    async (option = '') => {
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
        const parser = new DOMParser();
        const doc = parser.parseFromString(componenteComoString, 'text/html');
        images.forEach((img: any) => {
          const imgElement = doc.getElementById(`img-${img.inputId}`);
          imgElement?.setAttribute('src', img.url);
        });
        body = doc.documentElement.innerHTML;
      }
      return htmlWrap({ body, option, currentNewsletterId });
    },
    [images, currentNewsletterId]
  );

  const sendEmailPost = useCallback(
    async (option = '') => {
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
              approverEmails: emailsAprob,
            }
          : option === 'subscriptores'
            ? {
                subject: `${Subject}`,
                content: body,
              }
            : {
                subject: Subject,
                content: body,
                reviewerEmails: emails,
              };
      await axiosInstance
        .post(url, postData)
        .then(async (res) => {
          if (res.status === 200 || res.status === 201) {
            const postDataNewsletter = {
              objData: JSON.stringify(currentNewsletter),
            };
            await axiosInstance
              .patch(`/newsletters/${currentNewsletterId}`, postDataNewsletter)
              .then((res2) => {
                if (res2.status === 200 || res2.status === 201) {
                  setOpenPopove(false);
                  setOpenAprob(false);
                  setOpenSchedule(false);
                  setOpenSendSubs(false);
                  dispatch(setErrors([]));
                }
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
      setOpenSendSubs(false);
    },
    [
      axiosInstance,
      buildHtml,
      currentNewsletter,
      currentNewsletterId,
      dispatch,
      emails,
      router,
      Subject,
    ]
  );

  const handleClickSendButton = useCallback(
    async (e: any) => {
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

      currentNewsletter.forEach(validateImages);
      currentNewsletter.forEach(validateTexts);
      currentNewsletter.forEach(validateTags);
      currentNewsletter.forEach(validateLayouts);

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
        const postDataNewsletterPost = {
          subject: Subject,
          content: await buildHtml(),
        };

        const postDataNewsletterPatch = {
          objData: JSON.stringify(currentNewsletter),
        };

        if (newsletterSaveed) {
          const objDataExist = JSON.parse(newsletterSaveed.objData);
          const objDataCurrent = currentNewsletter;

          const newsleterEsqual = deepEqual(objDataExist, objDataCurrent);

          if (!newsleterEsqual) {
            if (newsletterSaveed) {
              setSaving(true);
              await axiosInstance
                .patch(`/newsletters/${currentNewsletterId}`, postDataNewsletterPatch)
                .then(async (res) => {
                  if (res.status === 200 || res.status === 201) {
                    await axiosInstance
                      .patch(`/newsletters/${currentNewsletterId}`, postDataNewsletterPost)
                      .then(async (res2) => {
                        if (res2.status === 200 || res2.status === 201) {
                          dispatch(setcurrentNewsletterID(res.data.id));
                          dispatch(setNeswletterList([...newsletterList, res.data]));
                          setSaving(false);
                        }
                      });
                  }
                });
            } else {
              setSaving(true);
              await axiosInstance.post('/newsletters', postDataNewsletterPost).then(async (res) => {
                if (res.status === 200 || res.status === 201) {
                  await axiosInstance
                    .patch(`/newsletters/${res.data.id}`, postDataNewsletterPatch)
                    .then(async (res2) => {
                      if (res2.status === 200 || res2.status === 201) {
                        dispatch(setcurrentNewsletterID(res.data.id));
                        dispatch(setNeswletterList([...newsletterList, res.data]));
                        setSaving(false);
                      }
                    });
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
    },
    [
      axiosInstance,
      buildHtml,
      currentNewsletter,
      currentNewsletterId,
      deepEqual,
      dispatch,
      errors,
      newsletterList,
      newsletterSaveed,
      Subject,
    ]
  );

  const handleClickSchedule = useCallback(
    async ({ date }: any) => {
      setLoading(true);
      try {
        const data = {
          scheduleDate: date,
          subject: Subject,
          content: await buildHtml(),
        };
        const res = await axiosInstance
          .post(`/newsletters/${currentNewsletterId}/schedule`, data)
          .then((response: any) => {
            if (response.status === 200 || response.status === 201) {
              return true;
            }
            return false;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });

        return res;
      } finally {
        setLoading(false);
      }
    },
    [axiosInstance, buildHtml, currentNewsletter, currentNewsletterId, Subject]
  );

  const handleclickDeleteNewsletter = useCallback(() => {
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
  }, [axiosInstance, currentNewsletterId, dispatch, newsletterSaveed, router]);

  const callbackFunction = useCallback(
    ({ exitEditor }: { exitEditor: boolean }) => {
      setSaving(false);
      setLoading(false);
      dispatch(setErrors([]));
      showPopupNewsletterSave.onFalse();

      if (exitEditor) {
        router.push('/dashboard/create-newsletter');
        dispatch(setcurrentNewsletterID(''));
        dispatch(setShowEditor(false));
      }
    },
    [dispatch, router, showPopupNewsletterSave]
  );

  const createNewNewsletter = useCallback(
    async ({ exitEditor }: { exitEditor: boolean }) => {
      const pathData = {
        objData: JSON.stringify(currentNewsletter),
      };

      const postData = {
        subject: Subject,
        content: await buildHtml(),
      };

      await axiosInstance.post('/newsletters', postData).then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          await axiosInstance.patch(`/newsletters/${res.data.id}`, pathData).then((res1) => {
            if (res1.status === 200 || res1.status === 201) {
              dispatch(setcurrentNewsletterID(res.data.id));
              dispatch(setNeswletterList([...newsletterList, res1.data]));
              callbackFunction({ exitEditor });
            }
          });
        }
      });
    },
    [axiosInstance, buildHtml, callbackFunction, currentNewsletter, Subject]
  );

  const handleclickAcept = useCallback(
    async ({ exitEditor }: { exitEditor: boolean }) => {
      setLoading(true);
      const postDataNewsletterContent = {
        subject: Subject,
        content: await buildHtml(),
      };

      const postDataNewsletterObjData = {
        objData: JSON.stringify(currentNewsletter),
      };

      if (newsletterSaveed) {
        const objDataExist = JSON.parse(newsletterSaveed.objData);
        const objDataCurrent = currentNewsletter;

        const newsleterEsqual = deepEqual(objDataExist, objDataCurrent);
        if (!newsleterEsqual) {
          await axiosInstance
            .patch(`/newsletters/${currentNewsletterId}`, postDataNewsletterContent)
            .then(async (res1) => {
              if (res1.status === 200 || res1.status === 201) {
                await axiosInstance
                  .patch(`/newsletters/${currentNewsletterId}`, postDataNewsletterObjData)
                  .then((res) => {
                    if (res.status === 200 || res.status === 201) {
                      /// actualizar el newsletter
                      const newsletterIndex = newsletterList.findIndex(
                        (item) => item.id === currentNewsletterId
                      );
                      const newNewsletterList = [...newsletterList];
                      newNewsletterList.splice(newsletterIndex, 1, res.data);
                      dispatch(setNeswletterList(newNewsletterList));
                      callbackFunction({ exitEditor });
                    }
                  });
              }
            });

          return;
        }
        setLoading(false);
        showPopupNewsletterSave.onFalse();
        return;
      }
      await createNewNewsletter({ exitEditor });
    },
    [
      axiosInstance,
      buildHtml,
      callbackFunction,
      createNewNewsletter,
      currentNewsletter,
      currentNewsletterId,
      deepEqual,
      newsletterSaveed,
      Subject,
    ]
  );

  const disableOption = useCallback(
    (option: 'Prueba' | 'Aprobacion' | 'Subscriptores' | 'schedule') => {
      if (saving) {
        return true;
      }

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
    },
    [currentNewsletterId, newsletterList, saving]
  );

  const DialogSaveNewsletter = ({ exitEditor }: { exitEditor: boolean }) => (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={showPopupNewsletterSave.value}
      onClose={showPopupNewsletterSave.onFalse}
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
            ¿Deseas guardar los cambios del Newsletter?
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
                showPopupNewsletterSave.onFalse();
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
              onClick={() => handleclickAcept({ exitEditor })}
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

  const SendButtonJSX = () => (
    <>
      <Button
        onClick={async (e) => {
          setAnchorEl(e.currentTarget);
          handleClickSendButton(e).then((res) => {
            if (res.length === 0) {
              setOpenPopove(true);
            }
          });
        }}
        endIcon={
          <Iconify
            icon={
              saving
                ? ''
                : openPopover
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
        Enviar
      </Button>
      <CustomPopover
        open={openPopover}
        onClose={() => setOpenPopove(false)}
        anchorEl={anchorEl}
        slotProps={
          {
            arrow: {
              placement: 'top-left',
            },
          } as any
        }
      >
        <MenuItem disabled={disableOption('Prueba')} onClick={() => setOpenSendDialog(true)}>
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

      <SendDialogAprob
        open={openAprob}
        setOpen={setOpenAprob}
        handleclickRevision={async () => {
          popover.onClose();
          await sendEmailPost('aprobar');
        }}
      />

      <SendDialog
        open={openSendDialog}
        setOpen={setOpenSendDialog}
        handleclickRevision={async () => {
          popover.onClose();
          await sendEmailPost();
        }}
      />
    </>
  );

  const DeleteButtonJSX = (
    <LoadingButton
      onClick={handleclickDeleteNewsletter}
      loading={false}
      fullWidth
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
  );

  return {
    buildHtml,
    sendEmailPost,
    handleClickSendButton,
    handleClickSchedule,
    handleclickDeleteNewsletter,
    createNewNewsletter,
    handleclickAcept,
    disableOption,
    DialogSaveNewsletter,
    SendButtonJSX,
    DeleteButtonJSX,
    showPopupNewsletterSave,
    popover,
  };
};

export default useSendNewsletter;
