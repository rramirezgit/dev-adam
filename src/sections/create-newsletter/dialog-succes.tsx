import * as Yup from 'yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from '@mui/material';
import Iconify from 'src/components/iconify';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DialogoSucces({ open, setOpen }: Props) {
  const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogTitle align="center">Newsletter Enviado</DialogTitle>
        <DialogContentText align="center">
          El Newsletter se envió correctamente a los Subscriptores.
        </DialogContentText>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            mt: 3,
          }}
        >
          <Iconify
            icon="line-md:confirm-circle"
            width="150px"
            height="150px"
            color={theme.palette.success.main}
          />
        </Box>
        <DialogActions>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleClose}
              sx={{ width: '180px' }}
            >
              Aceptar
            </Button>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
