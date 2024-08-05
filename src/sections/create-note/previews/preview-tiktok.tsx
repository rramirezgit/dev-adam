import { Avatar, Box, SxProps, Theme, Typography, useTheme, alpha } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import Image from 'src/components/image';

interface CardPostProps {
  image: string;
  sx?: SxProps<Theme> | undefined;
}

export default function PreviewTiktok({ image, sx }: CardPostProps) {
  const text = useSelector((state: RootState) => state.post.formData.values.content);

  const theme = useTheme();
  const { user } = useAuthContext();

  return (
    <Box
      sx={{
        position: 'relative',
        height: '500px',
        width: '231px',
        margin: '0 auto',
      }}
    >
      <Image
        src={image}
        alt="post"
        height="449px"
        width="231px"
        sx={{ borderRadius: '12.45px 12.45px 0 0', position: 'absolute' }}
      />
      <Avatar
        src={user?.photoURL}
        alt={user?.displayName}
        variant="circular"
        sx={{
          width: 30,
          height: 30,
          position: 'absolute',
          bottom: '253px',
          left: '197px',
        }}
      />
      <Box
        sx={{
          borderRadius: '8px',
          position: 'absolute',
        }}
      >
        <Image src="/assets/background/tiktok.svg" alt="post" height={500} />
      </Box>

      <Box
        sx={{
          backgroundColor: alpha(theme.palette.background.neutral, 0.7),
          height: '4px',
          width: '80px',
          borderRadius: '12px',
          position: 'absolute',
          bottom: '62px',
          left: '20px',
        }}
      />

      <Typography
        sx={{
          fontSize: '10px',
          fontWeight: 400,
          position: 'absolute',
          bottom: '80px',
          width: '70%',
          left: '8px',
          color: theme.palette.background.neutral,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}
