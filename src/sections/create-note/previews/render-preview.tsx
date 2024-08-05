/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
import { useSelector } from 'react-redux';
import { SOCIALNETWORKSNAMES } from 'src/const/post/redes';
import { RootState } from 'src/store';
import PreviewFacebook from './preview-facebook';
import PreviewTwitter from './preview-twitter';
import PreviewInstagram from './preview-instagram';
import PreviewTiktok from './preview-tiktok';
import PreviewLinkedin from './preview-linkedin';

const imageDefault = '/assets/images/dasboard/post/post-default.png';

export default function RenderPreview() {
  const tabSelected = useSelector((state: RootState) => state.post.tabSelected);
  const dataImageCroped = useSelector((state: RootState) => state.post.dataImageCroped);
  const dataImageCrop = useSelector((state: RootState) => state.post.dataImageCrop);
  const showCropSection = useSelector((state: RootState) => state.post.showCropSection);

  const imagePreview = showCropSection
    ? dataImageCroped
    : dataImageCrop
    ? dataImageCrop
    : imageDefault;

  if (tabSelected === SOCIALNETWORKSNAMES.facebook) {
    return <PreviewFacebook image={imagePreview} />;
  }

  if (tabSelected === SOCIALNETWORKSNAMES.instagram) {
    return <PreviewInstagram image={imagePreview} />;
  }

  if (tabSelected === SOCIALNETWORKSNAMES.twitter) {
    return <PreviewTwitter image={imagePreview} />;
  }

  if (tabSelected === SOCIALNETWORKSNAMES.linkedin) {
    return <PreviewLinkedin image={imagePreview} />;
  }

  if (tabSelected === SOCIALNETWORKSNAMES.tiktok) {
    return <PreviewTiktok image={imageDefault} />;
  }
}
