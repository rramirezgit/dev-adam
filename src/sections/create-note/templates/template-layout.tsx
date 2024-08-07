import type { RootState } from 'src/store';

import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowUp2, ArrowDown2, BrushSquare } from 'iconsax-react';

import { Box, Stack, alpha, useTheme, IconButton } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { TEMPLATESNAMES } from 'src/const/neswletter/templates';
import {
  moveTemplateNota,
  changeColorNotatemplate,
  changeBGColorNotatemplate,
} from 'src/store/slices/noteStore';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

export const COLORS_Nota_TEMPLATES = ['#F0BE46', '#00C3C3', '#2C394B', '#000000'];
export const COLORS_BG_Nota_TEMPLATES = ['#FFFFFF', '#FEFAEF', '#F5FCFC', '#F4F5F6', '#F9BB19'];

interface ILayoutTemplate {
  children: React.ReactNode;
  templateId: string;
  name: string;
  isEmail?: boolean;
  color: string;
  bgColor: string;
}

const maxWith = 650;

export default function LayoutTemplate({
  children,
  templateId,
  name,
  isEmail = false,
  color,
  bgColor,
}: ILayoutTemplate) {
  const borderColorPopover = usePopover();
  const backgroundPopover = usePopover();

  const [haveError, setHaveError] = useState(false);
  const [opacityTooltip, setOpacityTooltip] = useState(0);

  const { main } = useSelector((state: RootState) => state.note.styles);
  const errors = useSelector((state: RootState) => state.note.errors);

  const smUp = useResponsive('up', 'sm');

  const Theme = useTheme();

  useEffect(() => {
    setHaveError(errors.some((item) => item.name === name && item.templateId === templateId));
  }, [errors, templateId, name]);

  // const borderWith = name === TEMPLATESNAMES.Header ? '1px' : '2px';
  const borderWith = '2px';
  const borderColorMain = color;

  const padding = name === TEMPLATESNAMES.Header ? '32px' : '24px';

  return (
    <>
      <div
        style={{
          border: `${borderWith} solid ${
            haveError ? Theme.palette.error.light : alpha(borderColorMain, 0.3)
          }`,
          borderRadius: '18px',
          padding,
          maxWidth: maxWith,
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          margin: '0 auto 10px auto',
          position: 'relative',
          width: '100%',
        }}
        onMouseEnter={() => {
          if (!smUp) return;
          setOpacityTooltip(1);
        }}
        onMouseLeave={() => {
          if (!smUp) return;
          setOpacityTooltip(0);
          borderColorPopover.onClose();
          backgroundPopover.onClose();
        }}
      >
        {!isEmail && smUp && (
          <TooltipNewletter
            opacityTooltip={opacityTooltip}
            borderColorMain={main}
            templateId={templateId}
            borderColorPopover={borderColorPopover}
            backgroundPopover={backgroundPopover}
            name={name}
          />
        )}
        {!isEmail && !smUp && (
          <TooltioMobileNewletter
            opacityTooltip={opacityTooltip}
            borderColorMain={main}
            templateId={templateId}
            borderColorPopover={borderColorPopover}
            backgroundPopover={backgroundPopover}
            name={name}
            setOpacityTooltip={setOpacityTooltip}
          />
        )}
        <div>{children}</div>
      </div>
      {haveError && (
        <div
          style={{
            margin: '0 auto',
            width: '100%',
          }}
        >
          {errors.map((item) => {
            if (item.name !== name || item.templateId !== templateId) return null;
            return (
              <Box
                sx={{
                  margin: '10px auto',
                  maxWidth: maxWith,
                  color: Theme.palette.error.light,
                  '&:hover': {
                    transition: 'all 0.3s ease',
                  },
                }}
                key={item.inputId}
              >
                {item.message}
              </Box>
            );
          })}
        </div>
      )}
    </>
  );
}

interface IImageTemplate {
  opacityTooltip: number;
  borderColorMain?: string;
  templateId: string;
  borderColorPopover: any;
  backgroundPopover: any;
  name: string;
}

const TooltipNewletter = ({
  opacityTooltip,
  borderColorMain,
  templateId,
  borderColorPopover,
  backgroundPopover,
  name,
}: IImageTemplate) => {
  const dispatch = useDispatch();
  const smUp = useResponsive('up', 'sm');

  const currentNota = useSelector((state: RootState) => state.note.currentNota);

  const theme = useTheme();

  const handleClickMoveNota = (direction: string) => {
    dispatch(moveTemplateNota({ templateId, direction }));
  };

  const changeColorNotaTemplateFunc = (color: string) => {
    dispatch(
      changeColorNotatemplate({
        templateId,
        color,
      })
    );
    borderColorPopover.onClose();
  };

  const changeBGColorNotaTemplateFunc = (color: string) => {
    dispatch(
      changeBGColorNotatemplate({
        templateId,
        color,
      })
    );
    borderColorPopover.onClose();
  };

  return (
    <Box
      sx={{
        position: !smUp ? 'initial' : 'absolute',
        opacity: opacityTooltip,
        transition: 'all 0.3s ease',
        top: '0',
        padding: '5px',
        right: '0',
        transform: 'translateX(100%)',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
      }}
    >
      {/* {name !== TEMPLATESNAMES.Footer && (
        <IconButton onClick={handleClickdeleteNotaTemplate}>
          <Trash color="red" />
        </IconButton>
      )} */}
      {name !== TEMPLATESNAMES.Header &&
        name !== TEMPLATESNAMES.Footer &&
        currentNota.length > 3 && (
          <>
            <IconButton onClick={() => handleClickMoveNota('up')}>
              <ArrowUp2 color={borderColorMain} />
            </IconButton>
            <IconButton onClick={() => handleClickMoveNota('down')}>
              <ArrowDown2 color={borderColorMain} />
            </IconButton>
          </>
        )}
      <IconButton
        onClick={(e) => {
          borderColorPopover.onOpen(e);
          backgroundPopover.onClose(e);
        }}
      >
        <BrushSquare color={theme.palette.primary.main} />
      </IconButton>
      <IconButton
        onClick={(e) => {
          borderColorPopover.onClose(e);
          backgroundPopover.onOpen(e);
        }}
      >
        <SvgColor src="/assets/icons/newsletter/bgcolor.svg" color="black" />
      </IconButton>
      {borderColorPopover.open && (
        <Stack
          direction="column"
          spacing={0}
          sx={{
            position: 'absolute',
            right: '-55%',
            transform: 'translateY(0%)',
            zIndex: 1,
          }}
        >
          {COLORS_Nota_TEMPLATES.map((color) => (
            <m.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key={color}
            >
              <IconButton key={color} onClick={() => changeColorNotaTemplateFunc(color)}>
                <Box
                  sx={{
                    backgroundColor: color,
                    width: 20,
                    height: 20,
                    borderRadius: '80%',
                  }}
                />
              </IconButton>
            </m.div>
          ))}
        </Stack>
      )}
      {backgroundPopover.open && (
        <Stack
          direction="column"
          spacing={0}
          sx={{
            position: 'absolute',
            right: '-55%',
            transform: 'translateY(0%)',
            zIndex: 1,
          }}
        >
          {COLORS_BG_Nota_TEMPLATES.map((color) => (
            <m.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key={color}
            >
              <IconButton key={color} onClick={() => changeBGColorNotaTemplateFunc(color)}>
                <Box
                  sx={{
                    backgroundColor: color,
                    width: 20,
                    height: 20,
                    borderRadius: '80%',
                  }}
                />
              </IconButton>
            </m.div>
          ))}
        </Stack>
      )}
    </Box>
  );
};

interface ITooltioMobileNewletter extends IImageTemplate {
  setOpacityTooltip: any;
  backgroundPopover: any;
}

const TooltioMobileNewletter = ({
  opacityTooltip,
  borderColorMain,
  templateId,
  name,
  borderColorPopover,
  backgroundPopover,
  setOpacityTooltip,
}: ITooltioMobileNewletter) => {
  const popoverMovile = usePopover();
  return (
    <>
      <IconButton
        onClick={popoverMovile.onOpen}
        sx={{
          position: 'absolute',
          top: '0',
          right: '-1px',
        }}
      >
        <Iconify icon="eva:more-horizontal-fill" />
      </IconButton>
      <CustomPopover open={popoverMovile.open} onClose={popoverMovile.onClose} sx={{ width: 80 }}>
        <TooltipNewletter
          opacityTooltip={1}
          borderColorMain={borderColorMain}
          templateId={templateId}
          borderColorPopover={borderColorPopover}
          backgroundPopover={backgroundPopover}
          name={name}
        />
      </CustomPopover>
    </>
  );
};
