import type { PopoverProps } from '@mui/material/Popover';

import { useState, useCallback } from 'react';

import type { UsePopoverReturn } from './types';

// ----------------------------------------------------------------------

export function usePopover(): UsePopoverReturn {
  const [anchorEl, setAnchorEl] = useState<PopoverProps['anchorEl']>(null);

  const onOpen = useCallback((event: any) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return {
    open: !!anchorEl,
    anchorEl,
    onOpen,
    onClose,
    setAnchorEl,
  };
}
