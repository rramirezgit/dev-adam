import { useDispatch } from 'react-redux';

import { DEFAULT_COLOR_NESWLETTER } from 'src/theme/palette';
import {
  setMenu,
  setErrors,
  setEmails,
  setHeader,
  setDeleted,
  setSubject,
  setLoading,
  setFilters,
  setnoteList,
  setpromptIa,
  setUrlNgrok,
  setShowSaved,
  setObjectFit,
  setShowEditor,
  setStylesNota,
  setShowAprove,
  setCoverImage,
  setDeleteItem,
  setcurrentNota,
  setImagesSaved,
  setselectedTab,
  setSelectedNota,
  setZoomScaleNota,
  setDataImageCrop,
  setcurrentNotaID,
  setShowTrendding,
  setOpenNewsDrawer,
  setDataImageCroped,
  setCoverImageError,
  setCurrentNotaImagesList,
  setcurrentNotaDescription,
} from 'src/store/slices/noteStore';

const useCleanStateNote = () => {
  const dispatch = useDispatch();

  const cleanStateNote = () => {
    dispatch(setShowEditor(false));
    dispatch(setMenu({ type: 'none', templateId: '', inputId: 'string', parentId: 'string' }));
    dispatch(setZoomScaleNota(1));
    dispatch(setSelectedNota(''));
    dispatch(setnoteList([]));
    dispatch(setStylesNota({ main: DEFAULT_COLOR_NESWLETTER }));
    dispatch(setcurrentNota([]));
    dispatch(setcurrentNotaDescription(''));
    dispatch(setErrors([]));
    dispatch(setDataImageCrop(null));
    dispatch(setDataImageCroped(null));
    dispatch(setEmails([]));
    dispatch(setDeleted(false));
    dispatch(setHeader(true));
    dispatch(setShowSaved(false));
    dispatch(setSubject('ADAC'));
    dispatch(setcurrentNotaID(''));
    dispatch(setCurrentNotaImagesList([]));
    dispatch(setShowAprove(false));
    dispatch(setImagesSaved(true));
    dispatch(setObjectFit('cover'));
    dispatch(setCoverImage(''));
    dispatch(setCoverImageError(false));
    dispatch(setpromptIa(''));
    dispatch(setUrlNgrok(''));
    dispatch(setShowTrendding(false));
    dispatch(setOpenNewsDrawer(false));
    dispatch(setselectedTab(0));
    dispatch(setLoading(false));
    dispatch(
      setFilters({
        creationDate: null,
        state: 'DRAFT',
        publishOnAdac: false,
      })
    );
    dispatch(setDeleteItem(false));
  };

  return cleanStateNote;
};

export default useCleanStateNote;
