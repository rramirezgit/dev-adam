import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  useTheme,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { setEmails } from 'src/store/slices/newsletterStore';

import { Iconify } from 'src/components/iconify';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleclickRevision: () => Promise<void>;
}

export default function SendDialog({ open, setOpen, handleclickRevision }: Props) {
  const [errorsEmails, setErrorsEmails] = useState<string[]>([]);
  const [emailslocal, setEmailsLocal] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const theme = useTheme();

  const handlechangeEmails = (e: any) => {
    const emails = e.target.value.split(';').map((item: string) => item.trim());

    Yup.array()
      .of(Yup.string().email('Correo no válido, si son varios separar por ";"'))
      .validate(emails)
      .then((value) => {
        setErrorsEmails([]);

        if (value && value?.length === 1 && value[0] === '') {
          dispatch(setEmails([]));
          setEmailsLocal([]);
          return;
        }

        if (Array.isArray(value) && value !== undefined) {
          dispatch(setEmails(value as string[]));
          setEmailsLocal(value as string[]);
        }
      })
      .catch((err) => {
        setErrorsEmails(err.errors);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setSuccess(false);
        setOpen(false);
      }}
    >
      {!success ? (
        <>
          <DialogTitle align="center">Enviar prueba del Newsletter</DialogTitle>
          <DialogContent>
            <DialogContentText>
              A los siguientes correos le llegará el Newsletter para su revisión:
            </DialogContentText>
            <Box
              noValidate
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                m: 'auto',
                width: '80%',
              }}
            >
              <TextField
                id="max-width"
                type="email"
                placeholder="test@gmail.com;prueba@gmail.com"
                onChange={handlechangeEmails}
                fullWidth
                sx={{
                  marginTop: '10px',
                  width: '100%',
                }}
              />
              <Box>
                {errorsEmails.map((item) => (
                  <Box
                    sx={{
                      margin: '5px auto',
                      maxWidth: '100%',
                      fontSize: '12px',
                      color: 'red',
                      '&:hover': {
                        transition: 'all 0.3s ease',
                      },
                    }}
                    key={item}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>
          </DialogContent>
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
                variant="outlined"
                onClick={() => setOpen(false)}
                sx={{
                  width: '180px',
                }}
              >
                Cancelar
              </Button>
              <LoadingButton
                variant="contained"
                color="primary"
                loading={loading}
                disabled={errorsEmails.length !== 0 || emailslocal.length === 0}
                onClick={async () => {
                  if (errorsEmails.length !== 0) return;
                  if (emailslocal.length === 0) return;
                  setLoading(true);
                  await handleclickRevision();
                  setSuccess(true);
                  setLoading(false);
                }}
                sx={{
                  width: '180px',
                }}
              >
                Enviar
              </LoadingButton>
            </Box>
          </DialogActions>
        </>
      ) : (
        <DialogContent>
          <DialogTitle align="center"> Newsletter Enviado</DialogTitle>
          <DialogContentText>
            El Newsletter se envió correctamente a los correos indicados
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
                onClick={() => {
                  setSuccess(false);
                  setOpen(false);
                }}
                sx={{
                  width: '180px',
                }}
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
