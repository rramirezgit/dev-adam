'use client';

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import { Box, Tab, Tabs } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';
// utils
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { useBoolean } from 'src/hooks/use-boolean';

//
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
import Newsfilter from '../newsletter-filter';
import NewsletterFiltersResult from '../newsletter-filters-result';
import CreateNewsletter from './create-newsletter';
import {
  INewslettersFilters,
  newsletterItemList,
  NewslettersFilterValue,
} from 'src/types/newsletter';
import { useAxios } from 'src/auth/axios/axios-provider';
import { AppDispatch, RootState } from 'src/store';
import EmptyContent from 'src/components/empty-content/empty-content';
import { DashboardContent } from 'src/layouts/dashboard';

const defaultFilters: INewslettersFilters = {
  creationDate: null,
  state: 'sended',
};

export default function CreateNewsletterHome() {
  const neswletterListData = useSelector((state: RootState) => state.newsletter.newsletterList);
  const showEditor = useSelector((state: RootState) => state.newsletter.showEditor);
  const deleted = useSelector((state: RootState) => state.newsletter.deleted);
  const isLoading = useSelector((state: RootState) => state.newsletter.isLoading);

  const params = useParams<any>();

  const { NewsletterId, action } = params;

  const distpach = useDispatch<AppDispatch>();

  const openFilters = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (neswletterListData.length > 0 && NewsletterId && action === 'request-approval') {
      const newCurrentNewsletter = neswletterListData.find((news) => news.id === NewsletterId);
      if (!newCurrentNewsletter) return;

      const dataNews =
        typeof newCurrentNewsletter.objData === 'string'
          ? newCurrentNewsletter.objData !== '' && newCurrentNewsletter.objData.startsWith('[')
            ? JSON.parse(newCurrentNewsletter.objData)
            : null
          : newCurrentNewsletter.objData;
      distpach(setcurrentNewsletter(dataNews));
      distpach(setcurrentNewsletterID(NewsletterId as string));
      distpach(setShowEditor(true));
    }
  }, [neswletterListData, NewsletterId, action]);

  const getData = async () => {
    if (selectedTab === 0) {
      handleFilters('state', 'DRAFT');
    }

    if (selectedTab === 1) {
      handleFilters('state', 'PENDING_APPROVAL');
    }

    if (selectedTab === 2) {
      handleFilters('state', 'APPROVED');
    }

    if (selectedTab === 3) {
      handleFilters('state', 'REJECTED');
    }

    if (selectedTab === 4) {
      handleFilters('state', 'SENDED');
    }

    distpach(fetchNewsletters());
  };

  useEffect(() => {
    if (!showEditor || deleted) {
      getData();
      distpach(setDeleted(false));
    }
  }, [showEditor, deleted]);

  const canReset = !!filters.creationDate;

  const dateError = filters?.creationDate ? filters.creationDate > new Date() : false;

  const dataFiltered = applyFilter({
    inputData: neswletterListData,
    filters,
    dateError,
  });

  const handleFilters = useCallback((name: string, value: NewslettersFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const mdUp = useResponsive('up', 'md');

  const [search, setSearch] = useState<{ query: string; results: any[] }>({
    query: '',
    results: [],
  });

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleSearch = useCallback(
    (inputValue: string) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = neswletterListData.filter(
          (news) => news.subject?.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
        );

        setSearch((prevState) => ({
          ...prevState,
          results,
        }));
      }
    },
    [search.query]
  );

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <Stack direction="row" spacing={1} flexShrink={0} justifyContent="space-between" width={1}>
        <Newsfilter
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          //
          filters={filters}
          onFilters={handleFilters}
          // socialNetworks={SOCIALNETWORKS}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
          dateError={dateError}
        />
        <CreateNewsletterButton />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <NewsletterFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  const handleClickTab = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);

    if (newValue === 0) {
      handleFilters('state', 'DRAFT');
    }

    if (newValue === 1) {
      handleFilters('state', 'PENDING_APPROVAL');
    }

    if (newValue === 2) {
      handleFilters('state', 'APPROVED');
    }

    if (newValue === 3) {
      handleFilters('state', 'REJECTED');
    }

    if (newValue === 4) {
      handleFilters('state', 'SCHEDULED');
    }

    if (newValue === 5) {
      handleFilters('state', 'SENDED');
    }
  };

  const counterNewsletterPerState = (state: string) =>
    neswletterListData.filter((news) => news.status === state).length;

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
      <Tab
        label={`Borradores${
          counterNewsletterPerState('DRAFT') === 0 ? '' : `: ${counterNewsletterPerState('DRAFT')}`
        }`}
      />
      <Tab
        label={`Pendientes${
          counterNewsletterPerState('PENDING_APPROVAL') === 0
            ? ''
            : `: ${counterNewsletterPerState('PENDING_APPROVAL')}`
        }`}
      />
      <Tab
        label={`Aprobados${
          counterNewsletterPerState('APPROVED') === 0
            ? ''
            : `: ${counterNewsletterPerState('APPROVED')}`
        }`}
      />
      <Tab
        label={`Rechazados${
          counterNewsletterPerState('REJECTED') === 0
            ? ''
            : `: ${counterNewsletterPerState('REJECTED')}`
        }`}
      />
      <Tab
        label={`Programados${
          counterNewsletterPerState('SCHEDULED') === 0
            ? ''
            : `: ${counterNewsletterPerState('SCHEDULED')}`
        }`}
      />
      <Tab
        label={`Enviados${
          counterNewsletterPerState('SENDED') === 0
            ? ''
            : `: ${counterNewsletterPerState('SENDED')}`
        }`}
      />
    </Tabs>
  );

  if (isLoading) {
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
              heading={t('Dashboard.Create_Newsletter.Title')}
              links={[
                { name: 'ADAM', href: '#' },
                { name: t('Dashboard.Create_Newsletter.Title') },
              ]}
              action={mdUp ? <CreateNewsletterButton /> : null}
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
              {renderFilters}
              {renderTabs}
              {canReset && renderResults}
              {!mdUp ? <CreateNewsletterButton /> : null}
            </Stack>
            {/* End Filters */}

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

const applyFilter = ({
  inputData,
  filters,
  dateError,
}: {
  inputData: newsletterItemList[];
  filters: INewslettersFilters;
  dateError: boolean;
}) => {
  const { creationDate, state } = filters;

  // if (!dateError) {
  //   if (startDate && endDate) {
  //     inputData = inputData.filter(
  //       (post) =>
  //         fTimestamp(post?.creationDate) >= fTimestamp(startDate) &&
  //         fTimestamp(post?.creationDate) <= fTimestamp(endDate)
  //     );
  //   }
  // }

  // if (socialNetworks.length) {
  //   inputData = inputData.filter((post) =>
  //     socialNetworks.some((social) => post?.platforms?.includes(social))
  //   );
  // }
  if (creationDate) {
    inputData = inputData.filter((newsletter) => newsletter?.creationDate === creationDate);
  }

  if (state) {
    inputData = inputData.filter((newsletter) => newsletter?.status === state);
  }

  return inputData.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
