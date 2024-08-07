import type { ImageInput } from './inputs/types';

export default function updaloadAllImages(uploadImage: any, currentNota: any[]) {
  const inputsImage = currentNota
    .map((section) => section.inputs.filter((input: any) => input.type === 'image' && input.value))
    .flat() as ImageInput[];

  inputsImage.forEach((input) => {
    uploadImage({
      image: input.value,
      callback: (data: any) => {},
    });
  });
}
