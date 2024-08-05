import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DialogAlert({
  open,
  setOpen,
  title,
  subTitle,
  submitTitle,
  onSubmit,
}: any) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit,
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit}>{submitTitle}</Button>
      </DialogActions>
    </Dialog>
  );
}
