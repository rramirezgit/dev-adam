import type { RootState } from 'src/store';

import { useDispatch, useSelector } from 'react-redux';

import { Box, useTheme, keyframes } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { setOpenNewsDrawer } from 'src/store/slices/noteStore';

import { NewsDrawer } from 'src/components/drawer-news';
import ButtonOption from 'src/components/drawer-news/buton-option-drawer';

import NotaEditingArea from '../editing-area';
import MenuNeswletter from '../menu/menu-view';
import useSaveDialogNota from '../dialog-save';

export default function CreateNota() {
  const theme = useTheme();

  const smUp = useResponsive('up', 'sm');
  const dispatch = useDispatch();

  const currentNotaId = useSelector((state: RootState) => state.note.currentNotaId);
  const showSaved = useSelector((state: RootState) => state.note.showSaved);

  const { showPopup, DialogosaveNota } = useSaveDialogNota();

  const renderBody = (
    <Box sx={{ display: 'flex', gap: theme.spacing(2) }}>
      <MenuNeswletter />
      <NotaEditingArea />
    </Box>
  );

  const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

  return (
    <>
      {!smUp ? (
        renderBody
      ) : (
        <Box position="relative">
          <ButtonOption
            iconSrc="/assets/icons/dashboard/create-note/save.svg"
            title="Guardar Nota"
            onClick={() => {
              showPopup.onTrue();
            }}
            sx={{
              ...(showSaved
                ? {
                    right: '-45px',
                    animation: `${pulse} 1s ease-in-out infinite`,
                  }
                : { right: '-180px' }),
            }}
            index={0}
          />
          <ButtonOption
            iconSrc="/assets/icons/dashboard/create-note/options.svg"
            title="Opciones de nota"
            sx={{
              opacity: currentNotaId ? 1 : 0,
            }}
            onClick={() => {
              dispatch(setOpenNewsDrawer(true));
            }}
            index={1}
          />

          <Box
            sx={{
              width: '100%',
              padding: theme.spacing(2),
              borderRadius: '16px',
              position: 'relative',
              boxShadow:
                '0px 0px 2px 0px rgba(145, 158, 171, 0.20), 0px 12px 24px -4px rgba(145, 158, 171, 0.12);',
            }}
          >
            {renderBody}
          </Box>
          {DialogosaveNota({ exitEditor: false })}
          <NewsDrawer />
        </Box>
      )}
    </>
  );
}
