import TextBubble from 'src/sections/create-newsletter/inputs/bubbles/bubble';

import Tags from './tags/input-tags';
import LayoutsInputs from './layouts';
import UploadImage from './uploadImage';
import AddInputs from './addInput/add-inputs';
import { INPUTS_TYPES_NEWSLETTER } from './types';
import ReadingTime from './readingTime/reading-time';
import SocialMedias from './socialMedias/social-medias';
import VerticalDivisor from './divisor/vertical-divisor';

export default function TemplateInputs({ ...props }: any) {
  if (props.type === INPUTS_TYPES_NEWSLETTER.text) {
    return <TextBubble {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_NEWSLETTER.image) {
    return <UploadImage {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_NEWSLETTER.tags) {
    return <Tags {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_NEWSLETTER.readingTime) {
    return <ReadingTime {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_NEWSLETTER.socialMedias) {
    return <SocialMedias {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_NEWSLETTER.divisor) {
    return <VerticalDivisor {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_NEWSLETTER.addInput) {
    return <AddInputs {...props} isEmail={props.isEmail} />;
  }

  if (props.type === INPUTS_TYPES_NEWSLETTER.layout) {
    return <LayoutsInputs {...props} isEmail={props.isEmail} />;
  }
}
