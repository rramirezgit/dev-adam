/* eslint-disable no-return-assign */
import { Box } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import NewsletterBody from './newsletter-body';

export default function NewsletterEditingArea() {
  const smUp = useResponsive('up', 'sm');
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: theme.transitions.create('all', {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.standard,
        }),
        borderRadius: theme.spacing(1),
        flexGrow: 1,
        padding: !smUp ? 0 : theme.spacing(2),
        gap: theme.spacing(2),
        overflowY: 'auto',
      })}
    >
      <NewsletterBody />
    </Box>
  );
}
