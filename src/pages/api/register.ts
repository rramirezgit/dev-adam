import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, given_name, family_name } = req.body;

    try {
      const response = await axios.post(
        `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/dbconnections/signup`,
        {
          client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
          email,
          password,
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          scope: 'openid profile email',
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          connection: 'Username-Password-Authentication',
          user_metadata: {
            given_name,
            family_name,
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error: any) {
      res.status(error.response.status).json({ message: error.response.data.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
