/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/dot-notation */
import type { RootState, AppDispatch } from 'src/store';
import type { NewslettersFilterValue } from 'src/types/newsletter';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useRouter } from 'src/routes/hooks';

import {
  setFilters,
  setLoading,
  fetchNotes,
  createNote,
  deleteNote,
  setShowEditor,
  setselectedTab,
} from 'src/store/slices/noteStore';

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
    [dispatch, loadNotes]
  );

  const createNotaAndReload = useCallback(
    async (postData: any) => {
      try {
        await dispatch(createNote(postData));
        await loadNotes({ tab: 0 });
      } catch (error) {
        console.error('Failed to create note:', error);
      }
    },
    [dispatch, loadNotes]
  );

  return {
    loadNotes,
    handleFilters,
    handleResetFilters,
    deleteNota,
    createNotaAndReload,
  };
};

export default useNotes;
