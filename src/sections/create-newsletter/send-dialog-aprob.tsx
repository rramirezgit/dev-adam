import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  Checkbox,
  useTheme,
  FormGroup,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
  DialogContentText,
} from '@mui/material';

import { setEmailsAprob } from 'src/store/slices/newsletterStore';

import { Iconify } from 'src/components/iconify';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleclickRevision: () => Promise<void>;
}

export default function SendDialogAprob({ open, setOpen, handleclickRevision }: Props) {
  const [errorsEmails, setErrorsEmails] = useState<string[]>([]);
  const [emailslocal, setEmailsLocal] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const theme = useTheme();

  const handlechangeEmails = (e: any) => {
    const email = e.target.value;

    dispatch(setEmailsAprob([email]));
  };

  useEffect(() => {
    dispatch(setEmailsAprob(emailslocal));
  }, []);

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
          <DialogTitle align="center">Enviar a Aprobadores</DialogTitle>
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
              <FormGroup onChangeCapture={handlechangeEmails}>
                <FormControlLabel
                  control={<Checkbox value="rafamusi@adac.mx" />}
                  label="Rafael Musi"
                />
                <FormControlLabel
                  control={<Checkbox value="leonchavez@adac.mx" />}
                  label="Leon Chavez"
                />
                <FormControlLabel
                  control={<Checkbox value="carolina.ruiz@adac.mx" />}
                  label="Carolina Ruiz"
                />
                {/* <FormControlLabel
                  control={<Checkbox value="97.rramirez@gmail.com" />}
                  label="Ricardo (Pruebas desarrollo)"
                /> */}
              </FormGroup>
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
