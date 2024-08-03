'use client';

import React, { useEffect } from 'react';

import useAuth0Store from 'src/store/auth0Store';

import { SplashScreen } from './loading-screen';

interface Props {
  children: React.ReactNode;
}

const AuthInitialize = ({ children }: Props) => {
  const { isLoading, initializeAuth, isAuthenticated } = useAuth0Store();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
};

export default AuthInitialize;
