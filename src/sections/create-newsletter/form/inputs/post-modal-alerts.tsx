import type { RootState } from 'src/store';

import { useDispatch, useSelector } from 'react-redux';

import { Box, Alert, Button } from '@mui/material';

import { useLocales } from 'src/locales';
import { setSocialNetworksConnected } from 'src/store/slices/post';

export default function AlertMessages() {
  const tabSelected = useSelector((state: RootState) => state.post.tabSelected);
  const socialNetworksConnected = useSelector(
    (state: RootState) => state.post.socialNetworksConnected
  );
  const { t } = useLocales();

  const distpach = useDispatch();

  if (socialNetworksConnected.includes(tabSelected)) return <></>;

  return (
    <Box
      sx={{
        padding: '0 24px 0 0',
      }}
    >
      <Alert
        severity="info"
        sx={{
          zIndex: 3,
        }}
        action={
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              distpach(setSocialNetworksConnected([...socialNetworksConnected, tabSelected]))
            }
          >
            {t('Dashboard.Create_Newsletter.Create.Modal.btn_Connect')}
          </Button>
        }
      >
        {t('Dashboard.Create_Newsletter.Create.Modal.Message_ConnectToPublish', {
          tabSelected,
        })}
      </Alert>
    </Box>
  );
}
