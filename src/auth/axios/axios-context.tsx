'use client';

import { createContext } from 'react';
//
import { AxiosInstance } from 'axios';

// ----------------------------------------------------------------------

interface AxiosContextType {
  axiosInstance: AxiosInstance;
}

export const AxiosContext = createContext({} as AxiosContextType);
