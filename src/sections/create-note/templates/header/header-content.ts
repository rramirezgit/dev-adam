import uuidv4 from 'src/utils/uuidv4';

import { DEFAULT_COLOR_NESWLETTER } from 'src/theme/palette';
import { TEMPLATESNAMES } from 'src/const/neswletter/templates';

import type { TypeTemplateContent } from '../../inputs/types';

const NAME = { name: TEMPLATESNAMES.Header };

const inputsHeader = (templateId: string): TypeTemplateContent[] => [
  {
    type: 'image',
    variant: 'ImageLogoSponsor',
    inputId: uuidv4(),
    templateId,
    value: '',
    outside: true,
    ImageData: {
      url: '',
      bgColor: '',
      adjustImageCrop: true,
      scale: 1,
      rotate: 0,
      name: '',
      type: '',
    },
    placeholder: 'Agregar patrocinador',
    style: {
      height: 91,
      width: 251,
      marginLeft: 'auto',
    },
    ...NAME,
  },
  {
    type: 'text',
    variant: 'title',
    placeholder: 'Title',
    errorName: 'titulo',
    inputId: uuidv4(),
    templateId,
    // maxLength: 10,
    value: '',
    ...NAME,
  },
  {
    type: 'text',
    variant: 'subtitle',
    placeholder: 'Subtitle',
    errorName: 'subtitulo',
    inputId: uuidv4(),
    templateId,
    // maxLength: 10,
    value: '',
    ...NAME,
  },
  {
    type: 'text',
    variant: 'paragraph',
    placeholder: 'Text here',
    inputId: uuidv4(),
    templateId,
    errorName: 'texto',
    // maxLength: 10,
    value: '',
    ...NAME,
  },
];

export const headerContent = (templateId: string) => ({
  templateId,
  ...NAME,
  inputs: inputsHeader(templateId),
  color: DEFAULT_COLOR_NESWLETTER,
  bgColor: '',
});
