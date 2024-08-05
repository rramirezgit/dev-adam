export const htmlWrap = ({ body, option, currentNotaId }: any) => `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title></title>
  <!--[if mso]>
  <style>
    table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    table, td, div, h1, p {
      font-family:  -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    .im {
      color: #000000 !important;
    }
    
    @media screen and (max-width: 530px) {
       .img-text-prueba {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-top: 20px;
          width: 100%;
        }
      
        .img-text-prueba img {
          width: 100%;
          height: auto;
        }
      
        .img-text-prueba td {
          width: 100%;
        }
      
    }
    @media screen and (max-width: 764px) {
      .col-sml {
        max-width: 100% !important;
      }
    
      .col-sml div {
        width: 100% !important;
      }
    
      .col-sml img {
        width: 100% !important;
      }
    
      .col-lge {
        max-width: 100% !important;
        margin-top: 10px;
      }
    }
  </style>
</head>
<body>
  ${body}
  ${
    option === 'aprobar'
      ? `<table width="100%" border="0" cellspacing="0" cellpadding="0" class="img-text-prueba">
      <tr>
        <td>
          <a href="${process.env.NEXT_PUBLIC_HOST_FRONT}/dashboard/create-note/${currentNotaId}/request-approval" style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">
            Dar Feedback
          </a>
        </td>
      </tr>
    </table>`
      : ''
  }
</body>
</html>`;
