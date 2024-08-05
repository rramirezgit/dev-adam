import UploadImage from './uploadImage';
import Tags from './tags/input-tags';
import ReadingTime from './readingTime/reading-time';
import SocialMedias from './socialMedias/social-medias';
import { INPUTS_TYPES_Nota } from './types';
import VerticalDivisor from './divisor/vertical-divisor';
import AddInputs from './addInput/add-inputs';
import LayoutsInputs from './layouts';
import TextBubble from './bubbles/bubble';

export default function TemplateInputs({ ...props }: any) {
  if (props.type === INPUTS_TYPES_Nota.text) {
    return <TextBubble {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_Nota.image) {
    return <UploadImage {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_Nota.tags) {
    return <Tags {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_Nota.readingTime) {
    return <ReadingTime {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_Nota.socialMedias) {
    return <SocialMedias {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_Nota.divisor) {
    return <VerticalDivisor {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_Nota.addInput) {
    return <AddInputs {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_Nota.layout) {
    return <LayoutsInputs {...props} isEmail={props.isEmail} />;
  }
}
