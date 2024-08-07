import type { RootState, AppDispatch } from 'src/store';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import { Slider, TextField, IconButton } from '@mui/material';

import useNotes from 'src/utils/useNotes';

import { varAlpha } from 'src/theme/styles';
import {
  setSubject,
  setCoverImage,
  setZoomScaleNota,
  setcurrentNotaDescription,
} from 'src/store/slices/noteStore';

import { useAxios } from 'src/auth/axios/axios-provider';

import { Block } from './styles';
import Image from '../image/image';
import { Iconify } from '../iconify';
import { UploadBox } from '../upload';

export function NavOptions() {
  const theme = useTheme();
  const [loadingCoverImage, setLoadingCoverImage] = useState(false);
  const [coverImageLocal, setCoverImageLocal] = useState('');
  const distpach = useDispatch<AppDispatch>();

  const coverImage = useSelector((state: RootState) => state.note.coverImage);
  const coverImageError = useSelector((state: RootState) => state.note.coverImageError);

  const axiosInstance = useAxios();

  const dispatch = useDispatch<AppDispatch>();

  const { deleteNota } = useNotes();

  const { currentNotaId, subject, currentNotaDescription, zoomScaleNota } = useSelector(
    (state: RootState) => state.note
  );

  const cssVars = {
    '--item-radius': '12px',
    '--item-bg': theme.vars.palette.grey[500],
    '--item-border-color': varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
    '--item-active-color': `linear-gradient(135deg, ${theme.vars.palette.primary.light} 0%, ${theme.vars.palette.primary.main} 100%)`,
    '--item-active-shadow-light': `-8px 8px 20px -4px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
    '--item-active-shadow-dark': `-8px 8px 20px -4px ${varAlpha(theme.vars.palette.common.blackChannel, 0.12)}`,
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    lineHeight: '14px',
    color: 'text.secondary',
    fontWeight: 'fontWeightSemiBold',
    fontSize: theme.typography.pxToRem(11),
  };

  const handleRemoveImage = async () => {
    setLoadingCoverImage(true);
    try {
      if (currentNotaId) {
        await axiosInstance.patch(`posts/${currentNotaId}`, { coverImageUrl: '' });
      }
      distpach(setCoverImage(''));
      setCoverImageLocal('');
    } finally {
      setLoadingCoverImage(false);
    }
  };

  const handleClickDelete = async () => {
    if (currentNotaId) {
      await deleteNota(currentNotaId);
    }
  };

  const renderLayout = (
    <div>
      <TextField
        disabled={!currentNotaId}
        label="Titulo de la nota"
        variant="outlined"
        color="primary"
        fullWidth
        multiline
        value={subject}
        onChange={(e) => {
          distpach(setSubject(e.target.value));
          axiosInstance.patch(`posts/${currentNotaId}`, {
            title: e.target.value,
          });
        }}
      />
      <TextField
        label="Descripcion de la nota"
        disabled={!currentNotaId}
        variant="outlined"
        margin="normal"
        color="primary"
        fullWidth
        rows={4}
        multiline
        value={currentNotaDescription}
        onChange={(e) => {
          distpach(setcurrentNotaDescription(e.target.value));
          axiosInstance.patch(`posts/${currentNotaId}`, {
            description: e.target.value,
          });
        }}
      />
      <Box component="span" sx={{ ...labelStyles, mb: 1 }}>
        Portada de la nota
      </Box>
      {coverImageLocal || coverImage ? (
        <Box sx={{ position: 'relative' }}>
          <Image
            src={coverImageLocal || coverImage}
            alt="cover image"
            height={150}
            style={{
              width: '100%',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
            }}
          />
          <IconButton
            sx={{ position: 'absolute', top: -20, right: -20 }}
            onClick={handleRemoveImage}
          >
            <Iconify icon="typcn:delete" width={30} />
          </IconButton>
        </Box>
      ) : (
        <UploadBox
          loading={loadingCoverImage}
          sx={{ height: '160px', margin: 0, width: 1 }}
          error={coverImageError}
          note
          disabled={!currentNotaId}
          onDrop={async (files) => {
            if (files.length === 0) return;
            setLoadingCoverImage(true);
            const file = files[0];
            const formData = new FormData();
            formData.append('file', file, file.name);
            await axiosInstance
              .post('/media/upload', formData)
              .then(async ({ data }) => {
                if (data.s3Url) {
                  if (currentNotaId) {
                    await axiosInstance
                      .patch(`posts/${currentNotaId}`, {
                        coverImageUrl: data.s3Url,
                      })
                      .then(() => {
                        setLoadingCoverImage(false);
                        distpach(setCoverImage(data.s3Url));
                        setCoverImageLocal(data.s3Url);
                      });
                  } else {
                    setLoadingCoverImage(false);
                    distpach(setCoverImage(data.s3Url));
                  }
                }
              })
              .catch(console.error);
          }}
        />
      )}
    </div>
  );

  const renderZoomAndColor = (
    <div>
      <Block title="Zoom" sx={{ ...cssVars, mt: 2 }}>
        <Slider
          aria-label="Zoom"
          defaultValue={zoomScaleNota}
          valueLabelDisplay="auto"
          step={0.1}
          marks
          onChange={(e, value) => {
            dispatch(setZoomScaleNota(value as number));
          }}
          min={0.4}
          max={1.5}
        />
      </Block>
      <LoadingButton
        disabled={!currentNotaId}
        onClick={handleClickDelete}
        loading={false}
        startIcon={<Iconify icon="material-symbols-light:delete" width={24} height={24} />}
        variant="soft"
        fullWidth
        color="error"
        sx={{
          mb: theme.spacing(2),
          height: '48px',
          padding: '0 20px',
          mt: theme.spacing(2),
        }}
      >
        Eliminar Nota
      </LoadingButton>
    </div>
  );

  return (
    <Block title="Configuración de Nota" sx={{ ...cssVars, gap: 1 }}>
      {renderLayout}
      {renderZoomAndColor}
    </Block>
  );
}
