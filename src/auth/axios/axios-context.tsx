'use client';

//
import type { AxiosInstance } from 'axios';

import { createContext } from 'react';

// ----------------------------------------------------------------------

interface AxiosContextType {
  axiosInstance: AxiosInstance;
}

export const AxiosContext = createContext({} as AxiosContextType);
