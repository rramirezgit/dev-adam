import { CONFIG } from 'src/config-global';

import { AuthOSignInView } from 'src/sections/auth/AuthO';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | Auth0 - ${CONFIG.site.name}` };

export default function Page() {
  return <AuthOSignInView />;
}
