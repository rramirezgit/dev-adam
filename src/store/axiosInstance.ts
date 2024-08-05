// axiosInstance.ts
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '.';

export const createAxiosInstance = () => {
  const accessToken = localStorage.getItem('accessToken');
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};
