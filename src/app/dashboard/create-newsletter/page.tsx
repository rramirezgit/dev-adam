import { CONFIG } from 'src/config-global';
import { CreateNewsletterHome } from 'src/sections/create-newsletter/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function CreatePostPage() {
  return <CreateNewsletterHome />;
}
