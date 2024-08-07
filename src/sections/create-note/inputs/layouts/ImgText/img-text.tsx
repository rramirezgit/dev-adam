import { useState } from 'react';

import UploadImage from '../../uploadImage';
import TextBubble from '../../bubbles/bubble';

export default function ImgText({ ...props }: any) {
  const [image] = useState<any>(props.inputs.find((input: any) => input.type === 'image'));
  const [title] = useState<any>(
    props.inputs.find((input: any) => input.type === 'text' && input.variant === 'title')
  );
  const [paragraph] = useState<any>(
    props.inputs.find((input: any) => input.type === 'text' && input.variant === 'paragraph')
  );

  return (
    <table
      width="100%"
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
              fontSize: '0',
              verticalAlign: 'center',
            }}
          >
            <div
              className="col-sml"
              style={{
                display: 'inline-block',
                height: 'auto',
                width: '100%',
                maxWidth: '136px',
                textAlign: 'left',
                alignContent: 'center',
                verticalAlign: 'middle',
              }}
            >
              <UploadImage
                templateId={image?.templateId}
                variant={image?.variant}
                value={image?.value}
                ImageData={image?.ImageData}
                inputId={image?.inputId}
                placeholder={image?.placeholder}
                parentId={image?.parentId}
                type={image?.type}
                isEmail={props.isEmail}
                style={{
                  ...image?.style,
                }}
              />
            </div>

            <div
              className="col-lge"
              style={{
                display: 'inline-block',
                width: '100%',
                maxWidth: '460px',
                verticalAlign: 'middle',
              }}
            >
              <TextBubble
                name={title?.name}
                parentId={title?.parentId}
                placeholder={title?.placeholder}
                style={title?.style}
                variant={title?.variant}
                value={title?.value}
                inputId={title?.inputId}
                maxLength={title?.maxLength}
                isEmail={props.isEmail}
                minLength={title?.minLength}
                templateId={title?.templateId}
                type={title?.type}
                errorName={title?.errorName}
              />
              <div
                style={{
                  height: '10px',
                }}
              />
              <TextBubble
                name={paragraph?.name}
                parentId={paragraph?.parentId}
                placeholder={paragraph?.placeholder}
                style={paragraph?.style}
                isEmail={props.isEmail}
                variant={paragraph?.variant}
                value={paragraph?.value}
                inputId={paragraph?.inputId}
                maxLength={paragraph?.maxLength}
                minLength={paragraph?.minLength}
                templateId={paragraph?.templateId}
                type={paragraph?.type}
                errorName={paragraph?.errorName}
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
