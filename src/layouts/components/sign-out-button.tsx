import type { ButtonProps } from '@mui/material/Button';
import type { Theme, SxProps } from '@mui/material/styles';

import { useCallback } from 'react';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { AppDispatch, RootState } from 'src/store';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'src/store/slices/auth0Store';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  sx?: SxProps<Theme>;
  onClose?: () => void;
};

export function SignOutButton({ onClose, ...other }: Props) {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  // const { checkUserSession } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      dispatch(logout());
      // await checkUserSession?.();

      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [onClose, router]);

  return (
    <Button fullWidth variant="soft" size="large" color="error" onClick={handleLogout} {...other}>
      Logout
    </Button>
  );
}
