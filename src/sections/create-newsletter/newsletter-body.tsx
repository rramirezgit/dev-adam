/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/self-closing-comp */
import { Button, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import { setMenu } from 'src/store/slices/newsletterStore';
import TemplateView from './templates/template-view';
import { RootState } from 'src/store';

export default function NewsletterBody({ isEmail }: { isEmail?: boolean }) {
  const currentNesletter = useSelector((state: RootState) => state.newsletter.currentNewsletter);

  const haveHeader = useSelector((state: RootState) => state.newsletter.header);

  const lastIndex = currentNesletter.length - 1;

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
                {index === lastIndex && !isEmail && !haveHeader && <ButtonAddTemplate />}
                <TemplateView isEmail={isEmail} {...item} />
                {index === lastIndex - 1 && !isEmail && haveHeader && <ButtonAddTemplate />}
              </div>
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

const ButtonAddTemplate = () => {
  const Theme = useTheme();

  const open = useSelector((state: RootState) => state.newsletter.menuData.type === 'add-template');
  const dispatch = useDispatch();
  return (
    <Box
      id="add-template"
      sx={{
        width: '100%',
        margin: '10px auto',
        display: open ? 'none' : 'flex',
        justifyContent: 'center',
        transition: Theme.transitions.create('all', {
          easing: Theme.transitions.easing.easeInOut,
          duration: Theme.transitions.duration.standard,
        }),
      }}
    >
      <Button variant="contained" onClick={() => dispatch(setMenu({ type: 'add-template' }))}>
        + Agregar template
      </Button>
    </Box>
  );
};
