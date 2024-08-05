/* eslint-disable no-plusplus */
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "src/auth/context/axios/axios-provider";
import { RootState } from "src/store";
import { setCurrentNotaImagesList } from "src/store/slices/note";

export const useProcessImagesS3 = () => {
  const currentNota = useSelector((state: RootState) => state.note.currentNota);
  const currentNotaImagesList = useSelector(
    (state: RootState) => state.note.currentNotaImagesList
  );
  const dispatch = useDispatch();
  const axiosInstance = useAxios();

  const base64ToBlob = (base64: string, mimeType: string) => {
    const bytes = atob(base64.split(",")[1]);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      arr[i] = bytes.charCodeAt(i);
    }
    return new Blob([arr], { type: mimeType });
  };

  const processSingleImageS3 = async (input: any) => {
    if (!input || !input.ImageData?.name) {
      return { images: [] };
    }

    try {
      const formData = new FormData();
      const { type } = input.ImageData;
      const imageBlob = base64ToBlob(input.value, type || "image/jpeg");
      const extension = type?.split("/").pop(); // Extrae 'jpeg' de 'image/jpeg'
      const filename = `file.${extension}`; // Crea 'file.jpeg'

      formData.append("file", imageBlob, filename);
      const { data } = await axiosInstance.post("/media/upload", formData);

      dispatch(
        setCurrentNotaImagesList([
          {
            url: data.s3Url,
            key: data.filename,
            ...input,
          },
          ...currentNotaImagesList,
        ])
      );

      return replaceUrlImagesCurrentNota({
        url: data.s3Url,
        key: data.filename,
        ...input,
      });
    } catch (error) {
      console.error("Hubo un error al procesar la imagen:", error);
      throw error; // O maneja el error como prefieras
    }
  };

  const processImagesS3 = async () => {
    const inputsImages = currentNota.filter(obj =>
      obj.inputs.some(input => input.type === "image" && input?.ImageData?.name)
    );

    const hasImagesWithValues = inputsImages.some(obj =>
      obj.inputs.some(input => input.type === "image" && input?.ImageData?.name)
    );

    if (!hasImagesWithValues) {
      return { images: [] };
    }

    const uploadPromises: Promise<any>[] = [];

    currentNota.forEach(obj => {
      obj.inputs.forEach(input => {
        let uploadPromise = null;
        if (input.type === "image" && input?.ImageData?.name) {
          uploadPromise = new Promise((resolve, reject) => {
            const formData = new FormData();
            const { type } = input.ImageData;
            const imageBlob = base64ToBlob(input.value, type || "image/jpeg");

            // Asegúrate de que el nombre del archivo termina con una extensión válida
            const extension = type?.split("/").pop(); // Esto extrae 'jpeg' de 'image/jpeg'
            const filename = `file.${extension}`; // Esto crea 'file.jpeg'
            formData.append("file", imageBlob, filename);
            axiosInstance
              .post("/media/upload", formData)
              .then(({ data }: any) => {
                resolve({
                  url: data.s3Url,
                  key: data.filename,
                  ...input,
                });
              })
              .catch(error => {
                reject(error);
              });
          });
          uploadPromises.push(uploadPromise);
        } else if (input.type === "layout" && input?.inputs) {
          input.inputs.forEach((input2: any) => {
            if (input2.type === "image" && input2?.ImageData?.name) {
              uploadPromise = new Promise((resolve, reject) => {
                const formData = new FormData();
                const { type } = input2.ImageData;
                const imageBlob = base64ToBlob(
                  input2.value,
                  type || "image/jpeg"
                );

                // Asegúrate de que el nombre del archivo termina con una extensión válida
                const extension = type.split("/").pop(); // Esto extrae 'jpeg' de 'image/jpeg'
                const filename = `file.${extension}`; // Esto crea 'file.jpeg'

                formData.append("file", imageBlob, filename);
                axiosInstance
                  .post("/media/upload", formData)
                  .then(({ data }: any) => {
                    resolve(
                      resolve({
                        url: data.s3Url,
                        key: data.filename,
                        ...input2,
                      })
                    );
                  })
                  .catch(error => {
                    reject(error);
                  });
              });
              uploadPromises.push(uploadPromise);
            }
          });
        }
      });
    });

    const imagesList = await Promise.all(uploadPromises)
      .then((images: any[]) => images)
      .catch(error => {
        console.error("Hubo un error al procesar las imágenes:", error);
        return error;
      })
      .catch(error => {
        console.error("Hubo un error al procesar las imágenes:", error);
        return error;
      });

    dispatch(setCurrentNotaImagesList(imagesList));

    return replaceUrlImagesCurrentNota(imagesList);
  };

  const replaceUrlImagesCurrentNota = (image: any) => {
    const newCurrentNota = currentNota.map(obj => {
      const newInputs = obj.inputs.map(input => {
        if (
          input.type === "image" &&
          input?.ImageData?.name &&
          input.inputId === image.inputId
        ) {
          const newInput = { ...input, value: image.url };
          return newInput;
        }
        if (input.type === "layout" && input?.inputs?.length) {
          const newInputs2 = input.inputs.map(input2 => {
            if (
              input2.type === "image" &&
              input2?.ImageData?.name &&
              input2.inputId === image.inputId
            ) {
              const newInput2 = { ...input2, value: image.url };
              return newInput2;
            }
            return input2;
          });
          return { ...input, inputs: newInputs2 };
        }
        return input;
      });
      return { ...obj, inputs: newInputs };
    });

    return newCurrentNota;
  };

  return { processImagesS3, processSingleImageS3 };
};
