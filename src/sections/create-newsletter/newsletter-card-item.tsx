/* eslint-disable no-nested-ternary */
import type { newsletterItemList } from 'src/types/newsletter';

import dayjs from 'dayjs';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Card from '@mui/material/Card';
import { LoadingButton } from '@mui/lab';
import { alpha } from '@mui/material/styles';
// @mui
import {
  Box,
  Stack,
  Button,
  Dialog,
  Tooltip,
  useTheme,
  IconButton,
  Typography,
  CardContent,
  DialogTitle,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import {
  setDeleted,
  setSubject,
  setShowEditor,
  setNeswletterList,
  setcurrentNewsletter,
  setcurrentNewsletterID,
} from 'src/store/slices/newsletterStore';

import { Iconify } from 'src/components/iconify';

import { useAxios } from 'src/auth/axios/axios-provider';
// ----------------------------------------------------------------------

type Props = {
  newsletter: newsletterItemList;
};

export default function NewsletterCardItem(props: Props) {
  const { newsletter } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const showPopupDelete = useBoolean();

  const axiosInstance = useAxios();

  const handleClick = () => {
    const newCurrentNewsletter =
      typeof newsletter.objData === 'string'
        ? newsletter.objData !== '' && newsletter.objData.startsWith('[')
          ? JSON.parse(newsletter.objData)
          : null
        : newsletter.objData;

    if (newCurrentNewsletter === null) return;
    dispatch(setcurrentNewsletter(newCurrentNewsletter));
    dispatch(setcurrentNewsletterID(newsletter.id));
    dispatch(setSubject(newsletter.subject));
    dispatch(setShowEditor(true));
  };

  // const renderSocialMini = (
  //   <Stack
  //     direction="row"
  //     sx={{
  //       position: 'absolute',
  //       top: '10px',
  //       right: '5px',
  //       zIndex: '2',
  //     }}
  //   >
  //     {newsletter.platforms.map((name, index) => (
  //       <Box
  //         key={index}
  //         sx={{
  //           width: '28px',
  //           height: '28px',
  //           borderRadius: '50%',
  //           backgroundColor: name === 'twitter' ? theme.palette.background.default : '',
  //           display: 'flex',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           marginRight: '5px',
  //         }}
  //       >
  //         <Image
  //           src={`/assets/icons/dashboard/post/${name}.svg`}
  //           alt="post image"
  //           width={28}
  //           height={28}
  //         />
  //       </Box>
  //     ))}
  //   </Stack>
  // );

  return (
    <>
      <Card
        onClick={handleClick}
        sx={{
          borderRadius: '8px',
          maxWidth: '352px',
          position: 'relative',
          width: '100%',
          '&:hover': {
            transform: 'scale(1.02)',
            transition: 'all 0.2s ease',
          },
        }}
      >
        {/* {post.mediaUrls?.length ? renderSocialMini : null} */}

        {newsletter.status === 'DRAFT' &&
        newsletter.id !== '661ec73c3203221c8425c55b' &&
        newsletter.id !== '662c28f84ac5495cd6d60f8a' ? (
          <Box
            sx={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              zIndex: '2',
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                showPopupDelete.onTrue();
              }}
            >
              <Iconify icon="ic:round-delete" width={19} height={19} />
            </IconButton>
          </Box>
        ) : null}

        <Box
          sx={{
            height: '200px',
            backgroundColor: theme.palette.background.default,
            position: 'relative',
            overflowY: 'scroll',
            overflowX: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            padding: '21px',

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
          <Box
            sx={{
              transform: 'scale(30%)',
              height: '100%',
              position: 'relative',
              top: '-30%',
            }}
            dangerouslySetInnerHTML={{
              __html: newsletter.content,
            }}
          />
        </Box>

        <CardContent sx={{ padding: '13px 20px', height: 'auto' }}>
          <Tooltip title={newsletter.subject} placement="top">
            <Typography
              sx={{
                cursor: 'pointer',
                fontWeight: '600',

                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {newsletter.subject}
            </Typography>
          </Tooltip>

          {newsletter.status === 'SCHEDULED' ? (
            <Typography sx={{ fontSize: '12px', fontWeight: '400' }} color="primary.main">
              {`Programado el ${dayjs(newsletter.scheduleDate).format('ddd DD MMM, hh:mm a')}`}
            </Typography>
          ) : (
            <Typography sx={{ fontSize: '11px', fontWeight: '400' }} color="text.secondary">
              {newsletter.status} : {fDate(newsletter.createdAt)}
            </Typography>
          )}
        </CardContent>
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
                onClick={async () => {
                  setLoading(true);
                  await axiosInstance.delete(`/newsletters/${newsletter.id}`).then(async (res) => {
                    dispatch(setDeleted(true));
                    showPopupDelete.onFalse();
                    const data = await axiosInstance.get('/newsletters').then((res1) => res1.data);
                    setLoading(false);

                    dispatch(setNeswletterList(data));
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
