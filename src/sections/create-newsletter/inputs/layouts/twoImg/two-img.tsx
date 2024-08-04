import { useEffect, useState } from 'react';
import UploadImage from '../../uploadImage';

export default function TwoImg({ ...props }) {
  const [imageLeft, setImageLeft] = useState<any>(props.inputs[0]);
  const [imageRight, setImageRight] = useState<any>(props.inputs[1]);

  return (
    <table
      cellSpacing="0"
      cellPadding="0"
      style={{
        maxWidth: 650,
      }}
    >
      <tbody>
        <tr>
          <td
            style={{
              maxHeight: imageLeft?.style?.height,
              width: '294px',
            }}
          >
            <UploadImage
              templateId={imageLeft?.templateId}
              variant={imageLeft?.variant}
              value={imageLeft?.value}
              ImageData={imageLeft?.ImageData}
              inputId={imageLeft?.inputId}
              placeholder={imageLeft?.placeholder}
              parentId={imageLeft?.parentId}
              type={imageLeft?.type}
              style={imageLeft?.style}
            />
          </td>
          <td style={{ width: '8px' }}> </td>
          <td
            style={{
              maxHeight: imageLeft?.style?.height,
              width: '294px',
            }}
          >
            <UploadImage
              templateId={imageRight?.templateId}
              variant={imageRight?.variant}
              value={imageRight?.value}
              ImageData={imageRight?.ImageData}
              inputId={imageRight?.inputId}
              placeholder={imageRight?.placeholder}
              parentId={imageRight?.parentId}
              type={imageRight?.type}
              style={imageRight?.style}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
