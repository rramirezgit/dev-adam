import { TEMPLATESNAMES } from 'src/const/neswletter/templates';
import uuidv4 from 'src/utils/uuidv4';
import { DEFAULT_COLOR_NESWLETTER } from 'src/theme/palette';
import { TypeTemplateContent } from '../../inputs/types';

const NAME = { name: TEMPLATESNAMES.Footer };

const inputsFooter = (templateId: string): TypeTemplateContent[] => [
  {
    type: 'image',
    variant: 'HorizontalImage',
    value:
      'https://ci3.googleusercontent.com/meips/ADKq_Nb3I0RleVcZ1MJkcMeGDYEoTUuPzzravCOrAQA48GKBQnLDTgZ9Y_AvsrMrC6HBts-z9IZPG5_8GF59idqgDYAXqqEElwm9Mc5N59vd6zkN_7-sUEJax3X5-YUMAUlCmV4LGSTDPqg-q2hlWithcS--9UNz6RagUNVu7Q=s0-d-e1-ft#https://adac-development.s3.us-west-2.amazonaws.com/Media/03-Logo_ADAC_Horizontal_1Color_Azul%202.png',
    ImageData: {
      url: '',
      bgColor: '',
      adjustImageCrop: true,
    },
    inputId: uuidv4(),
    templateId,
    disabled: true,
    style: {
      width: '147px',
      height: '54px',
    },
  },
  {
    type: 'socialMedias',
    variant: 'socialMedias',
    inputId: uuidv4(),
    templateId,
    ...NAME,
  },
  {
    type: 'divisor',
    variant: 'divisor',
    inputId: uuidv4(),
    templateId,
    ...NAME,
  },
  {
    type: 'text',
    variant: 'paragraph',
    disabled: true,
    errorName: 'parrafo',
    value: `Este correo electrónico se le envió como miembro registrado de ADAC. <br/>El uso del servicio y del sitio web está sujeto a nuestros 
      <a
        href="${process.env.NEXT_PUBLIC_HOST_FRONT}/terms-conditions"
        target="_blank"
        rel="noopener noreferrer"
        style="color: #39C0CC; font-weight: bold; text-decoration: none;"
        >

      Términos de uso </a> 

      y 

      <a href="${process.env.NEXT_PUBLIC_HOST_FRONT}/privacy-policy"
        target="_blank"
        rel="noopener noreferrer"
        style="color: #39C0CC; font-weight: bold; text-decoration: none;"
        >
        
      Declaración de privacidad.</a> 
      <br/> 
      
      Si no quieres recibir mas estos emails 
      
      <a href="{urlUnsubscribe}"
        target="_blank"
        rel="noopener noreferrer"
        style="color: #39C0CC; font-weight: bold; text-decoration: none;"
        >Unsubscribe</a>`,
    templateId,
    inputId: uuidv4(),
    ...NAME,
  },
];

export const FooterContent = (templateId: string) => ({
  templateId,
  ...NAME,
  inputs: inputsFooter(templateId),
  color: DEFAULT_COLOR_NESWLETTER,
  bgColor: '',
});
