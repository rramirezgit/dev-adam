import { Box, Typography, alpha, useTheme } from '@mui/material';
import { CSSProperties, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import Iconify from 'src/components/iconify';
import { setDataImageCrop, setShowCropSection } from 'src/store/slices/post';

interface ImageBoxProps {
  label: string;
  name: string;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  sx?: CSSProperties;
}

export default function ImageBox({
  sx,
  disabled,
  placeholder,
  error,
  label,
  ...props
}: ImageBoxProps) {
  const theme = useTheme();
  const dispath = useDispatch();

  const handleDrop = (acceptedFiles: any[]) => {
    const file: any = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      if (e.target?.result) {
        dispath(setDataImageCrop(e.target?.result as string));

        dispath(setShowCropSection(true));
      }
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragReject, isDragActive } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [] },
    onDrop: handleDrop,
  });

  const hasError = isDragReject || error;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <Typography sx={{ fontsize: '14px', fontWeight: 500 }}>{label}</Typography>
      <Box
        {...getRootProps()}
        sx={{
          width: 100,
          height: 100,
          flexShrink: 0,
          display: 'flex',
          borderRadius: 1,
          cursor: 'pointer',
          alignItems: 'center',
          color: 'text.disabled',
          justifyContent: 'center',
          border: `dashed 1px ${alpha(theme.palette.grey[500], 0.8)}`,
          ...(isDragActive && {
            bgcolor: alpha(theme.palette.info.main, 0.2),
            borderColor: theme.palette.info.main,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasError && {
            color: 'error.main',
            borderColor: 'error.main',
            bgcolor: alpha(theme.palette.error.main, 0.08),
          }),
          '&:hover': {
            bgcolor: alpha(theme.palette.background.neutral, 0.8),
          },
          ...sx,
        }}
      >
        <input {...getInputProps()} />

        {placeholder || <Iconify icon="eva:cloud-upload-fill" width={28} />}
      </Box>
    </Box>
  );
}
