/* eslint-disable react/jsx-no-constructed-context-values */

'use client';

import { useContext, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios, { AxiosInstance } from 'axios';
// config
import { AxiosContext } from './axios-context';
import auth0Store from 'src/store/slices/auth0Store';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
//

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

function AxiosProviderWrapper({ children }: Props) {
  const { accessToken, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
      },
    });

    instance.interceptors.request.use(
      async (config) => {
        if (isAuthenticated) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, [isAuthenticated]);
  return <AxiosContext.Provider value={{ axiosInstance }}>{children}</AxiosContext.Provider>;
}

// ----------------------------------------------------------------------

export const AxiosProvider = ({ children }: Props) => (
  <AxiosProviderWrapper>{children}</AxiosProviderWrapper>
);

export const useAxios = (): AxiosInstance => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error('useAxios must be used within an AxiosProvider');
  }
  return context.axiosInstance;
};
