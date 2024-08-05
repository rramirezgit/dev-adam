"use client";

import { Form, Formik } from "formik";

import { m } from "framer-motion";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormData,
  setOpenDrawer,
  setOpenModalPreviewMobile,
  setPostList,
} from "src/store/slices/post";
import { RootState } from "src/store";

import {
  Box,
  Button,
  Checkbox,
  Stack,
  Tooltip,
  TooltipProps,
  Typography,
  alpha,
  styled,
  tooltipClasses,
  useTheme,
} from "@mui/material";
import ThumbnailsView from "src/components/Thumbnails";
import { SOCIALNETWORKSNAMES } from "src/const/post/redes";
import SvgColor from "src/components/svg-color";
import { useResponsive } from "src/hooks/use-responsive";
import { IPost } from "src/types/post";
import Image from "src/components/image";
import { useLocales } from "src/locales";
import PostTextArea from "./inputs/post-modal-text-area";
import PosModalFormLayout from "./form-layout";
import { validationSchema } from "./dataForms";

import PublishRadioButtons from "./inputs/post-modal-publish-radio-buttons";
import PublishDatePicker from "./inputs/post-modal-publish-date-picker";
import PostTypeInstagram from "./inputs/post-modal-post-type-instagram";
import InstagramOptions from "./inputs/post-modal-instagram-options";
import TiktokOptions from "./inputs/post-modal-tiktok-options";
import ImageBox from "./inputs/post-modal-image-box";
import AlertMessages from "./inputs/post-modal-alerts";

interface IDataForm {
  errors: any;
  values: any;
}

const DataForm = ({ errors, values }: IDataForm) => {
  const distpach = useDispatch();

  useEffect(() => {
    distpach(
      setFormData({
        errors,
        values,
      })
    );
  }, [errors, values]);

  return <></>;
};

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

export default function PostModalForm() {
  const tabSelected = useSelector((state: RootState) => state.post.tabSelected);
  const valuesForm = useSelector(
    (state: RootState) => state.post.formData.values
  );
  const socialNetworksConnected = useSelector(
    (state: RootState) => state.post.socialNetworksConnected
  );
  const socialNetworksToPublish = useSelector(
    (state: RootState) => state.post.socialNetworksToPublish
  );
  const theme = useTheme();
  const { t } = useLocales();

  const mdDown = useResponsive("down", "md");

  const dispatch = useDispatch();

  const isConected = socialNetworksConnected.includes(tabSelected);

  const showOverlay = socialNetworksToPublish.includes(tabSelected);

  const handleSubmit = (values: any) => {
    const DataPost: IPost = {
      ...values,
      platforms: [...socialNetworksToPublish],
      creationDate: new Date(),
    };

    dispatch(setPostList(DataPost));
    // cerrar modal
    dispatch(setOpenModalPreviewMobile(false));
    dispatch(setOpenDrawer(false));
  };

  return (
    <PosModalFormLayout>
      <Formik
        initialValues={valuesForm}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, errors }) => (
          <>
            <AlertMessages />

            <Form
              style={{
                position: "relative",
              }}
            >
              {!showOverlay && isConected && (
                <HtmlTooltip
                  followCursor
                  title={
                    <>
                      <Typography variant="button" color="inherit">
                        {t(
                          "Dashboard.Create_Nota.Create.Modal.Tooltip_ToPostIn",
                          {
                            tabSelected,
                          }
                        )}
                      </Typography>{" "}
                      <br />
                      <Typography variant="caption" color="inherit">
                        {t(
                          "Dashboard.Create_Nota.Create.Modal.Tooltip_Activate"
                        )}
                      </Typography>
                      <Box
                        sx={{
                          height: 48,
                          marginTop: "10px",
                          width: 89,
                          border: `1px solid ${theme.palette.background.neutral} !important`,
                          borderRadius: "14.3px",
                          borderColor: `${theme.palette.info.main} !important`,
                          backgroundColor: `${theme.palette.background.default} !important`,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <m.div
                          animate={{
                            scale: [1, 1.5, 1.5, 1, 1],
                            borderRadius: ["0%", "0%", "50%", "50%", "0%"],
                          }}
                          transition={{
                            duration: 2,
                            ease: "easeInOut",
                            times: [0, 0.2, 0.5, 0.8, 1],
                            repeat: Infinity,
                            repeatDelay: 1,
                          }}
                        >
                          <Checkbox checked color="info" />
                        </m.div>
                        {tabSelected === SOCIALNETWORKSNAMES.twitter ? (
                          <SvgColor
                            src={`/assets/icons/dashboard/post/${tabSelected}.svg`}
                            width={24}
                            color={
                              theme.palette.mode === "dark" ? "white" : "black"
                            }
                          />
                        ) : (
                          <Image
                            src={`/assets/icons/dashboard/post/${tabSelected}.svg`}
                            alt={tabSelected}
                            width={24}
                          />
                        )}
                      </Box>
                    </>
                  }
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "calc(100% - 24px)",
                      height: "calc(100vh - 44vh)",
                      zIndex: 1,
                      backgroundColor: alpha(
                        theme.palette.background.neutral,
                        0.6
                      ),
                      borderRadius: "10px",
                    }}
                  />
                </HtmlTooltip>
              )}

              <Stack
                sx={{
                  gap: "24px",
                  p: "0 20px 0 0",
                  height: "calc(100vh - 44vh)",
                  overflowY: "scroll",
                  overflowX: "hidden",
                  "&::-webkit-scrollbar": {
                    position: "absolute",
                    padding: "10px",
                    width: "5px",
                    marginRight: "5px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: alpha(theme.palette.info.main, 0.3),
                    borderRadius: "24px",
                  },
                }}
              >
                {isConected && (
                  <>
                    {tabSelected === SOCIALNETWORKSNAMES.instagram && (
                      <PostTypeInstagram name="instagramOptions" />
                    )}

                    <PostTextArea name="content" />

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "8px",
                      }}
                    >
                      <ImageBox label="Multimedia" name="multimedia" />
                      <ThumbnailsView />
                    </Box>

                    {tabSelected === SOCIALNETWORKSNAMES.instagram && (
                      <InstagramOptions name="instagramComments" />
                    )}

                    {tabSelected === SOCIALNETWORKSNAMES.tiktok && (
                      <TiktokOptions name="tikTokOptions" />
                    )}

                    <PublishRadioButtons name="publish" />

                    {!values.publish && (
                      <PublishDatePicker name="scheduleDate" />
                    )}
                  </>
                )}
              </Stack>
              {mdDown && (
                <Button
                  variant="outlined"
                  color="info"
                  sx={{
                    width: {
                      xs: "100%",
                      md: "20%",
                    },
                  }}
                  onClick={() => dispatch(setOpenModalPreviewMobile(true))}
                >
                  Ver Preview
                </Button>
              )}
              {showOverlay && isConected && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    width: {
                      xs: "100%",
                      md: "20%",
                    },
                    margin: "24px 0",
                  }}
                >
                  {t("Dashboard.Create_Nota.Create.Modal.btn_Post")}
                </Button>
              )}
            </Form>
            <DataForm errors={errors} values={values} />
          </>
        )}
      </Formik>
    </PosModalFormLayout>
  );
}
