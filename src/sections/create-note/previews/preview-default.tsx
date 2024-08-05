import { Avatar, Box, Card, Grid, Stack, SxProps, Theme, useTheme } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import ImageMUI from 'src/components/image/image';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

interface CardPostProps {
  image: string;
  sx?: SxProps<Theme> | undefined;
}

export default function PreviewDefault({ image, sx }: CardPostProps) {
  const text = useSelector((state: RootState) => state.post.formData.values.content);

  const theme = useTheme();
  const { user } = useAuthContext();

  return (
    <Card
      sx={{
        borderRadius: '8px',
        maxWidth: '350px',
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        boxShadow: '0px 0.5px 0.5px rgba(0, 0, 0, 0.25)',
        mb: 2,
        ...sx,
      }}
    >
      <Stack
        spacing={2}
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        width="100%"
        sx={{ textAlign: 'center', p: '11px' }}
      >
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Avatar
              src={user?.photoURL}
              alt={user?.displayName}
              variant="square"
              sx={{
                width: 43,
                height: 43,
                borderRadius: '2.5px',
              }}
            />
          </Grid>
          <Grid item xs={10}>
            <Stack spacing={1} width="100%">
              <Box
                sx={{
                  backgroundColor: theme.palette.background.neutral,
                  height: '15px',
                  width: '100%',
                  borderRadius: '12px',
                }}
              />
              <Box
                sx={{
                  backgroundColor: theme.palette.background.neutral,
                  height: '15px',
                  width: '70%',
                  borderRadius: '12px',
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
      <Box sx={{ p: '28px 19px 13px', fontSize: '14px' }}>{text}</Box>
      <ImageMUI src={image} alt="icon" width="100%" />
      <Stack spacing={1} width="100%" sx={{ p: '11px' }} direction="row">
        {[0, 1, 2].map((item, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: theme.palette.background.neutral,
              height: '9px',
              width: '100%',
              borderRadius: '12px',
            }}
          />
        ))}
      </Stack>
    </Card>
  );
}
