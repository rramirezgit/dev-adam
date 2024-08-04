import {
  Avatar,
  Box,
  Card,
  Grid,
  Stack,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import Image from 'src/components/image';
import { useResponsive } from 'src/hooks/use-responsive';

interface CardPostProps {
  image: string;
  sx?: SxProps<Theme> | undefined;
}

export default function PreviewTwitter({ image, sx }: CardPostProps) {
  const text = useSelector((state: RootState) => state.post.formData.values.content);

  const mdUp = useResponsive('up', 'md');

  const theme = useTheme();
  const { user } = useAuthContext();

  const renderCardHead = (
    <>
      <Stack
        spacing={2}
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        width="100%"
        sx={{ textAlign: 'center', p: '11px' }}
      >
        <Grid container spacing={1}>
          <Grid item xs={1}>
            <Avatar
              src={user?.photoURL}
              alt={user?.displayName}
              variant="square"
              sx={{
                width: 30,
                height: 30,
                borderRadius: '2px',
              }}
            />
          </Grid>
          <Grid item xs={11}>
            <Stack spacing={0} width="100%" padding="0px 0px 0px 10px">
              <Box
                sx={{
                  display: 'flex',
                  gap: '14px',
                }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.background.neutral,
                    height: '10px',
                    width: '100%',
                    borderRadius: '12px',
                  }}
                />
                <Iconify icon="icon-park-outline:more" width={15} color="#65676B" />
              </Box>
              <Box
                sx={{
                  backgroundColor: theme.palette.background.neutral,
                  height: '10px',
                  width: '50%',
                  borderRadius: '12px',
                  padding: '0px 0px 0px 10px',
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
      <Box sx={{ p: '4px 0px 18px 60px' }}>
        <Typography sx={{ fontSize: '70%', textAlign: 'initial' }}>{text}</Typography>
      </Box>
    </>
  );

  const renderContent = (
    <Box
      padding="0 24px"
      sx={{
        width: '100%',
      }}
    >
      <Stack
        direction="column"
        gap={2}
        justifyContent="center"
        sx={{
          border: `0.776px solid ${theme.palette.background.neutral}`,
          borderRadius: '12.45px',
        }}
      >
        <Image
          src={image}
          alt="post"
          width="100%"
          height={221}
          sx={{ borderRadius: '12.45px 12.45px 0 0' }}
        />
        <Box p="0 12px">
          <Box
            sx={{
              p: '4px',
              bgcolor: theme.palette.grey[900],
              height: 24,
              color: 'white',
              borderRadius: '12.45px',
              marginBottom: '15px',
            }}
          >
            <Typography sx={{ fontSize: '10px', textAlign: 'center' }}>Follow</Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );

  const renderFooter = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        gap: '24px',
        marginTop: '10px',
        marginBottom: '10px',
      }}
    >
      {['comment', 'retweet', 'like', 'share'].map((item, index) => (
        <Image key={index} src={`/assets/icons/dashboard/post/twitter/${item}.svg`} alt="icon" />
      ))}
    </Box>
  );

  return (
    <Card
      sx={{
        maxWidth: '418px',
        width: '100%',
        margin: '0 auto',
        borderRadius: '8px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px 0.5px 0.5px rgba(0, 0, 0, 0.25)',
        ...sx,
      }}
    >
      {renderCardHead}

      {renderContent}

      {renderFooter}
    </Card>
  );
}
