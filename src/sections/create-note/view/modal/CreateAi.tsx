import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function NoteDialog({
  open,
  setOpen,
  title,
  subTitle,
  submitTitle,
  onSubmit,
  labelInput,
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
        <TextField
          autoFocus
          margin="dense"
          required
          id="prompt"
          name="prompt"
          label={labelInput}
          type="text"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">{submitTitle}</Button>
      </DialogActions>
    </Dialog>
  );
}
