'use client';

/* eslint-disable arrow-body-style */
/* eslint-disable react-hooks/exhaustive-deps */
import type { RootState, AppDispatch } from 'src/store';

//
import { useDispatch, useSelector } from 'react-redux';
/* eslint-disable no-nested-ternary */
import { useMemo, useState, useEffect, useCallback } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import { Box, Tab, Tabs, Switch, FormControlLabel } from '@mui/material';

import useNotes from 'src/utils/useNotes';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  fetchNotes,
  setselectedTab,
} from 'src/store/slices/noteStore';

import { SplashScreen } from 'src/components/loading-screen';
// types
import EmptyContent from 'src/components/empty-content/empty-content';

import NotaList from '../Nota-list';
import CreateNota from './create-note';
import ArticlesTable from './view-table';
import CreateNotaButton from './create-note-btn';
import OptionsCreateNota from './OptionsCreateNota';

const whiteList = [
  '97.rramirez@gmail.com',
  'carolina.ruiz@adac.mx',
  'leonchavez@adac.mx',
  'rafamusi@adac.mx',
  'jolcusuario1@gmail.com',
];

const tabs = [
  {
    label: 'Borradores',
    value: 'DRAFT',
  },
  {
    label: 'Review',
    value: 'REVIEW',
  },
  {
    label: 'Aprobados',
    value: 'APPROVED',
  },
  {
    label: 'ADAC',
    value: 'PUBLISHED',
  },
];

export default function CreateNotaHome() {
  const { showEditor, selectedTab, loading, filters, noteList } = useSelector(
    (state: RootState) => state.note
  );

  const { userAuth0 } = useSelector((state: RootState) => state.auth);

  const [viewTable, setViewTable] = useState(false);

  const { handleFilters } = useNotes();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {}, []);

  const getData = async () => {
    if (selectedTab === 0) {
      handleFilters('state', 'DRAFT');
    } else if (selectedTab === 1) {
      handleFilters('state', 'REVIEW');
    } else if (selectedTab === 2) {
      handleFilters('state', 'APPROVED');
    } else if (selectedTab === 3) {
      handleFilters('state', 'PUBLISHED');
    } else if (selectedTab === 4) {
      handleFilters('publishOnAdac');
    }

    dispatch(fetchNotes());
  };

  useEffect(() => {
    if (!showEditor) {
      getData();
    }
  }, [showEditor]);

  const dataFiltered = useMemo(() => {
    const { state } = filters;

    let filteredData = noteList;

    if (state) {
      filteredData = filteredData.filter((Nota) => state.includes(Nota?.status));
    }

    return filteredData.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [noteList, filters]);

  const handleClickTab = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      dispatch(setselectedTab(newValue));

      if (newValue === 0) {
        handleFilters('state', 'DRAFT');
      } else if (newValue === 1) {
        handleFilters('state', 'REVIEW');
      } else if (newValue === 2) {
        handleFilters('state', 'APPROVED');
      } else if (newValue === 3) {
        handleFilters('state', 'PUBLISHED');
      } else if (newValue === 4) {
        handleFilters('publishOnAdac');
      }
    },
    [handleFilters]
  );

  const counterNotaPerState = useCallback(
    /// no deberia mostar las notas de ADAC
    (state: string) => {
      return noteList.filter((news) => news.status === state).length;
    },
    [noteList]
  );

  const renderTabs = useMemo(
    () => (
      <Tabs
        value={selectedTab}
        onChange={handleClickTab}
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: 'info.main',
          },
          '& .MuiTab-root': {
            color: 'text.secondary',
          },
          '& .Mui-selected': {
            color: 'info.main',
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={`${tab.label}${
              counterNotaPerState(tab.value) === 0 ? '' : `: ${counterNotaPerState(tab.value)}`
            }`}
          />
        ))}
      </Tabs>
    ),
    [selectedTab, handleClickTab, counterNotaPerState]
  );

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <DashboardContent
      maxWidth="xl"
      sx={{
        pb: !showEditor ? { xs: 10, md: 15 } : 0,
        minWidth: '565px',
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
        }}
      >
        {!showEditor ? (
          <>
            <Stack
              spacing={2.5}
              sx={{
                mb: { xs: 3, md: 2 },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  width: '100%',
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={viewTable}
                      onChange={() => {
                        setViewTable(!viewTable);
                        localStorage.setItem(
                          'viewTable',
                          JSON.stringify({ viewTable: !viewTable })
                        );
                      }}
                      name="Tabla"
                    />
                  }
                  label="Tabla y Filtros"
                />
                <CreateNotaButton />
              </Stack>

              {renderTabs}
            </Stack>
            {/* End Filters */}

            {dataFiltered.length > 0 ? (
              <>
                {viewTable ? (
                  <ArticlesTable articles={dataFiltered} />
                ) : (
                  <NotaList news={dataFiltered} />
                )}
              </>
            ) : (
              <EmptyContent title="No hay Notas 🤯" filled sx={{ py: 10 }} />
            )}
          </>
        ) : (
          <CreateNota />
        )}
      </Box>
      <Box sx={{ position: 'fixed', bottom: 0, right: 16 }}>
        {whiteList && userAuth0 && whiteList.includes(userAuth0.email) && <OptionsCreateNota />}
      </Box>
    </DashboardContent>
  );
}
