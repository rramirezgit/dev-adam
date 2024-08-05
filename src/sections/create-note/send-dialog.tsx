import * as Yup from 'yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setEmails } from 'src/store/slices/note';
import Iconify from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleclickSaved: (e: any) => Promise<void>;
  title: string;
  successTitle: string;
  titleSend: string;
}

export default function SendDialog({
  open,
  setOpen,
  handleclickSaved,
  title,
  successTitle,
  titleSend,
}: Props) {
  const [errorsEmails, setErrorsEmails] = useState<string[]>([]);
  const [emailslocal, setEmailsLocal] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const theme = useTheme();

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
          <DialogTitle align="center">{title}</DialogTitle>
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
                onClick={async (e) => {
                  setLoading(true);
                  await handleclickSaved(e);
                  setSuccess(true);
                  setLoading(false);
                }}
                sx={{
                  width: '180px',
                }}
              >
                {titleSend}
              </LoadingButton>
            </Box>
          </DialogActions>
        </>
      ) : (
        <DialogContent>
          <DialogTitle align="center">{successTitle}</DialogTitle>
          <DialogContentText> Proceso exitoso</DialogContentText>

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
