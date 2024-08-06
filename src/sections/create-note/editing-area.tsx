/* eslint-disable no-return-assign */
import { Box } from '@mui/material';
import { useResponsive } from 'src/hooks/use-responsive';
import NotaBody from './Nota-body';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

export default function NotaEditingArea() {
  const smUp = useResponsive('up', 'sm');

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        height: `calc(100vh - ${40 * 2.6}px)`,
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
      <NotaBody />
    </Box>
  );
}
