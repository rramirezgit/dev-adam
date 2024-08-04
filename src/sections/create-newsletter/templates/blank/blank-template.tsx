import { TEMPLATESNAMES } from 'src/const/neswletter/templates';
import uuidv4 from 'src/utils/uuidv4';
import { DEFAULT_COLOR_NESWLETTER } from 'src/theme/palette';
import { TypeTemplateContent } from '../../inputs/types';

const NAME = { name: TEMPLATESNAMES.Blank };

const inputsBlank = (templateId: string): TypeTemplateContent[] => [
  {
    type: 'addInput',
    templateId,
    inputId: uuidv4(),
    ...NAME,
  },
];

export const blankContent = (templateId: string) => ({
  templateId,
  ...NAME,
  inputs: inputsBlank(templateId),
  color: DEFAULT_COLOR_NESWLETTER,
  bgColor: '',
});
