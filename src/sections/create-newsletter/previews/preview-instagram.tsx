import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
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
import SvgColor from 'src/components/svg-color/svg-color';

interface CardPostProps {
  image: string;
  sx?: SxProps<Theme> | undefined;
}

export default function PreviewInstagram({ image, sx }: CardPostProps) {
  const text = useSelector((state: RootState) => state.post.formData.values.content);

  const theme = useTheme();
  const { user } = useAuthContext();
  const renderCardHead = (
    <Stack
      spacing={2}
      justifyContent="center"
      alignContent="center"
      alignItems="center"
      width="100%"
      sx={{ textAlign: 'center', p: '11px' }}
    >
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Avatar
            src={user?.photoURL}
            alt={user?.displayName}
            variant="circular"
            sx={{
              width: 30,
              height: 30,
            }}
          />
        </Grid>
        <Grid item xs={10}>
          <Stack spacing={0} width="100%">
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
            <Typography
              sx={{ fontSize: '70%', textAlign: 'initial' }}
              color={theme.palette.text.secondary}
            >
              Sponsored <Iconify icon="mdi:planet" width={9} color="#65676B" />
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );

  const renderHeadLine = (
    <Box
      sx={{
        height: '45px',
        width: '100%',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        color: theme.palette.info.main,
      }}
    >
      <Typography sx={{ fontSize: '12px', textAlign: 'initial', p: '7px', fontWeight: 600 }}>
        Shop Now
      </Typography>
      <Box
        sx={{
          height: '28px',
          borderRadius: '3px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Iconify icon="mingcute:right-line" width={15} color={theme.palette.info.main} />
      </Box>
    </Box>
  );

  const renderComents = (
    <Box
      sx={{
        height: '37px',
        width: '100%',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      <Box>
        <SvgColor src="/assets/icons/dashboard/post/instagram/likes.svg" width={100} height={24} />
      </Box>
      <Box>
        <SvgColor
          src="/assets/icons/dashboard/post/instagram/bookmark.svg"
          width={24}
          height={24}
        />
      </Box>
    </Box>
  );

  const renderOptions = (
    <Box
      sx={{
        height: 'auto',
        width: '100%',
        padding: '10px 14px',
        fontSize: '12px',
        fontWeight: 400,
        marginBottom: '10px',
      }}
    >
      {text}
    </Box>
  );

  const renderFooterCard = (
    <Stack>
      {renderHeadLine}
      <Divider />
      {renderComents}
      {renderOptions}
    </Stack>
  );

  return (
    <Card
      sx={{
        maxWidth: '340px',
        borderRadius: '8px',
        margin: '0 auto',
        backgroundColor: theme.palette.background.paper,
        height: 'auto',
        boxShadow: '0px 0.5px 0.5px rgba(0, 0, 0, 0.25)',
        ...sx,
      }}
    >
      {renderCardHead}

      <Image src={image} alt="post" width="100%" height={328} />

      {renderFooterCard}
    </Card>
  );
}
