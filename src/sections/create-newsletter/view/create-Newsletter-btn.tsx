import { useDispatch } from 'react-redux';

import { Box, Stack, Button } from '@mui/material';

import {
  setSubject,
  setShowEditor,
  setcurrentNewsletter,
  setcurrentNewsletterID,
} from 'src/store/slices/newsletterStore';

import { headerContent } from '../templates/header/header-content';
import { FooterContent } from '../templates/footer/footer-content';

export default function CreateNewsletterButton() {
  const dispatch = useDispatch();
  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Button
          onClick={() => {
            dispatch(setcurrentNewsletter([headerContent('header'), FooterContent('footer')]));
            dispatch(setcurrentNewsletterID(''));
            dispatch(setShowEditor(true));
            dispatch(setSubject('ADAC'));
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
          Crear Newsletter
        </Button>
      </Stack>
    </Box>
  );
}
