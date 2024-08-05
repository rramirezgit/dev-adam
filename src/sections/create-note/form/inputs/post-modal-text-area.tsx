"use client";

/* eslint-disable prefer-template */

import { Box, IconButton, Menu, Theme, styled, useTheme } from "@mui/material";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useField } from "formik";
import { useEffect, useState } from "react";
import Iconify from "src/components/iconify/iconify";
import { useLocales } from "src/locales";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import ErrorForm from "../error-form";

const TextArea = styled("textarea")(({ theme }) => ({
  width: "100%",
  height: 140,
  fontFamily: theme.typography.fontFamily,
  backgroundColor: theme.palette.background.paper,
  padding: 16,
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 400,
  border: `none`,
  color: theme.palette.text.primary,
  resize: "none",
  "&:focus": {
    outline: "none",
  },
}));

type TexAreaContainerProps = {
  error: boolean | undefined | string;
  theme: Theme;
};

const TexAreaContainer = styled(Box)(
  ({ error, theme }: TexAreaContainerProps) => ({
    width: "100%",
    display: "flex",
    height: "168px",
    flexDirection: "column",
    gap: 16,
    borderRadius: 8,
    border: `1px solid ${
      error ? theme.palette.error.main : theme.palette.info.main
    }`,
    "&:focus": {
      border: `1px solid ${theme.palette.info.main} !important`,
    },
  })
);

interface IPostTextArea {
  name: string;
}

export default function PostTextArea({ name }: IPostTextArea) {
  const { currentLang } = useLocales();

  const [, meta, helpers] = useField(name);
  const theme = useTheme();
  const { t } = useLocales();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const valuesForm = useSelector(
    (state: RootState) => state.post.formData.values
  );

  const [showPicker, setShowPicker] = useState(false);
  const [text, setText] = useState(valuesForm.content);

  useEffect(() => {
    helpers.setValue(text);
  }, [text]);

  const onEmojiClick = ({ emoji }: EmojiClickData, emojiObject: any) => {
    setText((prevValue: string) => prevValue + emoji);
    setShowPicker(false);
  };

  const openEmojiPicker = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setShowPicker(prevShowPicker => !prevShowPicker);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleClickHashtag = () => {
    setText((prevValue: string) => prevValue + " #");
    // focus on text area
    const el = document.getElementById(`post-modal-text-area-${name}`);
    el?.focus();
  };

  const handleClickMensiion = () => {
    setText((prevValue: string) => prevValue + " @");
    const el = document.getElementById(`post-modal-text-area-${name}`);
    el?.focus();
  };

  return (
    <Box>
      <TexAreaContainer error={meta.error && meta.touched} theme={theme}>
        <TextArea
          id={`post-modal-text-area-${name}`}
          lang={currentLang.label}
          value={text}
          onChange={handleChange}
          placeholder={t("Dashboard.Create_Nota.Create.Modal.Footer_Of_Post")}
          style={{
            height: "150px",
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "0 16px",
            height: 48,
            backgroundColor: theme.palette.background.neutral,
            borderRadius: "0 0 8px 8px",
            position: "relative",
          }}
        >
          <IconButton onClick={openEmojiPicker}>
            <span
              style={{
                width: 24,
                height: 24,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              😀
            </span>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open
            onClose={() => setShowPicker(false)}
            sx={{ display: showPicker ? "block" : "none" }}
          >
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </Menu>
          <IconButton onClick={handleClickHashtag}>
            <Iconify icon="fontisto:hashtag" />
          </IconButton>
          <IconButton onClick={handleClickMensiion}>
            <Iconify icon="streamline:sign-at-solid" />
          </IconButton>

          <Box
            sx={{
              position: "absolute",
              right: "16px",
              fontSize: "14px",
              fontWeight: 400,
              color: theme.palette.text.secondary,
              display: "flex",
              flexDirection: "row",
              gap: "8px",
            }}
          >
            <Box>#{text.split("#").length - 1}</Box>
            <Box>{text.length}</Box>
          </Box>
        </Box>
      </TexAreaContainer>
      <ErrorForm name={name} />
    </Box>
  );
}
