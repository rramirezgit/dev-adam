/* eslint-disable perfectionist/sort-imports */

'use client';

import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import 'dayjs/locale/fr';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/ar-sa';

import dayjs from 'dayjs';

import { LocalizationProvider as Provider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function LocalizationProvider({ children }: Props) {
  dayjs.locale('es');

  return (
    <Provider dateAdapter={AdapterDayjs} adapterLocale="es">
      {children}
    </Provider>
  );
}
