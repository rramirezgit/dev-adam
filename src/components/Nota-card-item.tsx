/* eslint-disable no-nested-ternary */
// @mui
import {
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import Card from '@mui/material/Card';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { alpha } from '@mui/material/styles';
import Check from 'public/assets/icons/dashboard/create-note/check.svg';
import {
  NotaItemList,
  setCoverImage,
  setDeleted,
  setMenu,
  setShowEditor,
  setSubject,
  setcurrentNota,
  setcurrentNotaID,
} from 'src/store/slices/noteStore';
import { useBoolean } from 'src/hooks/use-boolean';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { useRouter } from 'src/routes/hooks';
import { setcurrentNewsletter } from 'src/store/slices/newsletterStore';
import { RootState } from 'src/store';
import useNotes from 'src/utils/useNotes';
import { useAxios } from 'src/auth/axios/axios-provider';
import { Iconify } from './iconify';
import Image from 'next/image';
import StateBtn from './StateBtn';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

interface Props {
  Nota: NotaItemList;
  preview?: boolean;
  ChangeStatus?: boolean;
}

export default function NotaCardItem(props: Props) {
  const { Nota, preview, ChangeStatus } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const showPopupDelete = useBoolean();

  const { loadNotes } = useNotes();

  const currentNewsletter = useSelector((state: RootState) => state.newsletter.currentNewsletter);
  const currentNewsletterId = useSelector(
    (state: RootState) => state.newsletter.currentNewsletterId
  );

  const axiosInstance = useAxios();

  const handleClick = () => {
    const newCurrentNota =
      typeof Nota.objData === 'string'
        ? Nota.objData !== '' && Nota.objData.startsWith('[')
          ? JSON.parse(Nota.objData)
          : null
        : Nota.objData;

    if (newCurrentNota === null) return;
    dispatch(setcurrentNota(newCurrentNota));
    dispatch(setcurrentNotaID(Nota.id));
    dispatch(setCoverImage(Nota.coverImageUrl));
    dispatch(setSubject(Nota.title));
    dispatch(setShowEditor(true));
    dispatch(setMenu({ type: 'none' }));
  };

  const changeStatusNote = async (status: string) => {
    await axiosInstance.patch(`posts/${Nota.id}/status/${status}`).then(() => {
      let tabNumber = 0;
      if (status === 'REVIEW') {
        tabNumber = 1;
      } else if (status === 'APPROVED') {
        tabNumber = 2;
      } else if (status === 'PUBLISHED') {
        tabNumber = 3;
      }

      loadNotes({ tab: tabNumber });
    });
  };

  const handleClickNewsletter = async () => {
    dispatch(setMenu({ type: 'none' }));

    const indexFooter = currentNewsletter.findIndex((item) => item.templateId === 'footer');

    const dataItem =
      Nota.objData !== '' && Nota.objData.startsWith('[') ? JSON.parse(Nota.objData) : null;

    if (dataItem === null) return;
    dataItem[0].NotaId = Nota.id;
    await axiosInstance.patch(`/posts/${Nota.id}/used/newsletter/`, {
      newsletterId: currentNewsletterId,
    });

    const newNewsletter = [
      ...currentNewsletter.slice(0, indexFooter),
      dataItem[0],
      ...currentNewsletter.slice(indexFooter),
    ];

    dispatch(setcurrentNewsletter(newNewsletter));
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: '8px',
          maxWidth: '352px',
          position: 'relative',
          width: '100%',
        }}
      >
        {/* {post.mediaUrls?.length ? renderSocialMini : null} */}
        {!preview && (
          <>
            {Nota.status === 'DRAFT' &&
            Nota.id !== '661ec73c3203221c8425c55b' &&
            Nota.id !== '662c28f84ac5495cd6d60f8a' ? (
              <Box
                sx={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  zIndex: '2',
                }}
              >
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPopupDelete.onTrue();
                  }}
                >
                  <Iconify icon="ic:round-delete" width={19} height={19} />
                </IconButton>
              </Box>
            ) : null}
          </>
        )}

        <Box
          onClick={preview ? handleClickNewsletter : handleClick}
          sx={{
            cursor: 'pointer',
            height: preview ? '100px' : '200px',
            backgroundColor: theme.palette.background.default,
            position: 'relative',
            overflowX: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            '&::-webkit-scrollbar': {
              width: '5px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.primary.main, 0.24),
              borderRadius: '24px',
            },
          }}
        >
          {Nota.origin === 'AI' && Nota.content.length === 0 ? (
            <Image
              src={Nota.coverImageUrl}
              alt="post image"
              style={{
                objectFit: 'cover',
                cursor: 'pointer',
              }}
            />
          ) : (
            <Box
              sx={{
                transform: 'scale(0.4)',
                height: '100%',
                position: 'relative',
                top: '-8%',
              }}
              dangerouslySetInnerHTML={{
                __html: Nota.content,
              }}
            />
          )}
        </Box>

        <Box sx={{ padding: '20px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                maxWidth: '55%',
              }}
            >
              <Tooltip title={Nota.title} placement="top">
                <Typography
                  onClick={preview ? handleClickNewsletter : handleClick}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: '600',

                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {Nota.title}
                </Typography>
              </Tooltip>
              <Typography
                sx={{
                  fontSize: '12px',
                  color: theme.palette.text.secondary,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {Nota?.createdAt && fDate(Nota.createdAt)}
              </Typography>
            </Box>

            {Nota.publishOnAdac && <Check />}

            {ChangeStatus && !Nota.publishOnAdac && (
              <StateBtn
                Nota={Nota}
                onChange={changeStatusNote}
                sx={{
                  borderRadius: '19px',
                  height: '31px',
                }}
              />
            )}
          </Box>
        </Box>
      </Card>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={showPopupDelete.value}
        onClose={showPopupDelete.onFalse}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
      >
        <DialogTitle
          sx={{ minHeight: 76 }}
          style={{
            padding: theme.spacing(5),
          }}
        >
          <Stack direction="column" justifyContent="space-between">
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                width: '100%',
                mb: theme.spacing(5),
              }}
            >
              ¿Estás seguro de que deseas ELIMINAR el borrador?
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
                  setLoading(true);
                  axiosInstance.delete(`/posts/${Nota.id}`).then((res) => {
                    setLoading(false);
                    dispatch(setDeleted(true));
                    showPopupDelete.onFalse();
                  });
                }}
                sx={{
                  width: '180px',
                }}
              >
                Eliminar
              </LoadingButton>
              <Button
                onClick={() => {
                  showPopupDelete.onFalse();
                }}
                variant="contained"
                color="primary"
                sx={{
                  '&.MuiButton-root': {
                    height: '48px',
                    padding: theme.spacing(0, 8),
                    color: '#fff',
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