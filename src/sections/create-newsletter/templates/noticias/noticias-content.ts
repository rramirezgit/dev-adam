import { TEMPLATESNAMES } from 'src/const/neswletter/templates';
import { DEFAULT_COLOR_NESWLETTER } from 'src/theme/palette';
import uuidv4 from 'src/utils/uuidv4';
import { TypeTemplateContent } from '../../inputs/types';

const NAME = { name: TEMPLATESNAMES.Noticias };

const inputIdReadingTime = uuidv4();

const noticiasInputs = (templateId: string): TypeTemplateContent[] => [
  {
    type: 'text',
    variant: 'seccion',
    placeholder: 'Seccion',
    errorName: 'Seccion',
    inputId: uuidv4(),
    value: '',
    // minLength: 5,
    templateId,
    ...NAME,
  },
  {
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
  {
    type: 'tags',
    variant: 'tags',
    inputId: uuidv4(),
    templateId,
    tags: [],
    value: '',
    ...NAME,
  },
  // {
  //   type: 'readingTime',
  //   inputId: uuidv4(),
  //   inputIdtext: inputIdReadingTime,
  //   templateId,
  // },
  {
    type: 'text',
    variant: 'title',
    inputId: uuidv4(),
    value: '',
    templateId,
    placeholder: 'Titulo',
    errorName: 'titulo',
    // minLength: 50,
    ...NAME,
  },
  {
    type: 'text',
    variant: 'paragraph',
    inputId: inputIdReadingTime,
    value: '',
    templateId,
    placeholder: 'Text',
    errorName: 'Texto',
    // minLength: 150,
    ...NAME,
  },
];

export const noticiasContent = (templateId: string) => ({
  templateId,
  ...NAME,
  inputs: noticiasInputs(templateId),
  color: DEFAULT_COLOR_NESWLETTER,
  bgColor: '',
});
