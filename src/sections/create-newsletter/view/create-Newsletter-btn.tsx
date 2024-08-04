import { Box, Button, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
  setShowEditor,
  setSubject,
  setcurrentNewsletter,
  setcurrentNewsletterID,
} from 'src/store/slices/newsletterStore';
import { headerContent } from '../templates/header/header-content';
import { FooterContent } from '../templates/footer/footer-content';

export default function CreateNewsletterButton() {
  const dispatch = useDispatch();
  return (
    <Box>
      <Stack direction="row" spacing={2}>
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
