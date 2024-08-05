import { ImageInput } from '../types';
import UploadHorizontalImage from './upload-image';
import UploadImageLogoSponsor from './upload-image-logo-sponsor';

export interface Props extends ImageInput {
  placeholder?: string;
  error?: boolean;
  templateId: string;
  isEmail?: boolean;
  style?: React.CSSProperties;
  parentId?: string;
  className?: string;
}

export default function UploadImage({ ...props }: Props) {
  if (props.variant === 'HorizontalImage') {
    return <UploadHorizontalImage {...props} />;
  }

  if (props.variant === 'ImageLogoSponsor') {
    return <UploadImageLogoSponsor {...props} />;
  }

  if (props.variant === 'ImageQuartet') {
    return <div>ImageQuartet</div>;
  }

  if (props.variant === 'Img') {
    return <UploadHorizontalImage {...props} />;
  }
}
