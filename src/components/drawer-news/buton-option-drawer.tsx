import { Button, useTheme } from '@mui/material';
import React from 'react';
import { SvgColor } from '../svg-color';
import { useDispatch } from 'react-redux';
import { setShowSaved } from 'src/store/slices/noteStore';

function ButtonOption({
  onClick,
  title,
  iconSrc,
  index,
  sx,
}: {
  onClick: () => void;
  title: string;
  iconSrc: string;
  index: number;
  sx?: any;
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  return (
    <Button
      onClick={onClick}
      variant="contained"
      onMouseEnter={() => {
        dispatch(setShowSaved(false));
      }}
      startIcon={<SvgColor src={iconSrc} />}
      sx={{
        display: 'flex',
        height: '56px',
        gap: theme.spacing(2),
        width: '203px',
        padding: '16px 20px',
        alignItems: 'center',
        borderRadius: '8px',
        background: '#4418A2',
        color: '#fff',
        cursor: 'pointer',
        position: 'absolute',
        whiteSpace: 'nowrap',
        top: `${index === 0 ? '0px' : '65px'}`,
        right: '-180px',
        transition: 'all 0.3s ease',
        zIndex: 1,
        '& .text-btn-adac': {
          width: '100%',
          textAlign: 'left',
          opacity: 0,
        },
        '& span': {
          opacity: 0.5,
        },
        '&:hover': {
          right: '-45px',
          background: '#4418A2',

          '& span': {
            opacity: 1,
          },
        },
        ...sx,
      }}
    >
      <span className="text-btn-adac">{title}</span>
    </Button>
  );
}

export default ButtonOption;
