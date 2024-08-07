/* eslint-disable react-hooks/exhaustive-deps */
import type { RootState, AppDispatch } from 'src/store';

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Slider, Tooltip, TextField, IconButton, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { varAlpha } from 'src/theme/styles';
import {
  setSubject,
  setShowEditor,
  setZoomScaleNewsletter,
} from 'src/store/slices/newsletterStore';

import useSendNewsletter from 'src/sections/create-newsletter/header-editing';

import { useAxios } from 'src/auth/axios/axios-provider';

import { Block } from './styles';
import { Iconify } from '../iconify';

export function NewsletterDraweOptions() {
  const theme = useTheme();
  const distpach = useDispatch<AppDispatch>();

  const [showAprove, setShowAprove] = useState(false);

  const newsletterList = useSelector((state: RootState) => state.newsletter.newsletterList);
  const currentNewsletterId = useSelector(
    (state: RootState) => state.newsletter.currentNewsletterId
  );

  const router = useRouter();

  const axiosInstance = useAxios();

  const dispatch = useDispatch<AppDispatch>();

  const { DeleteButtonJSX } = useSendNewsletter();

  const { subject, zoomScaleNewsletter } = useSelector((state: RootState) => state.newsletter);

  const newsletter: any = newsletterList.find((item) => item.id === currentNewsletterId);

  const [showScheduleData, setShowScheduleData] = useState(false);

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

  const cssVars = {
    '--item-radius': '12px',
    '--item-bg': theme.vars.palette.grey[500],
    '--item-border-color': varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
    '--item-active-color': `linear-gradient(135deg, ${theme.vars.palette.primary.light} 0%, ${theme.vars.palette.primary.main} 100%)`,
    '--item-active-shadow-light': `-8px 8px 20px -4px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
    '--item-active-shadow-dark': `-8px 8px 20px -4px ${varAlpha(theme.vars.palette.common.blackChannel, 0.12)}`,
  };

  const renderLayout = (
    <div>
      <TextField
        disabled={!currentNewsletterId}
        label="Asunto"
        variant="outlined"
        color="primary"
        fullWidth
        rows={6}
        multiline
        value={subject}
        onChange={(e) => {
          distpach(setSubject(e.target.value));
        }}
      />
    </div>
  );

  const handleClicAprove = async () => {
    await axiosInstance
      .patch(`newsletters/${currentNewsletterId}/review`, {
        approved: true,
      })
      .then(() => {
        router.push('/dashboard/create-newsletter');
        setShowAprove(false);
        dispatch(setShowEditor(false));
      });
  };

  const handleClicRechazar = async () => {
    await axiosInstance
      .patch(`newsletters/${currentNewsletterId}/review`, {
        approved: false,
      })
      .then(() => {
        router.push('/dashboard/create-newsletter');
        setShowAprove(false);
        dispatch(setShowEditor(false));
      });
  };

  const renderAprove = (
    <>
      {showAprove && (
        <Block title="Aprobar o Rechazar" sx={{ ...cssVars, mt: 2 }}>
          <Box
            sx={{
              display: 'flex',
              gap: theme.spacing(2),
              alignItems: 'flex-start',
            }}
          >
            <Tooltip title="Aprobar">
              <IconButton onClick={handleClicAprove}>
                <Iconify icon="iconamoon:check-bold" color={theme.palette.primary.main} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rechazar">
              <IconButton onClick={handleClicRechazar}>
                <Iconify icon="iconoir:cancel" color={theme.palette.primary.main} />
              </IconButton>
            </Tooltip>
          </Box>
        </Block>
      )}
    </>
  );

  const rendersSchedule = (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: theme.spacing(2),
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
      {/* )} */}
    </>
  );

  const renderZoomAndColor = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
      }}
    >
      <Block title="Zoom" sx={{ ...cssVars, mt: 2 }}>
        <Slider
          aria-label="Zoom"
          defaultValue={zoomScaleNewsletter}
          valueLabelDisplay="auto"
          step={0.1}
          marks
          onChange={(e, value) => {
            dispatch(setZoomScaleNewsletter(value as number));
          }}
          min={0.4}
          max={1.5}
        />
      </Block>
      {DeleteButtonJSX}
    </div>
  );

  return (
    <>
      {showScheduleData && (
        <Block title="Nota Programada" sx={{ ...cssVars, gap: 1 }}>
          {rendersSchedule}
        </Block>
      )}
      <Block title="Configuración de Nota" sx={{ ...cssVars, gap: 1 }}>
        {renderLayout}
        {renderAprove}
        {renderZoomAndColor}
      </Block>
    </>
  );
}
