import * as Yup from 'yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Iconify } from 'src/components/iconify';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  sendEmail: (s: string) => Promise<void>;
}

export default function SendDialogSubs({ open, setOpen, sendEmail }: Props) {
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const theme = useTheme();

  const handleClose = () => {
    setSuccess(false);
    setOpen(false);
  };

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      await sendEmail('subscriptores');
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {!success ? (
        <DialogTitle sx={{ minHeight: 76, padding: theme.spacing(5) }}>
          <Stack direction="column" justifyContent="space-between">
            <Typography variant="h6" sx={{ textAlign: 'center', mb: theme.spacing(5) }}>
              ¿Deseas enviar a los SUBSCRIPTORES?
            </Typography>
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                color="primary"
                sx={{
                  height: '48px',
                  padding: theme.spacing(0, 7),
                  fontSize: { xs: '12px', md: '16px' },
                }}
              >
                Descartar
              </Button>
              <LoadingButton
                variant="contained"
                color="primary"
                loading={loading}
                onClick={handleSendEmail}
                sx={{ width: '180px' }}
              >
                Aceptar
              </LoadingButton>
            </Stack>
          </Stack>
        </DialogTitle>
      ) : (
        <DialogContent>
          <DialogTitle align="center">Nota Enviado</DialogTitle>
          <DialogContentText align="center">
            La nota se envió correctamente a los Subscriptores.
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
                onClick={handleClose}
                sx={{ width: '180px' }}
              >
                Aceptar
              </Button>
            </Box>
          </DialogActions>
        </DialogContent>
      )}
    </Dialog>
  );
}
