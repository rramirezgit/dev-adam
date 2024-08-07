'use client';

import type { RootState, AppDispatch } from 'src/store';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { initializeAuth } from 'src/store/slices/auth0Store';

import { SplashScreen } from './loading-screen';

interface Props {
  children: React.ReactNode;
}

const AuthInitialize = ({ children }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  useEffect(() => {
    dispatch(initializeAuth());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
};

export default AuthInitialize;
