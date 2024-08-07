'use client';

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useState } from 'react';
import { Box, Tab, Tabs, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNewsletters,
  setDeleted,
  setShowEditor,
  setcurrentNewsletter,
  setcurrentNewsletterID,
} from 'src/store/slices/newsletterStore';
import { useParams } from 'src/routes/hooks';
import { SplashScreen } from 'src/components/loading-screen';
import CreateNewsletterButton from './create-Newsletter-btn';
import NewsletterList from '../newsletter-list';
import CreateNewsletter from './create-newsletter';
import {
  INewslettersFilters,
  newsletterItemList,
  NewslettersFilterValue,
} from 'src/types/newsletter';
import { AppDispatch, RootState } from 'src/store';
import EmptyContent from 'src/components/empty-content/empty-content';
import { DashboardContent } from 'src/layouts/dashboard';

const defaultFilters: INewslettersFilters = {
  creationDate: null,
  state: 'sended',
};

const STATES = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SCHEDULED', 'SENDED'];

export default function CreateNewsletterHome() {
  const neswletterListData = useSelector((state: RootState) => state.newsletter.newsletterList);
  const showEditor = useSelector((state: RootState) => state.newsletter.showEditor);
  const deleted = useSelector((state: RootState) => state.newsletter.deleted);
  const isLoading = useSelector((state: RootState) => state.newsletter.isLoading);

  const params = useParams<any>();
  const { NewsletterId, action } = params;

  const dispatch = useDispatch<AppDispatch>();

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (neswletterListData.length > 0 && NewsletterId && action === 'request-approval') {
      const newCurrentNewsletter = neswletterListData.find((news) => news.id === NewsletterId);
      if (!newCurrentNewsletter) return;

      const dataNews = parseObjData(newCurrentNewsletter.objData);
      dispatch(setcurrentNewsletter(dataNews));
      dispatch(setcurrentNewsletterID(NewsletterId));
      dispatch(setShowEditor(true));
    } else if (neswletterListData.length > 0 && NewsletterId && action === 'view') {
      const newCurrentNewsletter = neswletterListData.find((news) => news.id === NewsletterId);
      if (!newCurrentNewsletter) return;

      const dataNews = parseObjData(newCurrentNewsletter.objData);
      dispatch(setcurrentNewsletter(dataNews));
      dispatch(setcurrentNewsletterID(NewsletterId));
      dispatch(setShowEditor(true));
    }
  }, [neswletterListData, NewsletterId, action]);

  useEffect(() => {
    if (!showEditor || deleted) {
      getData();
      dispatch(setDeleted(false));
    }
  }, [showEditor, deleted]);

  const getData = useCallback(async () => {
    handleFiltersByTab(selectedTab);
    await dispatch(fetchNewsletters());
  }, [selectedTab, dispatch]);

  const handleFilters = useCallback((name: string, value: NewslettersFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleClickTab = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    handleFiltersByTab(newValue);
  }, []);

  const handleFiltersByTab = (tab: number) => {
    const state = STATES[tab];
    if (state) handleFilters('state', state);
  };

  const counterNewsletterPerState = (state: string) =>
    neswletterListData.filter((news) => news.status === state).length;

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'DRAFT':
        return 'Borradores';
      case 'PENDING_APPROVAL':
        return 'Pendientes';
      case 'APPROVED':
        return 'Aprobados';
      case 'REJECTED':
        return 'Rechazados';
      case 'SCHEDULED':
        return 'Programados';
      case 'SENDED':
        return 'Enviados';
      default:
        return '';
    }
  };

  const getStateCount = (state: string) => {
    const count = counterNewsletterPerState(state);
    return count === 0 ? '' : `: ${count}`;
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  const renderTabs = (
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
      {STATES.map((state, index) => (
        <Tab key={state} label={`${getStateLabel(state)}${getStateCount(state)}`} />
      ))}
    </Tabs>
  );

  const dateError = filters.creationDate ? filters.creationDate > new Date() : false;

  const dataFiltered = applyFilter({
    inputData: neswletterListData,
    filters,
    dateError,
  });

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
            <Stack
              spacing={2.5}
              sx={{
                mb: { xs: 3, md: 2 },
              }}
            >
              <CreateNewsletterButton />
              {renderTabs}
            </Stack>

            {dataFiltered.length > 0 ? (
              <NewsletterList news={dataFiltered} />
            ) : (
              <EmptyContent title="No hay newsletters 🤯" filled sx={{ py: 10 }} />
            )}
          </>
        ) : (
          <CreateNewsletter />
        )}
      </Box>
    </DashboardContent>
  );
}

const parseObjData = (objData: string | null) => {
  if (typeof objData === 'string') {
    if (objData !== '' && objData.startsWith('[')) {
      return JSON.parse(objData);
    }
  }
  return objData;
};

const applyFilter = ({
  inputData,
  filters,
  dateError,
}: {
  inputData: newsletterItemList[];
  filters: INewslettersFilters;
  dateError: boolean;
}) => {
  const { state } = filters;

  let filteredData = inputData;
  if (state) {
    filteredData = filteredData.filter((newsletter) => newsletter?.status === state);
  }

  return filteredData.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
