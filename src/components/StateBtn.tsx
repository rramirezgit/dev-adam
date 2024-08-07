/* eslint-disable no-nested-ternary */
import type { RootState } from 'src/store';
import type { SxProps} from '@mui/material';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Button, Popover, MenuItem, ListItemText } from '@mui/material';

import { Iconify } from './iconify';

interface Props {
  Nota: any;
  onChange: (value: string) => void;
  sx?: SxProps;
}

const StateBtn = ({ Nota, onChange, sx }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentNotaId = useSelector((state: RootState) => state.note.currentNotaId);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const disabledItemMenu = (item: string) => {
    if (Nota) {
      if (Nota.status === 'DRAFT') {
        if (item === 'REVIEW') {
          return false;
        }
      }
      if (Nota.status === 'REVIEW') {
        if (item === 'APPROVED' || item === 'DRAFT') {
          return false;
        }
      }
      if (Nota.status === 'APPROVED') {
        if (item === 'PUBLISHED' || item === 'REJECTED') {
          return false;
        }
      }
      if (Nota.status === 'PUBLISHED') {
        if (item === 'DRAFT' || item === 'REVIEW' || item === 'APPROVED' || item === 'REJECTED') {
          return false;
        }
      }
    } else if (item === 'REVIEW') {
      return false;
    }
    return true;
  };

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={
          <Iconify
            icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            width={15}
            height={15}
          />
        }
        variant="contained"
        color="inherit"
        sx={{
          height: '48px',
          fontSize: '12px',
          padding: '0 20px',
          ...sx,
        }}
      >
        {Nota?.status ? (Nota.status === 'PUBLISHED' ? 'PUBLISHED' : Nota.status) : 'Draft'}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            onChange('DRAFT');
            handleClose();
          }}
          disabled={disabledItemMenu('DRAFT')}
        >
          <ListItemText>DRAFT</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onChange('REVIEW');
            handleClose();
          }}
          disabled={disabledItemMenu('REVIEW')}
        >
          <ListItemText>REVIEW</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onChange('APPROVED');
            handleClose();
          }}
          disabled={disabledItemMenu('APPROVED')}
        >
          <ListItemText>APPROVED</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onChange('PUBLISHED');
            handleClose();
          }}
          disabled={disabledItemMenu('PUBLISHED')}
        >
          <ListItemText>PUBLISHED</ListItemText>
        </MenuItem>
      </Popover>
    </>
  );
};

export default StateBtn;
