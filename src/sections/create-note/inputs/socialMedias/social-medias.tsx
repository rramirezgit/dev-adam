import type { RootState } from 'src/store';

import { useSelector } from 'react-redux';

import { alpha } from '@mui/material';

const socialMedia = [
  {
    id: 1,
    img: 'https://adac-development.s3.us-west-2.amazonaws.com/Media/_Instagram.png',
    href: 'https://www.instagram.com/adac.mx/?igshid=YmMyMTA2M2Y%3D',
  },
  {
    id: 2,
    img: 'https://adac-development.s3.us-west-2.amazonaws.com/Media/layer1.png',
    href: 'https://x.com/adac_mx',
  },
  {
    id: 3,
    img: 'https://adac-development.s3.us-west-2.amazonaws.com/Media/_TikTok.png',
    href: 'https://www.tiktok.com/@adac.mx?_t=8aiajvpippc&_r=1',
  },
  {
    id: 4,
    img: 'https://adac-development.s3.us-west-2.amazonaws.com/Media/_Linkedin.png',
    href: 'https://www.linkedin.com/company/adacmx/',
  },
  {
    id: 5,
    img: 'https://adac-development.s3.us-west-2.amazonaws.com/Media/_Facebook_.png',
    href: 'https://www.facebook.com/profile.php?id=100090649664671',
  },
];

export default function SocialMedias({ ...props }: any) {
  return (
    <table
      style={{
        width: '45%',
        borderCollapse: 'collapse',
        borderSpacing: 0,
      }}
    >
      <tbody>
        <tr>
          {socialMedia.map((item) => (
            <Item key={item.id} templateId={props.templateId} {...item} />
          ))}
        </tr>
      </tbody>
    </table>
  );
}

interface ItemProps {
  id: number;
  img: string;
  href: string;
  templateId: string;
}

const Item = ({ id, img, href, templateId }: ItemProps) => {
  const currentNota = useSelector((state: RootState) => state.note.currentNota);

  return (
    <td>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        style={{
          backgroundColor: alpha(
            currentNota.find((item) => item.templateId === templateId)?.color as string,
            0.5
          ),
          borderRadius: '20px',
          width: '36px',
          height: '36px',
          marginRight: '10px',
          display: 'block',
        }}
      >
        <img
          src={img}
          alt="social-media"
          width={18}
          height={18}
          style={{
            margin: '9px',
          }}
        />
      </a>
    </td>
  );
};
