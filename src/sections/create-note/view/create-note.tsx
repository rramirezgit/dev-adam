import { Box, IconButton, Paper, Stack, TextField, Tooltip, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useResponsive } from 'src/hooks/use-responsive';
import { useDispatch, useSelector } from 'react-redux';
import { setCoverImage, setSubject } from 'src/store/slices/note';
import { useParams } from 'next/navigation';
import Iconify from 'src/components/iconify';
import { RootState } from 'src/store';
import Image from 'src/components/image/image';
import { UploadBox } from 'src/components/upload';
import NotaEditingArea from '../editing-area';
import SendNota from '../header-editing';
import MenuNeswletter from '../menu/menu-view';
import { useAxios } from '../../../auth/context/axios/axios-provider';
import StateBtn from './StateBtn';
import useNotes from './useNotes';

export default function CreateNota() {
  const theme = useTheme();

  const [showAprove, setShowAprove] = useState(false);
  const [loadingCoverImage, setLoadingCoverImage] = useState(false);
  const [coverImageLocal, setCoverImageLocal] = useState('');
  const smUp = useResponsive('up', 'sm');
  const { NotaId } = useParams();
  const { loadNotes } = useNotes();
  const dispatch = useDispatch();
  const axiosInstance = useAxios();

  const neswletterList = useSelector((state: RootState) => state.note.neswletterList);
  const currentNotaId = useSelector((state: RootState) => state.note.currentNotaId);
  const coverImage = useSelector((state: RootState) => state.note.coverImage);
  const coverImageError = useSelector((state: RootState) => state.note.coverImageError);
  const subject = useSelector((state: RootState) => state.note.subject);

  const nota = neswletterList.find((item) => item.id === currentNotaId);

  useEffect(() => {
    if (nota) {
      if (nota.coverImageUrl) {
        setCoverImageLocal(nota.coverImageUrl);
      }
      if (nota && nota?.status === 'REVIEW') {
        setShowAprove(false);
      } else {
        setShowAprove(false);
      }
    } else {
      setShowAprove(false);
    }
  }, [currentNotaId, neswletterList]);

  const handleApproveClick = async () => {
    await axiosInstance.patch(`posts/${NotaId || currentNotaId}/status/approved`);
    setShowAprove(false);
    loadNotes({ tab: 1 });
  };

  const handleRejectClick = async () => {
    await axiosInstance.patch(`posts/${NotaId || currentNotaId}/status/`, { approved: false });
    setShowAprove(false);
    loadNotes({ tab: 0 });
  };

  const changeStatusNote = async (status: string) => {
    await axiosInstance.patch(`posts/${NotaId || currentNotaId}/status/${status}`);
    setShowAprove(false);

    const tabMapping: Record<string, number> = {
      REVIEW: 1,
      APPROVED: 2,
      PUBLISHED: 3,
      ADAC: 4,
    };
    loadNotes({ tab: tabMapping[status] || 0 });
  };

  const handleRemoveImage = async () => {
    setLoadingCoverImage(true);
    try {
      if (NotaId || currentNotaId) {
        await axiosInstance.patch(`posts/${NotaId || currentNotaId}`, { coverImageUrl: '' });
      }
      dispatch(setCoverImage(''));
      setCoverImageLocal('');
    } finally {
      setLoadingCoverImage(false);
    }
  };

  const renderBody = (
    <Box sx={{ display: 'flex', gap: theme.spacing(2) }}>
      <MenuNeswletter />
      <NotaEditingArea />
    </Box>
  );

  return (
    <>
      <SendNota />
      {!smUp ? (
        renderBody
      ) : (
        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: theme.spacing(2),
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Stack direction="row" spacing={2}>
              <TextField
                label="Title"
                variant="outlined"
                color="primary"
                value={subject}
                onChange={(e) => {
                  dispatch(setSubject(e.target.value));
                  axiosInstance.patch(`posts/${NotaId || currentNotaId}`, {
                    title: e.target.value,
                  });
                }}
              />
              {coverImageLocal || coverImage ? (
                <Box sx={{ position: 'relative' }}>
                  <Image
                    src={coverImageLocal || coverImage}
                    alt="cover image"
                    width={150}
                    height={50}
                    sx={{
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                    }}
                  />
                  <IconButton
                    sx={{ position: 'absolute', top: -20, right: -20 }}
                    onClick={handleRemoveImage}
                  >
                    <Iconify icon="typcn:delete" width={30} />
                  </IconButton>
                </Box>
              ) : (
                <UploadBox
                  loading={loadingCoverImage}
                  sx={{ height: '53px', margin: 0, width: 150 }}
                  error={coverImageError}
                  note
                  onDrop={async (files) => {
                    if (files.length === 0) return;
                    setLoadingCoverImage(true);
                    const file = files[0];
                    const formData = new FormData();
                    formData.append('file', file, file.name);
                    await axiosInstance
                      .post('/media/upload', formData)
                      .then(async ({ data }) => {
                        if (data.s3Url) {
                          if (NotaId || currentNotaId) {
                            await axiosInstance
                              .patch(`posts/${NotaId || currentNotaId}`, {
                                coverImageUrl: data.s3Url,
                              })
                              .then(() => {
                                setLoadingCoverImage(false);
                                dispatch(setCoverImage(data.s3Url));
                                setCoverImageLocal(data.s3Url);
                              });
                          } else {
                            setLoadingCoverImage(false);
                            dispatch(setCoverImage(data.s3Url));
                          }
                        }
                      })
                      .catch(console.error);
                  }}
                />
              )}
              {showAprove && (
                <Box sx={{ display: 'flex', gap: theme.spacing(2), alignItems: 'flex-start' }}>
                  <Tooltip title="Aprobar">
                    <IconButton onClick={handleApproveClick}>
                      <Iconify icon="iconamoon:check-bold" color={theme.palette.primary.main} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Rechazar">
                    <IconButton onClick={handleRejectClick}>
                      <Iconify icon="iconoir:cancel" color={theme.palette.primary.main} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Stack>
            <StateBtn Nota={nota} onChange={changeStatusNote} />
          </Box>
          <Paper
            sx={{
              width: '100%',
              padding: theme.spacing(2),
              borderRadius: '8px',
              position: 'relative',
            }}
            elevation={1}
          >
            {renderBody}
          </Paper>
        </Box>
      )}
    </>
  );
}
