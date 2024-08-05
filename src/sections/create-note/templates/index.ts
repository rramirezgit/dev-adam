import { blankContent } from './blank/blank-template';
import { FooterContent } from './footer/footer-content';
import { headerContent } from './header/header-content';
import { noticiasContent } from './noticias/noticias-content';

export const TEMPLATES_WITH_CONTENT = (id: string) => ({
  Header: headerContent(id),
  Footer: FooterContent(id),
  Noticias: noticiasContent(id),
  Blank: blankContent(id),
  Markets: [],
  Quotes: [],
  Publicity: [],
});
