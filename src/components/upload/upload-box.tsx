import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
// @mui
import { alpha } from '@mui/material/styles';
import { Stack, Typography, CircularProgress } from '@mui/material';

//
import { Iconify } from '../iconify';

//
import type { UploadProps } from './types';

// ----------------------------------------------------------------------

export default function UploadBox({
  placeholder,
  error,
  disabled,
  loading,
  sx,
  note,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    disabled,
    ...other,
  });

  const hasError = isDragReject || error;

  if (loading) {
    return (
      <Box
        sx={{
          m: 0.5,
          width: 64,
          height: 64,
          flexShrink: 0,
          display: 'flex',
          borderRadius: 1,
          cursor: 'pointer',
          alignItems: 'center',
          color: 'text.disabled',
          justifyContent: 'center',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          border: (theme) => `dashed 1px ${alpha(theme.palette.grey[500], 0.16)}`,
          ...(sx as object),
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            padding: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={25} />
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      {...getRootProps()}
      sx={{
        m: 0.5,
        width: 64,
        height: 64,
        flexShrink: 0,
        display: 'flex',
        borderRadius: 1,
        cursor: 'pointer',
        alignItems: 'center',
        color: 'text.disabled',
        justifyContent: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        border: (theme) => `dashed 1px ${alpha(theme.palette.grey[500], 0.16)}`,
        ...(isDragActive && {
          opacity: 0.72,
        }),
        ...(disabled && {
          opacity: 0.48,
          pointerEvents: 'none',
        }),
        ...(hasError && {
          color: 'error.main',
          borderColor: 'error.main',
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        }),
        '&:hover': {
          opacity: 0.72,
        },
        ...sx,
      }}
    >
      <input {...getInputProps()} />
      {note ? (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            padding: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Iconify icon="solar:camera-add-bold" width={28} />
          <Typography
            sx={{
              fontSize: 12,
            }}
          >
            Agregar portada
          </Typography>
        </Stack>
      ) : (
        placeholder || <Iconify icon="eva:cloud-upload-fill" width={28} />
      )}
    </Box>
  );
}
