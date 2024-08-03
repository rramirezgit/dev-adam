/* eslint-disable consistent-return */
import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';

export default async function fetchUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { authorization } = req.headers;
      const token = authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
      }

      const response = await axios.get(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      res.status(200).json(response.data);
    } catch (error: any) {
      res.status(error.response.status).json({ message: error.response.data.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
