import type { RootState } from 'src/store';
import type { INotaNames } from 'src/types/Nota';

import { useDispatch, useSelector } from 'react-redux';

import { Box, Grid, useTheme, Typography } from '@mui/material';

import uuidv4 from 'src/utils/uuidv4';

import { setMenu, setHeader, setcurrentNota } from 'src/store/slices/noteStore';
import { NEWSLETTERS_TEMPLATES_LIST_MENU } from 'src/const/neswletter/templates';

import { TEMPLATES_WITH_CONTENT } from '../../templates';

export default function AddTemplateMenu() {
  const theme = useTheme();

  const dispatch = useDispatch();

  const currentNota = useSelector((state: RootState) => state.note.currentNota);
  const haveheader = useSelector((state: RootState) => state.note.header);

  const handleClickTemplate = (name: INotaNames) => {
    if (name === 'Header') {
      dispatch(setHeader(true));
    }
    dispatch(setMenu({ type: 'none' }));

    const id = uuidv4();

    const indexFooter = currentNota.findIndex((item) => item.templateId === 'footer');

    const newNota = [
      ...currentNota.slice(0, indexFooter), // header
      TEMPLATES_WITH_CONTENT(`${name}-${id}`)[name],
      ...currentNota.slice(indexFooter), // footer
    ];

    dispatch(setcurrentNota(newNota));
  };

  return (
    <Grid container spacing={2}>
      {NEWSLETTERS_TEMPLATES_LIST_MENU.map((item, index) => {
        if (haveheader && item.name === 'Header') return null;
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
    </Grid>
  );
}
