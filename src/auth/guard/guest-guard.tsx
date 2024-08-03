'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import useAuth0Store from 'src/store/auth0Store';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: Props) {
  const router = useRouter();

  const { isAuthenticated, isLoading } = useAuth0Store();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const returnTo = CONFIG.auth.redirectPath;

  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated) {
      router.replace(returnTo);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
