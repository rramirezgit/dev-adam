/* eslint-disable no-nested-ternary */
import { Button, ListItemText, MenuItem, SxProps } from '@mui/material';
import React from 'react';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';

interface Props {
  Nota: any;
  onChange: (value: string) => void;
  sx?: SxProps;
}

const StateBtn = ({ Nota, onChange, sx }: Props) => {
  const popover = usePopover();

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
    }
    return true;
  };
  return (
    <>
      <Button
        onClickCapture={(e: React.MouseEvent<HTMLElement>) => {
          popover.onOpen(e);
        }}
        disabled={!Nota?.status}
        endIcon={
          <Iconify
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
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
      <CustomPopover open={popover.open} onClose={popover.onClose} anchorEl={popover.anchorEl}>
        <MenuItem onClick={() => onChange('DRAFT')} disabled={disabledItemMenu('DRAFT')}>
          <ListItemText>DRAFT</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => onChange('REVIEW')} disabled={disabledItemMenu('REVIEW')}>
          <ListItemText>REVIEW</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => onChange('APPROVED')} disabled={disabledItemMenu('APPROVED')}>
          <ListItemText>APPROVED</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => onChange('PUBLISHED')} disabled={disabledItemMenu('PUBLISHED')}>
          <ListItemText>PUBLISHED</ListItemText>
        </MenuItem>
      </CustomPopover>
    </>
  );
};

export default StateBtn;
