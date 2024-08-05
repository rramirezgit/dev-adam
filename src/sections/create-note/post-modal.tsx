'use client';

/* eslint-disable prefer-arrow-callback */
import { Box, Dialog, DialogContent, Grid, IconButton } from '@mui/material';
import { useResponsive } from 'src/hooks/use-responsive';
import { RootState } from 'src/store';
import { Iconify } from 'src/components/iconify';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenModalPreviewMobile } from 'src/store/slices/post';
import CropSection from './menu/crop-section';
import { TabsPreview } from './previews/preview-container';

import PostModalWrepper from './post-modal-wrapper';
import PreviewaLayout from './previews/previews-layout';
import RenderPreview from './previews/render-preview';
import PostModalForm from './form/post-modal-form';

export default function PostModal() {
  const mdUp = useResponsive('up', 'md');

  const showCropSection = useSelector((state: RootState) => state.post.showCropSection);

  const openModalPreviewMobile = useSelector(
    (state: RootState) => state.post.openModalPreviewMobile
  );

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setOpenModalPreviewMobile(false));
  };

  const renderModalMobile = (
    <Dialog
      open={openModalPreviewMobile}
      sx={{
        zIndex: 9999,
      }}
      onClose={() => dispatch(setOpenModalPreviewMobile(false))}
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 1,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Iconify icon="eva:close-outline" />
      </IconButton>
      <DialogContent
        sx={(theme) => ({
          background: theme.palette.background.neutral,
        })}
      >
        <TabsPreview hidenBtns />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '10%',
          }}
        >
          <RenderPreview />
        </Box>
      </DialogContent>
    </Dialog>
  );

  const renderGridPreview = (
    <>
      {mdUp ? (
        <Grid item xs={5}>
          <PreviewaLayout>
            <RenderPreview />
          </PreviewaLayout>
        </Grid>
      ) : (
        <>{renderModalMobile}</>
      )}
    </>
  );

  const renderGridForm = (
    <Grid item xs={12} md={7}>
      <PostModalForm />
    </Grid>
  );

  const renderCropSection = (
    <Grid item xs={12} md={7}>
      <CropSection />
    </Grid>
  );

  return (
    <PostModalWrepper>
      <Grid container spacing={0}>
        {showCropSection ? renderCropSection : renderGridForm}

        {renderGridPreview}
      </Grid>
    </PostModalWrepper>
  );
}
