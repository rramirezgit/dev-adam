"use client";

import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useResponsive } from "src/hooks/use-responsive";
import { setOpenModalPreviewMobile } from "src/store/slices/post";
import { useLocales } from "src/locales";
import PostModalSocialButtons from "./inputs/post-modal-social-buttons";

interface IPosModalFormLayout {
  children?: React.ReactNode | React.ReactNode[];
}

export default function PosModalFormLayout({ children }: IPosModalFormLayout) {
  const { t } = useLocales();

  return (
    <Stack
      sx={{
        padding: "0 4px 0 0",
        gap: "24px",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          p: "24px 24px 0 0",
        }}
      >
        {t("Dashboard.Create_Nota.Title")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "24px",
          p: "0 24px 0 0",
        }}
      >
        <Typography sx={{ fontWeight: 400, fontSize: 14 }}>
          {t("Dashboard.Create_Nota.Create.Modal.Publish_In")}
        </Typography>

        <Link
          href="#"
          underline="hover"
          sx={theme => ({
            color: theme.palette.info.main,
          })}
        >
          {t("Dashboard.Create_Nota.Create.Modal.Connect_SocialNetwork")}
        </Link>
      </Box>
      <PostModalSocialButtons />

      {children}
    </Stack>
  );
}
