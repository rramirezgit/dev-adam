import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { ImageInput, ILayout } from "./types";

interface IgetInputValue {
  inputId: string;
  templateId: string;
  parentId?: string;
}

export default function useGetInputValue({
  inputId,
  templateId,
  parentId,
}: IgetInputValue) {
  const [value, setValue] = useState<any>({
    inputId,
    templateId,
    parentId,
    value: "",
    ImageData: {
      url: "",
      bgColor: "",
      adjustImageCrop: true,
    },
  });

  const currentNota = useSelector((state: RootState) => state.note.currentNota);

  useEffect(() => {
    let input = currentNota
      .find(item => item.templateId === templateId)
      ?.inputs.find(
        item => item.inputId === inputId && item.type === "image"
      ) as ImageInput;

    if (input === undefined) {
      const layout = currentNota
        .find(item => item.templateId === templateId)
        ?.inputs.find(
          item2 => item2.inputId === parentId && item2.type === "layout"
        ) as ILayout;

      input = layout?.inputs.find(
        (input2: any) => input2.inputId === inputId
      ) as ImageInput;
    }

    let ImageData = {};

    if (input?.type === "image") {
      ImageData = {
        ...input?.ImageData,
      };
    }

    setValue({
      value: input?.value,
      ImageData,
      inputId,
      templateId,
      parentId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNota]);

  return value;
}
