import { PixelCrop } from 'react-image-crop';
import { canvasPreview } from './canvasPreview';

export function imgPreview(image: HTMLImageElement, crop: PixelCrop, scale = 1, rotate = 0) {
  const canvas = document.createElement('canvas');
  canvasPreview(image, canvas, crop, scale, rotate);
  const base64Image = canvas.toDataURL(image.src.split(';')[0].split(':')[1]);
  const base64Data = base64Image;
  return base64Data;
}
