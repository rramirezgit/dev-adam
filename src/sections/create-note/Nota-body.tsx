/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/self-closing-comp */
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import TemplateView from './templates/template-view';

export default function NotaBody({ isEmail }: { isEmail?: boolean }) {
  const currentNesletter = useSelector((state: RootState) => state.note.currentNota);
  return (
    <table
      width="100%"
      cellSpacing="0"
      cellPadding="0"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, sans-serif',
        fontSize: '12px',
        fontStyle: 'normal',
        fontVariantCaps: 'normal',
        fontWeight: '400',
        letterSpacing: 'normal',
        textAlign: 'start',
        textTransform: 'none',
        whiteSpace: 'normal',
        wordSpacing: '0px',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        minWidth: '520px',
      }}
    >
      <tbody>
        <tr>
          <td style={{ width: '100%' }}>
            {currentNesletter.map((item, index) => (
              <div key={item.templateId}>
                <TemplateView isEmail={isEmail} {...item} />
              </div>
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
