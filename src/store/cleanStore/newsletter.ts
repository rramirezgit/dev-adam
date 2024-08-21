import { useDispatch } from 'react-redux';

import {
  setMenu,
  setErrors,
  setEmails,
  setHeader,
  setDeleted,
  setSubject,
  setObjectFit,
  setShowEditor,
  setShowAprove,
  setEmailsAprob,
  setImagesSaved,
  setDataImageCrop,
  setNeswletterList,
  setDataImageCroped,
  setStylesNewsletter,
  setcurrentNewsletter,
  setSelectedNewsletter,
  setcurrentNewsletterID,
  setZoomScaleNewsletter,
  setOpenNewsletterDrawer,
  setCurrentNewsletterImagesList,
} from 'src/store/slices/newsletterStore';

import { headerContent } from 'src/sections/create-newsletter/templates/header/header-content';
import { FooterContent } from 'src/sections/create-newsletter/templates/footer/footer-content';

const useCleanStateNewsletter = () => {
  const dispatch = useDispatch();

  const cleanStateNewsletter = () => {
    dispatch(setOpenNewsletterDrawer(false));
    dispatch(setShowEditor(false));
    dispatch(setMenu({ type: 'none', templateId: '', inputId: 'string', parentId: 'string' }));
    dispatch(setSelectedNewsletter(''));
    dispatch(setNeswletterList([]));
    dispatch(setStylesNewsletter({ main: '#00C3C3' }));
    dispatch(setcurrentNewsletter([headerContent('header'), FooterContent('footer')]));
    dispatch(setErrors([]));
    dispatch(setDataImageCrop(null));
    dispatch(setDataImageCroped(null));
    dispatch(setEmails([]));
    dispatch(setEmailsAprob([]));
    dispatch(setDeleted(false));
    dispatch(setHeader(true));
    dispatch(setSubject('ADAC'));
    dispatch(setcurrentNewsletterID(''));
    dispatch(setCurrentNewsletterImagesList([]));
    dispatch(setShowAprove(false));
    dispatch(setImagesSaved(true));
    dispatch(setObjectFit('cover'));
    dispatch(setZoomScaleNewsletter(1));
  };

  return cleanStateNewsletter;
};

export default useCleanStateNewsletter;
