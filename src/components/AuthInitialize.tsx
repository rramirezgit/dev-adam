'use client';

import React, { useEffect } from 'react';

import { SplashScreen } from './loading-screen';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import { initializeAuth } from 'src/store/slices/auth0Store';

interface Props {
  children: React.ReactNode;
}

const AuthInitialize = ({ children }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  useEffect(() => {
    dispatch(initializeAuth());
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
};

export default AuthInitialize;
