import AWS from 'aws-sdk';
import React, { useContext, createContext } from 'react';

const AWSContext = createContext({});

const accessKeyId = process.env.NEXT_PUBLIC_AWS_CLIENT_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string;
const region = process.env.NEXT_PUBLIC_AWS_REGION as string;

const AWSProvider = ({ children }: { children: React.ReactNode }) => {
  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region,
  });

  return <AWSContext.Provider value={AWS}>{children}</AWSContext.Provider>;
};

// Hook personalizado para usar AWS
const useAWS = () => {
  const context = useContext(AWSContext);
  if (context === undefined) {
    throw new Error('useAWS must be used within a AWSProvider');
  }
  return context;
};

export { useAWS, AWSProvider };
