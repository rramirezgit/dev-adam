import {
  Box,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useResponsive } from 'src/hooks/use-responsive';
import { useDispatch, useSelector } from 'react-redux';
import { setShowEditor, setSubject } from 'src/store/slices/newsletter';
import { useParams } from 'next/navigation';
import Iconify from 'src/components/iconify';
import { RootState } from 'src/store';
import dayjs from 'dayjs';
import { useRouter } from 'src/routes/hooks';
import NewsletterEditingArea from '../editing-area';
import SendNewsletter from '../header-editing';
import MenuNeswletter from '../menu/menu-view';
import { useAxios } from '../../../auth/context/axios/axios-provider';

export default function CreateNewsletter() {
  const Theme = useTheme();

  const [showAprove, setShowAprove] = useState(false);

  const [showScheduleData, setShowScheduleData] = useState(false);

  const smUp = useResponsive('up', 'sm');

  const router = useParams();

  const navegate = useRouter();

  const { NewsletterId } = router;

  const neswletterList = useSelector((state: RootState) => state.newsletter.neswletterList);
  const currentNewsletterId = useSelector(
    (state: RootState) => state.newsletter.currentNewsletterId
  );

  const newsletter: any = neswletterList.find((item) => item.id === currentNewsletterId);

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
  }, [currentNewsletterId, neswletterList]);

  const handleClicAprove = async () => {
    await axiosInstance
      .patch(`newsletters/${NewsletterId || currentNewsletterId}/review`, {
        approved: true,
      })
      .then(() => {
        navegate.push('/dashboard/create_newsletter');
        setShowAprove(false);
        dispatch(setShowEditor(false));
      });
  };

  const handleClicRechazar = async () => {
    await axiosInstance
      .patch(`newsletters/${NewsletterId || currentNewsletterId}/review`, {
        approved: false,
      })
      .then(() => {
        navegate.push('/dashboard/create_newsletter');
        setShowAprove(false);
        dispatch(setShowEditor(false));
      });
  };

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
      <SendNewsletter />
      {!smUp ? (
        renderBody
      ) : (
        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: Theme.spacing(2),
              padding: Theme.spacing(2),
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
          </Box>
          <Paper
            sx={{
              width: '100%',
              padding: Theme.spacing(2),
              borderRadius: '8px',
              position: 'relative',
            }}
            elevation={1}
          >
            {renderBody}
          </Paper>
        </Box>
      )}
    </>
  );
}
