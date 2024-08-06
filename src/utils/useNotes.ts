/* eslint-disable @typescript-eslint/dot-notation */
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilters,
  setLoading,
  setnoteList,
  setselectedTab,
  setShowEditor,
  fetchNotes,
  deleteNote,
} from 'src/store/slices/noteStore';
import { useRouter } from 'src/routes/hooks';
import { useCallback } from 'react';
import { AppDispatch, RootState } from 'src/store';
import { NewslettersFilterValue } from 'src/types/newsletter';

const useNotes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useRouter();

  const filters = useSelector((state: RootState) => state.note.filters);

  interface Tab {
    tab?: number | undefined;
  }

  const loadNotes = useCallback(
    async ({ tab = 0 }: Tab) => {
      try {
        dispatch(setLoading(true));
        await dispatch(fetchNotes());
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
        navigate.push('/dashboard/create-note');
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    },
    [dispatch, navigate]
  );

  const handleFilters = useCallback(
    (name: string, value?: NewslettersFilterValue) => {
      dispatch(
        setFilters({
          ...filters,
          [name]: value,
          ...(name === 'state' && { publishOnAdac: false, state: value }),
          ...(name === 'publishOnAdac' && {
            publishOnAdac: true,
            state: ['PUBLISHED', 'APPROVED'],
          }),
        })
      );
    },
    [dispatch, filters]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(
      setFilters({
        state: 'DRAFT',
        publishOnAdac: false,
      })
    );
  }, [dispatch]);

  const deleteNota = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteNote(id));
        await loadNotes({ tab: 0 });
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    },
    [dispatch]
  );

  return { loadNotes, handleFilters, handleResetFilters, deleteNota };
};

export default useNotes;
