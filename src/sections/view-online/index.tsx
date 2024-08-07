/* eslint-disable react/no-danger */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { Container } from '@mui/material';

import { SplashScreen } from 'src/components/loading-screen';

import { useAxios } from 'src/auth/axios/axios-provider';

export default function ViewOnline() {
  const [newsletterData, setNewsletterData] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();

  const params = useParams<any>();

  const { id } = params;

  useEffect(() => {
    axiosInstance.get(`newsletters/${id}`).then((res) => {
      setLoading(false);
      if (res.status === 200 && res.data?.content !== null) {
        setNewsletterData(res.data.content);
      }
    });
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        padding: '20px 0px',
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: newsletterData }} />
    </Container>
  );
}
