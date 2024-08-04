/* eslint-disable @typescript-eslint/dot-notation */
import { useDispatch, useSelector } from 'react-redux';
import { setNeswletterList } from 'src/store/slices/newsletterStore';
import { setFilters, setLoading, setselectedTab, setShowEditor } from 'src/store/slices/noteStore';
import { useRouter } from 'src/routes/hooks';
import { useCallback } from 'react';
import { RootState } from 'src/store';
import { useAxios } from 'src/auth/axios/axios-provider';
import { NewslettersFilterValue } from 'src/types/newsletter';

const useNotes = () => {
  const dispatch = useDispatch();
  const axiosInstance = useAxios();
  const navigate = useRouter();

  const filters = useSelector((state: RootState) => state.note.filters);

  interface Tab {
    tab?: number | undefined;
  }

  const loadNotes = useCallback(
    async ({ tab = 0 }: Tab) => {
      try {
        dispatch(setLoading(true));
        const { data } = await axiosInstance.get('/posts');
        const processedData = data.map((item: any) => ({
          ...item,
          objData:
            typeof item.objData === 'string' && item.objData.length > 0 && item.objData[0] === '{'
              ? JSON.parse(item.objData)
              : item.objData,
        }));

        dispatch(setNeswletterList(processedData));
        dispatch(setShowEditor(false));
        dispatch(setselectedTab(tab));

        if (tab === 0) {
          handleFilters('state', 'DRAFT');
        } else if (tab === 1) {
          handleFilters('state', 'REVIEW');
        } else if (tab === 2) {
          handleFilters('state', 'APPROVED');
        } else if (tab === 3) {
          handleFilters('state', 'PUBLISHED');
        } else if (tab === 4) {
          handleFilters('publishOnAdac');
        }

        dispatch(setLoading(false));
        navigate.push('/dashboard/create_note');
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    },
    [axiosInstance, dispatch, navigate]
  );

  const handleFilters = useCallback((name: string, value?: NewslettersFilterValue) => {
    dispatch(
      setFilters({
        ...filters,
        [name]: value,
        ...(name === 'state' && { publishOnAdac: false, state: value }),
        ...(name === 'publishOnAdac' && { publishOnAdac: true, state: ['PUBLISHED', 'APPROVED'] }),
      })
    );
  }, []);

  const handleResetFilters = useCallback(() => {
    dispatch(
      setFilters({
        state: 'DRAFT',
        publishOnAdac: false,
      })
    );
  }, []);

  return { loadNotes, handleFilters, handleResetFilters };
};

export default useNotes;
