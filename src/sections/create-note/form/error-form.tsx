import { Box, styled } from '@mui/material';
import { ErrorMessage } from 'formik';

interface IErrorForm {
  name: string;
}

const StyledErrorMessage = styled(Box)(({ theme }: any) => ({
  color: theme.palette.error.main,
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '22px',
  margin: '16px 0 0 0',
}));

export default function ErrorForm({ name }: IErrorForm) {
  return <ErrorMessage name={name} component={StyledErrorMessage} />;
}
