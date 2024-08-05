/* eslint-disable jsx-a11y/alt-text */
import { Box, Divider, Icon, IconButton, Tooltip, useTheme } from '@mui/material';
import { Stack } from '@mui/system';
import { useState } from 'react';
import { m } from 'framer-motion';
import { Category, Image, Tag, Text } from 'iconsax-react';
import { DEFAULT_COLOR_NESWLETTER } from 'src/theme/palette';
import { Iconify } from 'src/components/iconify';
import { useDispatch } from 'react-redux';
import { addNewInputNota } from 'src/store/slices/noteStore';
import uuidv4 from 'src/utils/uuidv4';
import SvgColor from 'src/components/svg-color';

interface AddInputProps {
  isEmail?: boolean;
  templateId: string;
  name: string;
}

export default function AddInputs({ isEmail = false, templateId, ...props }: AddInputProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showVariants, setShowVariants] = useState('');
  const [showOptionsSubVariants, setShowoptionsSubVariants] = useState('');
  const dispatch = useDispatch();

  if (isEmail) return <></>;

  const handleOpenVariants = (variant: string) => {
    setShowVariants(variant);
  };

  const handleClickAddTimeRead = () => {
    const inputIdText = uuidv4();

    dispatch(
      addNewInputNota({
        templateId,
        input: {
          type: 'readingTime',
          inputId: uuidv4(),
          inputIdtext: inputIdText,
          templateId,
        },
      })
    );

    dispatch(
      addNewInputNota({
        templateId,
        input: {
          type: 'text',
          variant: 'paragraph',
          value: '',
          templateId,
          placeholder: 'Texto',
          errorName: 'texto',
          name: props.name,
          inputId: inputIdText,
        },
      })
    );
  };

  const optionsInputs = [
    {
      label: 'Tags',
      value: 'tags',
      Icon: <Tag name="tags" size="24" />,
      onClick: () =>
        dispatch(
          addNewInputNota({
            templateId,
            input: {
              type: 'tags',
              variant: 'tags',
              inputId: uuidv4(),
              templateId,
              tags: [],
              value: '',
              name: props.name,
            },
          })
        ),
    },
    {
      label: 'Imagen',
      value: 'image',
      Icon: <Image name="tags" size="24" />,
      onClick: () => handleOpenVariants('image'),
    },
    {
      label: 'Texto',
      value: 'text',
      Icon: <Text name="tags" size="24" />,
      onClick: () => handleOpenVariants('text'),
    },
    {
      label: 'Linea',
      value: 'linea',
      Icon: <SvgColor src="/assets/icons/newsletter/line.svg" />,
      onClick: () =>
        dispatch(
          addNewInputNota({
            templateId,
            input: {
              type: 'divisor',
              templateId,
              inputId: uuidv4(),
            },
          })
        ),
    },
    {
      label: 'Objetos',
      value: 'objetos',
      Icon: <SvgColor src="/assets/icons/newsletter/category.svg" />,
      onClick: () => handleOpenVariants('objetos'),
    },
  ];

  const variantInputs: any = {
    text: [
      {
        label: 'Título',
        value: 'title',
        onClick: () =>
          dispatch(
            addNewInputNota({
              templateId,
              input: {
                type: 'text',
                variant: 'title',
                value: '',
                templateId,
                placeholder: 'Título',
                errorName: 'Título',
                name: props.name,
                inputId: uuidv4(),
              },
            })
          ),
      },
      {
        label: 'Subtítulo',
        value: 'subtitle',
        onClick: () =>
          dispatch(
            addNewInputNota({
              templateId,
              input: {
                type: 'text',
                variant: 'subtitle',
                value: '',
                templateId,
                placeholder: 'Subtítulo',
                errorName: 'Subtítulo',
                name: props.name,
                inputId: uuidv4(),
              },
            })
          ),
      },
      {
        label: 'Párrafo',
        value: 'paragraph',
        subvariants: [
          {
            label: '+ tiempo de lectura',
            onClik: () => handleClickAddTimeRead(),
          },
        ],
        onClick: () =>
          dispatch(
            addNewInputNota({
              templateId,
              input: {
                type: 'text',
                variant: 'paragraph',
                value: '',
                templateId,
                placeholder: 'Texto',
                errorName: 'texto',
                name: props.name,
                inputId: uuidv4(),
              },
            })
          ),
      },
    ],
    objetos: [
      {
        label: 'Imagen y texto',
        value: 'imgText',
        Icon: <SvgColor src="/assets/icons/newsletter/imgtext.svg" />,
        onClick: () => {
          const id = uuidv4();
          dispatch(
            addNewInputNota({
              templateId,
              input: {
                type: 'layout',
                variant: 'ImageText',
                templateId,
                inputId: id,
                inputs: [
                  {
                    type: 'image',
                    variant: 'Img',
                    value: '',
                    ImageData: {
                      url: '',
                      bgColor: '',
                      adjustImageCrop: true,
                      scale: 1,
                      rotate: 0,
                      name: '',
                      type: '',
                    },
                    placeholder: 'Agregar Imagen',
                    style: {
                      height: 150,
                      width: 120,
                    },
                    inputId: uuidv4(),
                    templateId,
                    parentId: id,
                  },
                  {
                    type: 'text',
                    variant: 'title',
                    inputId: uuidv4(),
                    value: '',
                    templateId,
                    placeholder: 'Titulo',
                    errorName: 'titulo',
                    name: props.name,
                    parentId: id,
                  },
                  {
                    type: 'text',
                    variant: 'paragraph',
                    value: '',
                    templateId,
                    placeholder: 'Text',
                    errorName: 'Texto',
                    name: props.name,
                    inputId: uuidv4(),
                    parentId: id,
                  },
                ],
              },
            })
          );
        },
      },
      {
        label: 'Dos imagenes',
        value: 'twoImg',
        Icon: <SvgColor src="/assets/icons/newsletter/twoImg.svg" />,
        onClick: () => {
          const id = uuidv4();
          dispatch(
            addNewInputNota({
              templateId,
              input: {
                type: 'layout',
                templateId,
                variant: 'TwoImg',
                inputId: id,
                inputs: [
                  {
                    type: 'image',
                    variant: 'Img',
                    value: '',
                    ImageData: {
                      url: '',
                      bgColor: '',
                      adjustImageCrop: true,
                      scale: 1,
                      rotate: 0,
                      name: '',
                      type: '',
                    },
                    placeholder: 'Agregar Imagen',
                    style: {
                      height: 127,
                      width: '100%',
                    },
                    inputId: uuidv4(),
                    templateId,
                    parentId: id,
                  },
                  {
                    type: 'image',
                    variant: 'Img',
                    value: '',
                    ImageData: {
                      url: '',
                      bgColor: '',
                      adjustImageCrop: true,
                      scale: 1,
                      rotate: 0,
                      name: '',
                      type: '',
                    },
                    placeholder: 'Agregar Imagen',
                    style: {
                      height: 127,
                      width: '100%',
                    },
                    inputId: uuidv4(),
                    templateId,
                    parentId: id,
                  },
                ],
              },
            })
          );
        },
      },
    ],
    image: [
      {
        label: 'Imagen',
        value: 'img',
        Icon: <SvgColor src="/assets/icons/newsletter/img.svg" />,
        onClick: () =>
          dispatch(
            addNewInputNota({
              templateId,
              input: {
                type: 'image',
                variant: 'HorizontalImage',
                className: 'horizontal-image',
                value: '',
                ImageData: {
                  url: '',
                  bgColor: '',
                  adjustImageCrop: true,
                },
                inputId: uuidv4(),
                templateId,
              },
            })
          ),
      },
      {
        label: 'Imagen centrada',
        value: 'imgCenter',
        Icon: <SvgColor src="/assets/icons/newsletter/imgcenter.svg" />,
        onClick: () =>
          dispatch(
            addNewInputNota({
              templateId,
              input: {
                type: 'image',
                variant: 'HorizontalImage',
                placeholder: 'Agregar Imagen',
                value: '',
                ImageData: {
                  url: '',
                  bgColor: '',
                  adjustImageCrop: true,
                },
                inputId: uuidv4(),
                templateId,
                style: {
                  width: '250px',
                  height: '80px',
                  margin: '0 auto',
                },
              },
            })
          ),
      },
    ],
  };

  return (
    <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
      <Tooltip title="Agregar Input" placement="top" arrow>
        <IconButton
          aria-label="add"
          disableRipple
          onClick={() => {
            setShowOptions(!showOptions);
            setShowVariants('');
          }}
          sx={{
            '&.MuiIconButton-root': {
              padding: '8px 0px',
            },
          }}
        >
          <Iconify icon="simple-line-icons:plus" width={24} />
        </IconButton>
      </Tooltip>

      {showOptions && (
        <Stack direction="row" spacing={1}>
          {optionsInputs.map((option, index) => (
            <m.div
              key={option.value}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: index * 0.1 }}
              exit={{ opacity: 0 }}
            >
              <Tooltip title={option.label} placement="top" arrow>
                <IconButton
                  disableRipple
                  aria-label="add"
                  size="small"
                  sx={{
                    '&:hover': {
                      color: DEFAULT_COLOR_NESWLETTER,
                    },
                  }}
                  onClick={() => option.onClick()}
                >
                  {option.Icon}
                </IconButton>
              </Tooltip>
            </m.div>
          ))}
        </Stack>
      )}
      {showVariants && showVariants.length > 0 && (
        <Stack direction="row" spacing={1}>
          {variantInputs[showVariants].map((option: any, index: any) => (
            <m.div
              key={option.value}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: index * 0.1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'relative' }}
            >
              {option.Icon ? (
                <Tooltip title={option.label} placement="top" arrow>
                  <IconButton
                    disableRipple
                    aria-label="add"
                    size="small"
                    sx={{
                      '&:hover': {
                        color: DEFAULT_COLOR_NESWLETTER,
                      },
                    }}
                    onClick={() => option.onClick()}
                  >
                    {option.Icon}
                  </IconButton>
                </Tooltip>
              ) : (
                <IconOption onClick={() => option.onClick()}>
                  <div>{option.label}</div>
                </IconOption>
              )}

              {option?.subvariants && (
                <IconOption
                  onClick={(e: any) => {
                    e?.stopPropagation();
                    if (showOptionsSubVariants === option.value) {
                      setShowoptionsSubVariants('');
                    } else {
                      setShowoptionsSubVariants(option.value);
                    }
                  }}
                  sx={{
                    left: '-9px',
                  }}
                >
                  <Iconify
                    icon={`${
                      showOptionsSubVariants === option.value
                        ? 'icon-park-solid:up-one'
                        : 'icon-park-solid:down-one'
                    }`}
                    width={10}
                  />
                </IconOption>
              )}

              {option?.subvariants && showOptionsSubVariants === option.value && (
                <m.div
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                  exit={{ opacity: 0 }}
                >
                  {option.subvariants.map((variant: any, index2: any) => (
                    <IconButton
                      disableRipple
                      aria-label="add"
                      key={index2}
                      sx={{
                        '&:hover': {
                          color: DEFAULT_COLOR_NESWLETTER,
                        },
                        padding: '0px',
                        marginLeft: '4px',
                        fontSize: '12px',
                        left: '-2px',
                        position: 'absolute',
                        width: '150px',
                        justifyContent: 'flex-start',
                      }}
                      onClick={() => variant.onClik()}
                    >
                      {variant.label}
                    </IconButton>
                  ))}
                </m.div>
              )}
            </m.div>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

const IconOption = ({ icon, onClick, children, sx }: any) => (
  <IconButton
    disableRipple
    aria-label="add"
    sx={{
      '&:hover': {
        color: DEFAULT_COLOR_NESWLETTER,
      },
      fontSize: '14px',
      top: '2px',
      ...sx,
    }}
    onClick={onClick}
  >
    {children}
  </IconButton>
);
