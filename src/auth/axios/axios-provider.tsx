/* eslint-disable react/jsx-no-constructed-context-values */

'use client';

import type { AxiosInstance } from 'axios';
import type { RootState } from 'src/store';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { useMemo, useContext } from 'react';

// config
import { AxiosContext } from './axios-context';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
