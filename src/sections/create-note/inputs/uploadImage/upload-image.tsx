/* eslint-disable jsx-a11y/click-events-have-key-events */

import type { RootState } from 'src/store';

import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';

import { Box, alpha, useTheme } from '@mui/material';

import {
  setMenu,
  setObjectFit,
  setImagesSaved,
  setDataImageCrop,
  setDataImageCroped,
  updateImageDataNota,
} from 'src/store/slices/noteStore';

import { Iconify } from 'src/components/iconify';

import { useAxios } from 'src/auth/axios/axios-provider';

import type { ILayout, ImageInput } from '../types';

export interface Props extends ImageInput {
  placeholder?: string;
  error?: boolean;
  templateId: string;
  isEmail?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
  className?: string;
}

export default function UploadHorizontalImage({
  isEmail = false,
  placeholder,
  error,
  style,
  disabled = false,
  parentId,
  className,
  ...props
}: Props) {
  const theme = useTheme();

  const menuData = useSelector((state: RootState) => state.note.menuData);

  const dispatch = useDispatch();

  const axiosInstace = useAxios();

  const objectFit = useSelector((state: RootState) => state.note.objectFit);
  const currentNota = useSelector((state: RootState) => state.note.currentNota);
  const currentNotaId = useSelector((state: RootState) => state.note.currentNotaId);

  const errors = useSelector((state: RootState) => state.note.errors);

  let currentInput = currentNota
    .find((item) => item.templateId === props.templateId)
    ?.inputs.find((item) => item.inputId === props.inputId && item.type === 'image') as ImageInput;

  if (currentInput === undefined) {
    const layout = currentNota
      .find((item) => item.templateId === props.templateId)
      ?.inputs.find((item) => item.inputId === parentId && item.type === 'layout') as ILayout;

    currentInput = layout?.inputs.find(
      (input: any) => input.inputId === props.inputId
    ) as ImageInput;
  }

  const handleDrop = (acceptedFiles: any[]) => {
    const file: any = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const isSquare = img.width === img.height;

        if (isSquare) {
          dispatch(setObjectFit('cover'));
        } else {
          dispatch(setObjectFit('fill'));
        }

        dispatch(
          setMenu({
            type: 'crop-image',
            templateId: props.templateId,
            inputId: props.inputId,
            parentId,
          })
        );
        const image = e.target?.result;

        const data = {
          imageData: image as string,
          type: file.type,
          name: file.name,
        };

        dispatch(setDataImageCroped(data));
        dispatch(setDataImageCrop(data));

        dispatch(setImagesSaved(false));
      };
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragReject, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
      'image/avif': [],
    },
    onDrop: handleDrop,
  });

  const hasError = isDragReject || error || errors.find((item) => item.inputId === props.inputId);

  const convertImageToBase64 = async (url: any) => {
    const b64 = await axiosInstace.get(`media/fetch-base64?mediaUrl=${url}`).then((res) => {
      if (res.status === 200) {
        return res.data;
      }
      return null;
    });
    return b64;
  };

  const handleClickOpenMenu = async () => {
    if (disabled) return;
    if (menuData.type !== 'crop-image') {
      if (currentInput?.type === 'image') {
        if (currentInput.value.startsWith('http')) {
          await convertImageToBase64(currentInput.value).then((base64: any) => {
            if (base64) {
              dispatch(
                updateImageDataNota({
                  ImageData: props?.ImageData,
                  templateId: props.templateId,
                  inputId: props.inputId,
                  parentId,
                })
              );
              dispatch(
                setMenu({
                  type: 'crop-image',
                  templateId: props.templateId,
                  inputId: props.inputId,
                  parentId,
                })
              );

              const ddata = {
                imageData: base64,
                type: props?.ImageData?.type as string,
                name: props?.ImageData?.name as string,
              };

              dispatch(setDataImageCroped(ddata));
              dispatch(setDataImageCrop(ddata));
            }
          });
        } else {
          dispatch(
            updateImageDataNota({
              ImageData: props?.ImageData,
              templateId: props.templateId,
              inputId: props.inputId,
              parentId,
            })
          );
          dispatch(
            setMenu({
              type: 'crop-image',
              templateId: props.templateId,
              inputId: props.inputId,
              parentId,
            })
          );

          console.log(currentInput);

          const ddata = {
            imageData: currentInput.value,
            type: props?.ImageData?.type as string,
            name: props?.ImageData?.name as string,
          };

          dispatch(setDataImageCroped(ddata));
          dispatch(setDataImageCrop(ddata));
        }
      }
    }
  };

  if ((currentInput?.value && currentInput?.value.length > 0) || isEmail) {
    return (
      <div
        id={`preview-${props.inputId}`}
        className={className}
        onClickCapture={handleClickOpenMenu}
        style={{
          width: '100%',
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          borderRadius: '15px',
          alignItems: 'center',
          background:
            currentInput.type === 'image' ? currentInput.ImageData?.bgColor : 'transparent',
          cursor: 'pointer',
          ...style,
        }}
      >
        {isEmail ? (
          <a href={`https://adac.mx/view-online/${currentNotaId}/`}>
            <img
              alt="img"
              src={currentInput.value as string}
              className={className}
              id={`img-${props.inputId}`}
              style={
                currentInput.type === 'image' && currentInput?.ImageData?.adjustImageCrop
                  ? {
                      objectFit,
                      width: '100%',
                      height: 'auto',
                      borderRadius: '15px',
                      ...style,
                    }
                  : {
                      objectFit: 'contain',
                      borderRadius: '15px',
                      width: '100%',
                      height: 'auto',
                      ...style,
                    }
              }
            />
          </a>
        ) : (
          <img
            alt="img"
            src={currentInput.value as string}
            className={className}
            id={`img-${props.inputId}`}
            style={
              currentInput.type === 'image' && currentInput?.ImageData?.adjustImageCrop
                ? {
                    objectFit,
                    width: '100%',
                    height: 'auto',
                    borderRadius: '15px',
                    ...style,
                  }
                : {
                    objectFit: 'contain',
                    borderRadius: '15px',
                    width: '100%',
                    height: 'auto',
                    ...style,
                  }
            }
          />
        )}
      </div>
    );
  }

  if (!isEmail && !currentInput?.value) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          ...style,
        }}
      >
        <Box
          {...getRootProps()}
          sx={{
            width: '100%',
            height: '300px',
            backgroundColor: 'background.neutral',
            flexShrink: 0,
            display: 'flex',
            borderRadius: '15px',
            cursor: 'pointer',
            alignItems: 'center',
            color: 'text.disabled',
            justifyContent: 'center',
            ...(isDragActive && {
              bgcolor: alpha(theme?.palette?.info?.main, 0.2),
              borderColor: theme?.palette?.info?.main,
            }),
            // ...(disabled && {
            //   opacity: 0.48,
            //   pointerEvents: 'none',
            // }),
            ...(hasError && {
              color: 'error.main',
              borderColor: 'error.main',
              bgcolor: alpha(theme?.palette?.error?.main, 0.08),
            }),
            '&:hover': {
              bgcolor: alpha(theme?.palette?.background?.neutral, 0.8),
            },
            ...style,
          }}
        >
          <input {...getInputProps()} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Iconify icon="simple-line-icons:plus" width={placeholder ? 20 : 68} />
            {placeholder && placeholder?.length > 0 && placeholder}
          </Box>
        </Box>
      </Box>
    );
  }
}
