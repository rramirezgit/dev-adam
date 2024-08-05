import {
  Tabs,
  styled,
  Tab,
  Checkbox,
  Box,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Image from "src/components/image/image";
import SvgColor from "src/components/svg-color";
import { SOCIALNETWORKS, SOCIALNETWORKSNAMES } from "src/const/post/redes";
import { useLocales } from "src/locales";
import { RootState } from "src/store";
import {
  setSocialNetworksToPublish,
  setTabSelected,
} from "src/store/slices/post";

const StyledTabs = styled(Tab)(({ theme }) => ({
  "&.MuiTab-root": {
    height: 40,
    padding: "10px",
    marginLeft: "1px",
    marginRight: "16px",
    "&.MuiTab-root": {
      border: `1px solid ${theme.palette.background.neutral} !important`,
      borderRadius: 14.3,
    },
    "&.Mui-selected": {
      // border: `1px solid ${theme.palette.info.main} !important`,
      backgroundColor: `${theme.palette.background.default} !important`,
    },
  },
}));
export default function PostModalSocialButtons() {
  const tabSelected = useSelector((state: RootState) => state.post.tabSelected);
  const socialNetworksConnected = useSelector(
    (state: RootState) => state.post.socialNetworksConnected
  );
  const socialNetworksToPublish = useSelector(
    (state: RootState) => state.post.socialNetworksToPublish
  );
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useLocales();

  return (
    <Box>
      <Tabs
        value={tabSelected}
        variant="scrollable"
        scrollButtons="auto"
        onChange={(e, newNalue) => dispatch(setTabSelected(newNalue))}
        sx={{
          alignSelf: "start",

          "& .MuiTabs-indicator": {
            backgroundColor: "transparent",
            borderRadius: "14.3px",
            height: 48,
            border: `1px solid ${theme.palette.info.main} !important`,
          },
          "& .MuiTab-root": {
            color: "text.secondary",
          },
          "& .MuiTabScrollButton-horizontal": {
            display: "none",
          },
        }}
      >
        {SOCIALNETWORKS.map((item, index) => (
          <StyledTabs
            key={index}
            value={item.name}
            sx={{
              width: { xs: 120, md: "auto" },
            }}
            icon={
              <>
                <Tooltip
                  title={t(
                    "Dashboard.Create_Nota.Create.Modal.Tooltip_ToPostIn",
                    {
                      tabSelected: item.name,
                    }
                  )}
                  arrow
                  placement="top-start"
                >
                  <Checkbox
                    value={socialNetworksToPublish.some(
                      social => social === item.name
                    )}
                    disabled={
                      !socialNetworksConnected.some(
                        social => social === item.name
                      )
                    }
                    onChange={(e, value) =>
                      dispatch(
                        setSocialNetworksToPublish(
                          value
                            ? [...socialNetworksToPublish, item.name]
                            : socialNetworksToPublish.filter(
                                social => social !== item.name
                              )
                        )
                      )
                    }
                    checked={socialNetworksToPublish.some(
                      social => social === item.name
                    )}
                    sx={{
                      right: { xs: 15, md: 5 },
                      "&.Mui-checked": {
                        color: theme.palette.info.main,
                      },
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                      },
                    }}
                  />
                </Tooltip>
                {item.name === SOCIALNETWORKSNAMES.twitter ? (
                  <SvgColor
                    src={`/assets/icons/dashboard/post/${item.name}.svg`}
                    width={24}
                    color={theme.palette.mode === "dark" ? "white" : "black"}
                  />
                ) : (
                  <Image
                    src={`/assets/icons/dashboard/post/${item.name}.svg`}
                    alt={item.name}
                    width={24}
                  />
                )}
              </>
            }
          />
        ))}
      </Tabs>
    </Box>
  );
}
