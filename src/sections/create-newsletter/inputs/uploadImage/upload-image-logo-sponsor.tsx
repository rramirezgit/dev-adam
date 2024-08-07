import type { RootState } from 'src/store';

import { useSelector } from 'react-redux';

import UploadImage from './upload-image';

export default function UploadImageLogoSponsor({ ...props }: any) {
  const currentNewsletterId = useSelector(
    (state: RootState) => state.newsletter.currentNewsletterId
  );
  return (
    <table
      width="100%"
      cellSpacing="0"
      cellPadding="0"
      style={{
        maxWidth: 650,
        margin: '0 auto 26px auto',
      }}
    >
      <tbody>
        <tr>
          <td>
            <table
              cellSpacing="0"
              cellPadding="0"
              style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    <a
                      href={`${process.env.NEXT_PUBLIC_HOST_FRONT}/newsletter/view-online/${currentNewsletterId}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                      }}
                    >
                      View Online
                    </a>
                    <span
                      style={{
                        margin: '0 10px',
                      }}
                    >
                      |
                    </span>
                    <a
                      href="https://adac.mx/newsletter-subscription"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',

                        textDecoration: 'none',
                      }}
                    >
                      Sign Up
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <img
              src="https://s3.amazonaws.com/s3.condoor.ai/adam/53de62819a.png"
              width="251"
              height={91}
              alt="logo"
              loading="lazy"
              style={{ display: 'block', marginTop: '25px' }}
            />
          </td>
          <td align="right">
            <table>
              <tr>
                <td>
                  <div
                    style={{
                      textAlign: 'start',
                      fontSize: '14px',
                    }}
                  >
                    Juntos con:
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <UploadImage
                    templateId={props.templateId}
                    variant={props.variant}
                    value={props.value}
                    ImageData={props.ImageData}
                    inputId={props.inputId}
                    placeholder={props.placeholder}
                    type={props.type}
                    style={props.style}
                    parentId={props?.parentId}
                  />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
