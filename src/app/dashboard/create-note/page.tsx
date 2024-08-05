import { CONFIG } from 'src/config-global';
import { CreateNoteHome } from 'src/sections/create-note/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - Creador de notas` };

export default function CreatePostPage() {
  return <CreateNoteHome />;
}
