/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-spread */
/* eslint-disable @next/next/no-img-element */
import { DependencyList, useEffect, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import {
  Box,
  Checkbox,
  IconButton,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
// import { setDataImageCroped, setOpenModalPreviewMobile } from 'src/store/slices/post';
import {
  setDataImageCrop,
  setDataImageCroped,
  setErrors,
  setImagesSaved,
  setMenu,
  setcurrentNota,
  updateImageDataNota,
  updateValueInputNota,
} from "src/store/slices/note";
import { useLocales } from "src/locales";
import ColorPicker from "src/components/colorPicker";
import "react-image-crop/dist/ReactCrop.css";
import Iconify from "src/components/iconify";
import { m } from "framer-motion";
import { LoadingButton } from "@mui/lab";
import { varFade } from "src/components/animate";
import { imgPreview } from "./imgPreview";
import useGetInputValue from "../../inputs/getValue";
import { useProcessImagesS3 } from "./proccesImageS3";

export default function CropSection() {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const [loading, setLoading] = useState(false);

  const { processImagesS3, processSingleImageS3 } = useProcessImagesS3();

  const [showOptionsCrop, setOptionsCrop] = useState(false);

  const { t } = useLocales();
  const distpatch = useDispatch();

  const { dataImageCrop, menuData, dataImageCroped, errors } = useSelector(
    (state: RootState) => state.note
  );

  const imgRef = useRef<HTMLImageElement>(null);

  const ids = {
    templateId: menuData.templateId as string,
    inputId: menuData.inputId as string,
    parentId: menuData?.parentId as string,
  };

  const distpach = useDispatch();

  const inputData = useGetInputValue({
    inputId: menuData.inputId as string,
    templateId: menuData.templateId as string,
    parentId: menuData.parentId as string,
  });

  function useDebounceEffect(fn: any, waitTime: number, deps?: DependencyList) {
    useEffect(() => {
      const time = setTimeout(() => {
        fn.apply(undefined, deps);
      }, waitTime);

      return () => {
        clearTimeout(time);
      };
    }, deps);
  }

  useDebounceEffect(
    async () => {
      let b64 = "";
      if (completedCrop?.width && completedCrop?.height && imgRef?.current) {
        b64 = imgPreview(imgRef.current, completedCrop, scale, rotate);
        distpach(
          updateValueInputNota({
            value: b64,
            inputId: menuData.inputId as string,
            templateId: menuData.templateId as string,
            parentId: menuData.parentId as string,
          })
        );
        distpach(setImagesSaved(false));
        setOptionsCrop(true);
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  const handleSave = () => {
    setLoading(true);
    processSingleImageS3(inputData).then(newCurrentNeswletter => {
      setLoading(false);
      distpach(setMenu({ type: "none" }));
      distpach(setDataImageCrop({ imageData: "", name: "", type: "" }));
      distpach(setDataImageCroped({ imageData: "", name: "", type: "" }));
      distpach(setcurrentNota(newCurrentNeswletter));
      distpach(setImagesSaved(true));
    });
  };

  type TypesUpdateDataImage = {
    key: "bgColor" | "adjustImageCrop" | "name" | "type";
    value: string | boolean;
  };

  const updateDataImage = ({ key, value }: TypesUpdateDataImage) => {
    distpatch(
      updateImageDataNota({
        ImageData: { [key]: value },
        ...ids,
      })
    );
  };

  const handleChangeBgColorIamge = (e: any) => {
    updateDataImage({ key: "bgColor", value: e.target.value });
  };

  const handleChangeSizeimage = (e: any) =>
    updateDataImage({ key: "adjustImageCrop", value: e.target.checked });

  const loadedImage = () => {
    distpach(
      updateValueInputNota({
        value: dataImageCrop?.imageData as string,
        ...ids,
      })
    );

    updateDataImage({ key: "name", value: dataImageCrop?.name as string });
    updateDataImage({ key: "type", value: dataImageCrop?.type as string });
    updateDataImage({ key: "bgColor", value: "white" });

    /// si existe un error para este input, lo borramos

    const newErrors = errors.filter(
      (error: any) => error.inputId !== menuData.inputId
    );

    distpach(setErrors(newErrors));
  };

  const handleClickReset = () => {
    distpach(
      setDataImageCroped({
        imageData: dataImageCrop?.imageData as string,
        name: "",
        type: "",
      })
    );
    setCrop(undefined);
    setCompletedCrop(undefined);
    setOptionsCrop(false);
    loadedImage();

    setScale(1);
    setRotate(0);

    updateDataImage({ key: "adjustImageCrop", value: true });
    updateDataImage({ key: "bgColor", value: "white" });
  };

  const handleClicDelete = () => {
    updateDataImage({ key: "adjustImageCrop", value: true });
    updateDataImage({ key: "bgColor", value: "white" });

    distpatch(
      updateValueInputNota({
        value: "",
        ...ids,
      })
    );
    distpach(setMenu({ type: "none" }));
    distpach(
      setDataImageCrop({
        imageData: "",
        name: "",
        type: "",
      })
    );

    distpach(
      setDataImageCroped({
        imageData: "",
        name: "",
        type: "",
      })
    );
  };

  return (
    <>
      <Stack
        width="100%"
        padding="0 24px 0 0"
        gap={2}
        sx={{
          mb: 2,
          transition: "all 1s ease",
        }}
      >
        <ColorPicker
          label="Color de fondo"
          name="color"
          onChange={handleChangeBgColorIamge}
          value={inputData.ImageData.bgColor}
        />

        {showOptionsCrop && (
          <m.div initial="initial" animate="animate" variants={varFade().in}>
            <Box>
              <Typography>
                {t("Dashboard.Create_Nota.Create.Modal.Crop_Scale")}
              </Typography>
              <Slider
                size="small"
                defaultValue={1}
                step={0.1}
                min={0}
                max={5}
                value={scale}
                marks
                valueLabelDisplay="auto"
                disabled={!dataImageCroped}
                onChange={(event: Event, newValue: number | number[]) =>
                  setScale(Number(newValue))
                }
              />
            </Box>

            <Box>
              <Typography>
                {t("Dashboard.Create_Nota.Create.Modal.Crop_Rotate")}
              </Typography>
              <Slider
                size="small"
                step={1}
                min={-180}
                max={180}
                value={rotate}
                marks
                valueLabelDisplay="auto"
                disabled={!dataImageCroped?.imageData}
                onChange={(event: Event, newValue: number | number[]) =>
                  setRotate(Math.min(180, Math.max(-180, Number(newValue))))
                }
              />
            </Box>
          </m.div>
        )}
        <Stack direction="row" alignItems="center">
          <Box flex={1}>
            <Checkbox
              sx={{ margin: "0px 10px 0px 0px" }}
              onChange={handleChangeSizeimage}
              defaultChecked
              checked={inputData.ImageData.adjustImageCrop}
            />
            ajustar Image
          </Box>
          <Box>
            <IconButton
              onClick={handleClickReset}
              disabled={!dataImageCroped?.imageData}
            >
              <Iconify icon="mdi:restore" />
            </IconButton>
            <IconButton
              onClick={handleClicDelete}
              disabled={!dataImageCroped?.imageData}
            >
              <Iconify icon="mdi:delete" />
            </IconButton>
          </Box>
        </Stack>
      </Stack>

      {dataImageCroped?.imageData && dataImageCroped?.imageData.length > 0 && (
        <ReactCrop
          crop={crop}
          maxHeight={imgRef?.current?.height}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={c => setCompletedCrop(c)}
          style={{
            width: "100%",
          }}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={dataImageCroped?.imageData}
            onLoad={loadedImage}
            style={{
              transform: `scale(${scale}) rotate(${rotate}deg)`,
              background: "white",
              objectFit: "contain",
            }}
          />
        </ReactCrop>
      )}
      <LoadingButton
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{
          width: {
            xs: "100%",
            md: "20%",
          },
          margin: "0 0 24px 0",
          alignSelf: "flex-start",
        }}
        loading={loading}
      >
        Guardar
      </LoadingButton>
    </>
  );
}
