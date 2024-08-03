import { CONFIG } from 'src/config-global';

import { AtuhOSignUpView } from 'src/sections/auth/AuthO';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign up | Jwt - ${CONFIG.site.name}` };

export default function Page() {
  return <AtuhOSignUpView />;
}
