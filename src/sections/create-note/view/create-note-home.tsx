'use client';

/* eslint-disable arrow-body-style */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useMemo, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import { Box, FormControlLabel, Switch, Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';

// routes
import { paths } from 'src/routes/paths';
// utils
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { useSettingsContext } from 'src/components/settings';
import { useBoolean } from 'src/hooks/use-boolean';

import { SOCIALNETWORKS } from 'src/const/post/redes';
// types
import EmptyContent from 'src/components/empty-content/empty-content';
//
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilters,
  setShowEditor,
  setcurrentNota,
  setcurrentNotaID,
  setselectedTab,
} from 'src/store/slices/noteStore';
import { SplashScreen } from 'src/components/loading-screen';
import { useParams } from 'next/navigation';
import { useAuthContext } from 'src/auth/hooks';
import { RootState } from 'src/store';
import CreateNotaButton from './create-note-btn';
import PostSearch from '../post-search';
import CreateNota from './create-note';
import Newsfilter from '../Nota-filter';
import NotaList from '../Nota-list';
import OptionsCreateNota from './OptionsCreateNota';
import NotaFiltersResult from '../Nota-filters-result';
import useNotes from './useNotes';
import ArticlesTable from './view-table';
import { DashboardContent } from 'src/layouts/dashboard';

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
  const neswletterListData = useSelector((state: RootState) => state.note.neswletterList);
  const showEditor = useSelector((state: RootState) => state.note.showEditor);

  const [viewTable, setViewTable] = useState(false);

  const router = useParams<any>();

  const { userAuth0 } = useSelector((state: RootState) => state.auth);

  const { NotaId, action } = router;

  const settings = useSettingsContext();

  const { loadNotes, handleFilters, handleResetFilters } = useNotes();

  const dispatch = useDispatch();

  const openFilters = useBoolean();

  // const [filters, setFilters] = useState(defaultFilters);

  const selectedTab = useSelector((state: RootState) => state.note.selectedTab);
  const loading = useSelector((state: RootState) => state.note.loading);
  const filters = useSelector((state: RootState) => state.note.filters);

  useEffect(() => {
    if (neswletterListData.length > 0 && NotaId && action === 'request-approval') {
      const newCurrentNota = neswletterListData.find((news) => news.id === NotaId);
      if (newCurrentNota) {
        const dataNews =
          typeof newCurrentNota.objData === 'string'
            ? newCurrentNota.objData !== '' && newCurrentNota.objData.startsWith('[')
              ? JSON.parse(newCurrentNota.objData)
              : null
            : newCurrentNota.objData;
        dispatch(setcurrentNota(dataNews));
        dispatch(setcurrentNotaID(NotaId as string));
        dispatch(setShowEditor(true));
      }
    }

    const dataLocal = localStorage.getItem('viewTable');
    if (dataLocal) {
      setViewTable(JSON.parse(dataLocal).viewTable);
    }
  }, [neswletterListData, NotaId, action, dispatch]);

  const mdUp = useResponsive('up', 'md');

  const [search, setSearch] = useState<{ query: string; results: any[] }>({
    query: '',
    results: [],
  });

  const handleSearch = useCallback(
    (inputValue: string) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = neswletterListData.filter(
          (news) => news.title?.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
        );

        setSearch((prevState) => ({
          ...prevState,
          results,
        }));
      }
    },
    [neswletterListData]
  );

  const renderFilters = useMemo(
    () => (
      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
      >
        <Stack
          direction="row"
          spacing={1}
          flexShrink={0}
          sx={{
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Newsfilter
            open={openFilters.value}
            onOpen={openFilters.onTrue}
            onClose={openFilters.onFalse}
            //
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={!!filters.creationDate || !!filters.origin}
            onResetFilters={handleResetFilters}
            dateError={filters?.creationDate ? filters.creationDate > new Date() : false}
          />
          <CreateNotaButton />
        </Stack>
      </Stack>
    ),
    [
      search.query,
      search.results,
      handleSearch,
      filters,
      openFilters,
      handleFilters,
      handleResetFilters,
    ]
  );

  const dataFiltered = useMemo(() => {
    const { creationDate, state, publishOnAdac, origin } = filters;
    let filteredData = neswletterListData;

    if (creationDate) {
      filteredData = filteredData.filter((Nota) => Nota?.creationDate === creationDate);
    }
    if (state) {
      filteredData = filteredData.filter((Nota) => state.includes(Nota?.status));
    }

    if (origin) {
      filteredData = filteredData.filter((Nota) => Nota?.origin === origin);
    }

    // filteredData = filteredData.filter((Nota) => Nota?.publishOnAdac === publishOnAdac);

    return filteredData.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [neswletterListData, filters]);

  const renderResults = useMemo(
    () => (
      <NotaFiltersResult
        filters={filters}
        onResetFilters={handleResetFilters}
        //
        canReset={!!filters.creationDate || !!filters.origin}
        onFilters={handleFilters}
        //
        results={dataFiltered.length}
      />
    ),
    [filters, handleResetFilters, handleFilters, dataFiltered.length]
  );

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

  useEffect(() => {
    loadNotes({
      tab: selectedTab,
    });
  }, [loadNotes]);

  const counterNotaPerState = useCallback(
    /// no deberia mostar las notas de ADAC
    (state: string) => {
      return neswletterListData.filter((news) => news.status === state).length;
    },
    [neswletterListData]
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
      }}
    >
      <Box
        sx={{
          width: '100%',
        }}
      >
        {!showEditor ? (
          <>
            {/* <CustomBreadcrumbs
              heading="Crea una Nota"
              links={[{ name: 'ADAM', href: '#' }, { name: 'Crea una nota' }]}
              action={mdUp ? <CreateNotaButton /> : null}
              sx={{
                mb: { xs: 3, md: 5 },
              }}
            /> */}
            {/* Filters */}
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
                  label="Tabla"
                />
                {viewTable && <CreateNotaButton />}
              </Stack>
              {!viewTable && renderFilters}

              {renderTabs}
              {!!filters.creationDate || !!filters.origin ? renderResults : null}
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
