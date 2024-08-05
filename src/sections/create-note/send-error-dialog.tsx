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
import { Iconify } from 'src/components/iconify';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SendErrorDialog({ open, setOpen }: Props) {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent>
        <DialogTitle align="center"> La nota no se pudo enviar</DialogTitle>
        <DialogContentText>
          Existen errores en la nota, por favor revisar los errores
        </DialogContentText>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Iconify
            icon="line-md:cancel"
            width="150px"
            height="150px"
            color={theme.palette.error.main}
          />
        </Box>
        <DialogActions>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              onClick={() => setOpen(false)}
              sx={{
                width: '180px',
              }}
            >
              Aceptar
            </Button>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
