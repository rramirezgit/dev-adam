import TwoImg from './twoImg/two-img';
import ImgText from './ImgText/img-text';

export default function LayoutsInputs({ ...props }: any) {
  if (props.variant === 'ImageText') {
    return <ImgText {...props} />;
  }

  if (props.variant === 'TwoImg') {
    return <TwoImg {...props} />;
  }
}
