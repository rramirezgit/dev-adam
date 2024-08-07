import type { INewsletter, INewslettersNames } from 'src/types/newsletter';

export const TEMPLATESNAMES: { [key in INewslettersNames]: INewslettersNames } = {
  Header: 'Header',
  Noticias: 'Noticias',
  Footer: 'Footer',
  Blank: 'Blank',
};

export const NEWSLETTERS_TEMPLATES_LIST_MENU: INewsletter[] = [
  {
    name: TEMPLATESNAMES.Blank,
  },
  {
    name: TEMPLATESNAMES.Header,
  },
  {
    name: TEMPLATESNAMES.Noticias,
  },
];
