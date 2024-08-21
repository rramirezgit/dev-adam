import type { RootState } from 'src/store';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Paper, useTheme } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { setOpenNewsletterDrawer } from 'src/store/slices/newsletterStore';

import ButtonOption from 'src/components/drawer-news/buton-option-drawer';
import { NewsletterDrawer } from 'src/components/drawer-news/newsletter-drawer';

import MenuNeswletter from '../menu/menu-view';
import useSendNewsletter from '../header-editing';
import NewsletterEditingArea from '../editing-area';

export default function CreateNewsletter() {
  const Theme = useTheme();

  const [showAprove, setShowAprove] = useState(false);

  const [showScheduleData, setShowScheduleData] = useState(false);

  const smUp = useResponsive('up', 'sm');

  const { showPopupNewsletterSave, DialogSaveNewsletter } = useSendNewsletter();

  const newsletterList = useSelector((state: RootState) => state.newsletter.newsletterList);
  const currentNewsletterId = useSelector(
    (state: RootState) => state.newsletter.currentNewsletterId
  );

  const newsletter: any = newsletterList.find((item) => item.id === currentNewsletterId);

  const dispatch = useDispatch();

  useEffect(() => {
    if (newsletter) {
      if (newsletter && newsletter?.status === 'SCHEDULED') {
        setShowScheduleData(true);
      } else {
        setShowScheduleData(false);
      }

      if (newsletter && newsletter?.status === 'PENDING_APPROVAL') {
        setShowAprove(true);
      } else {
        setShowAprove(false);
      }
    } else {
      setShowAprove(false);
    }
  }, [currentNewsletterId, newsletterList]);

  const renderBody = (
    <Box
      sx={{
        display: 'flex',
        gap: Theme.spacing(2),
      }}
    >
      <MenuNeswletter />
      <NewsletterEditingArea />
    </Box>
  );

  return (
    <>
      {/* <SendNewsletter /> */}
      {!smUp ? (
        renderBody
      ) : (
        <Box position="relative">
          <ButtonOption
            iconSrc="/assets/icons/dashboard/create-note/save.svg"
            title="Guardar Newsletter"
            onClick={() => {
              showPopupNewsletterSave.onTrue();
            }}
            index={0}
          />
          <ButtonOption
            iconSrc="/assets/icons/dashboard/create-note/options.svg"
            title="Opciones"
            sx={{
              opacity: currentNewsletterId ? 1 : 0,
            }}
            onClick={() => {
              dispatch(setOpenNewsletterDrawer(true));
            }}
            index={1}
          />

          <Paper
            sx={{
              width: '100%',
              padding: Theme.spacing(2),
              borderRadius: '16px',
              boxShadow:
                '0px 0px 2px 0px rgba(145, 158, 171, 0.20), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
              position: 'absolute',
            }}
            elevation={1}
          >
            {renderBody}
          </Paper>
          {DialogSaveNewsletter({ exitEditor: false })}
          <NewsletterDrawer />
        </Box>
      )}
    </>
  );
}
