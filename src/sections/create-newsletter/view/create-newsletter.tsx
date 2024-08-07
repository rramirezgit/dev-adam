import type { RootState } from 'src/store';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Paper,
  useTheme,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import {
  setOpenNewsletterDrawer,
} from 'src/store/slices/newsletterStore';

import ButtonOption from 'src/components/drawer-news/buton-option-drawer';
import { NewsletterDrawer } from 'src/components/drawer-news/newsletter-drawer';

import { useAxios } from 'src/auth/axios/axios-provider';

import MenuNeswletter from '../menu/menu-view';
import useSendNewsletter from '../header-editing';
import NewsletterEditingArea from '../editing-area';

export default function CreateNewsletter() {
  const Theme = useTheme();

  const [showAprove, setShowAprove] = useState(false);

  const [showScheduleData, setShowScheduleData] = useState(false);

  const smUp = useResponsive('up', 'sm');

  const { showPopupNewsletterSave, DialogSaveNewsletter } = useSendNewsletter();

  const router = useParams<any>();

  const navegate = useRouter();

  const { NewsletterId } = router;

  const newsletterList = useSelector((state: RootState) => state.newsletter.newsletterList);
  const currentNewsletterId = useSelector(
    (state: RootState) => state.newsletter.currentNewsletterId
  );

  const newsletter: any = newsletterList.find((item) => item.id === currentNewsletterId);

  const subject = useSelector((state: RootState) => state.newsletter.subject);

  const dispatch = useDispatch();

  const axiosInstance = useAxios();

  useEffect(() => {
    if (newsletter) {
      if (newsletter && newsletter?.status === 'SCHEDULED') {
        setShowScheduleData(true);
      } else {
        setShowScheduleData(false);
      }

      if (newsletter && newsletter?.status === 'PENDING_APPROVAL') {
        setShowAprove(true);
      } else {
        setShowAprove(false);
      }
    } else {
      setShowAprove(false);
    }
  }, [currentNewsletterId, newsletterList]);

  const renderBody = (
    <Box
      sx={{
        display: 'flex',
        gap: Theme.spacing(2),
      }}
    >
      <MenuNeswletter />
      <NewsletterEditingArea />
    </Box>
  );

  return (
    <>
      {/* <SendNewsletter /> */}
      {!smUp ? (
        renderBody
      ) : (
        <Box position="relative">
          <ButtonOption
            iconSrc="/assets/icons/dashboard/create-note/save.svg"
            title="Guardar Newsletter"
            onClick={() => {
              showPopupNewsletterSave.onTrue();
            }}
            index={0}
          />
          <ButtonOption
            iconSrc="/assets/icons/dashboard/create-note/options.svg"
            title="Opciones"
            sx={{
              opacity: currentNewsletterId ? 1 : 0,
            }}
            onClick={() => {
              dispatch(setOpenNewsletterDrawer(true));
            }}
            index={1}
          />
          {/* <Box
            sx={{
              display: 'flex',
              gap: Theme.spacing(2),
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Stack direction="row" spacing={2}>
              <TextField
                label="Asunto"
                variant="outlined"
                size="small"
                color="primary"
                value={subject}
                sx={{ mb: 2 }}
                onChange={(e) => {
                  dispatch(setSubject(e.target.value));
                }}
              />

              {showAprove && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: Theme.spacing(2),
                    alignItems: 'flex-start',
                  }}
                >
                  <Tooltip title="Aprobar">
                    <IconButton onClick={handleClicAprove}>
                      <Iconify icon="iconamoon:check-bold" color={Theme.palette.primary.main} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Rechazar">
                    <IconButton onClick={handleClicRechazar}>
                      <Iconify icon="iconoir:cancel" color={Theme.palette.primary.main} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Stack>
            {showScheduleData && (
              <Box
                sx={{
                  display: 'flex',
                  gap: Theme.spacing(2),
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  {`Guardado el ${dayjs(newsletter.ceratedAt).format('DD/MM/YYYY')}`}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 158,
                    height: 48,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '8px',
                    background: 'rgba(233, 12, 238, 0.18)',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#AB12AE',
                      fontSize: '15px',
                      fontWeight: 600,
                    }}
                  >
                    Programada
                  </Typography>

                  <Typography
                    sx={{
                      color: '#29394E',
                      fontSize: '10px',
                      fontWeight: 600,
                    }}
                  >
                    {`${
                      newsletter.scheduleDate
                        ? dayjs(newsletter.scheduleDate).format('ddd DD MMM, HH:mm a')
                        : ''
                    }`}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box> */}
          <Paper
            sx={{
              width: '100%',
              padding: Theme.spacing(2),
              borderRadius: '16px',
              position: 'relative',
              boxShadow:
                '0px 0px 2px 0px rgba(145, 158, 171, 0.20), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
            }}
            elevation={1}
          >
            {renderBody}
          </Paper>
          {DialogSaveNewsletter({ exitEditor: false })}
          <NewsletterDrawer />
        </Box>
      )}
    </>
  );
}
