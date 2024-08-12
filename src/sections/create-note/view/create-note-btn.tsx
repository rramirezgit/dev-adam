import { useDispatch } from 'react-redux';

import { Box, Stack, Button } from '@mui/material';

import {
  setMenu,
  setSubject,
  setShowEditor,
  setCoverImage,
  setcurrentNota,
  setcurrentNotaID,
  setcurrentNotaDescription,
} from 'src/store/slices/noteStore';

export default function CreateNotaButton() {
  const dispatch = useDispatch();
  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <Button
          onClick={() => {
            dispatch(setcurrentNota([]));
            dispatch(setcurrentNotaID(''));
            dispatch(setShowEditor(true));
            dispatch(setCoverImage(''));
            dispatch(setSubject('ADAC News'));
            dispatch(setcurrentNotaDescription(''));
            dispatch(setMenu({ type: 'add-template' }));
          }}
          variant="contained"
          color="primary"
          sx={{
            '&.MuiButton-root': {
              height: '48px',
              color: '#fff',
              fontSize: { xs: '12px', md: '16px' },
            },
          }}
        >
          Crear Nota
        </Button>
      </Stack>
    </Box>
  );
}
