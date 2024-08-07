import type { newsletterseccions } from 'src/types/newsletter';

import type { ImageInput } from './inputs/types';

export default function updaloadAllImages(
  uploadImage: any,
  currentNewsletter: newsletterseccions[]
) {
  const inputsImage = currentNewsletter
    .map((section) => section.inputs.filter((input) => input.type === 'image' && input.value))
    .flat() as ImageInput[];

  inputsImage.forEach((input) => {
    uploadImage({
      image: input.value,
      callback: (data: any) => {},
    });
  });
}
