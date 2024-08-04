'use client';

// components
import { AxiosContext } from './axios-context';
//

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthConsumer({ children }: Props) {
  return <AxiosContext.Consumer>{(auth) => children}</AxiosContext.Consumer>;
}
