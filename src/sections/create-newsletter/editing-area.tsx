/* eslint-disable no-return-assign */
import { Box } from '@mui/material';
import { useResponsive } from 'src/hooks/use-responsive';
import { HEADER } from 'src/layouts/config-layout';
import NewsletterBody from './newsletter-body';

export default function NewsletterEditingArea() {
  const smUp = useResponsive('up', 'sm');
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        height: `calc(100vh - ${HEADER.H_DESKTOP * 2.6}px)`,
        alignItems: 'center',
        border: !smUp ? 'none' : `1px solid ${theme.palette.divider}`,
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
