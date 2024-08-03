import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const response = await axios.post(
        `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/dbconnections/signup`,
        {
          client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
          email,
          password,
          connection: 'Username-Password-Authentication',
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
