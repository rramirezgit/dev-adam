import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const response = await axios.post(
        `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`,
        {
          grant_type: 'password',
          username: email,
          password,
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          scope: 'openid profile email',
          client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          connection: 'Username-Password-Authentication', // Especificar la conexión aquí
        }
      );

      const { access_token, id_token } = response.data;

      res.status(200).json({ accessToken: access_token, idToken: id_token });
    } catch (error) {
      res.status(error.response.status).json({ message: error.response.data.error_description });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
