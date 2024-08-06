/* eslint-disable arrow-body-style */
import { useCallback, useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setcurrentNewsletter, setHeader, setMenu } from 'src/store/slices/newsletterStore';
import { NEWSLETTERS_TEMPLATES_LIST_MENU } from 'src/const/neswletter/templates';
import { TEMPLATES_WITH_CONTENT } from '../../templates';
import { useAxios } from 'src/auth/axios/axios-provider';
import { RootState } from 'src/store';
import { INewslettersNames } from 'src/types/newsletter';
import NotaCardItem from 'src/components/Nota-card-item';
import uuidv4 from 'src/utils/uuidv4';

export default function AddTemplateMenu() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState('create');
  const [notes, setNotes] = useState([]);
  const dispatch = useDispatch();
  const axiosInstance = useAxios();
  const currentNewsletter = useSelector((state: RootState) => state.newsletter.currentNewsletter);
  const haveHeader = useSelector((state: RootState) => state.newsletter.header);

  const [loading, setLoading] = useState(false);

  const handleClickTemplate = (name: INewslettersNames) => {
    if (name === 'Header') {
      dispatch(setHeader(true));
    }
    dispatch(setMenu({ type: 'none' }));

    const id = uuidv4();
    const indexFooter = currentNewsletter.findIndex((item) => item.templateId === 'footer');

    const newNewsletter = [
      ...currentNewsletter.slice(0, indexFooter),
      TEMPLATES_WITH_CONTENT(`${name}-${id}`)[name],
      ...currentNewsletter.slice(indexFooter),
    ];

    dispatch(setcurrentNewsletter(newNewsletter));
  };

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const getNotes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/posts');
      setLoading(false);

      const { data } = response;
      const processedData = data.filter(
        (item: any) => item.status === 'PUBLISHED' || item.status === 'APPROVED'
      );
      setNotes(processedData);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  }, [axiosInstance]);

  useEffect(() => {
    if (currentTab === 'saved' || currentTab === 'AI') {
      getNotes();
    }
  }, [currentTab, getNotes]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: 2, width: 1, paddingLeft: 2 }}>
        <Tab value="create" label="Crear template" />
        <Tab value="saved" label="Notas" />
        <Tab value="AI" label="Notas AI 🤖" />
      </Tabs>
      {currentTab === 'create' && (
        <>
          {NEWSLETTERS_TEMPLATES_LIST_MENU.map((item, index) => {
            if (haveHeader && item.name === 'Header') return null;
            return (
              <Grid item xs={6} key={index}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      mb: 1,
                      ml: 1,
                      fontWeight: 350,
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Box
                    onClick={() => handleClickTemplate(item.name)}
                    sx={{
                      background: `url(/assets/icons/newsletter/${item.name}.svg) no-repeat center`,
                      backgroundSize: 'cover',
                      width: 172,
                      height: 149,
                      cursor: 'pointer',
                      '&:hover': {
                        border: `2px solid ${theme.palette.primary.main}`,
                        borderRadius: '16px',
                      },
                    }}
                  />
                </Box>
              </Grid>
            );
          })}
        </>
      )}

      {currentTab === 'saved' && (
        <>
          {notes.map((item: any, index: number) => {
            if (item.origin === 'AI') return null;

            return (
              <Grid item xs={6} key={index}>
                <NotaCardItem Nota={item} preview />
              </Grid>
            );
          })}
        </>
      )}

      {currentTab === 'AI' && (
        <>
          {notes.map((item: any, index: number) => {
            if (item.origin !== 'AI') return null;
            return (
              <Grid item xs={6} key={index}>
                <NotaCardItem Nota={item} preview />
              </Grid>
            );
          })}
        </>
      )}
    </Grid>
  );
}
