import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';

export default async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    const { userId, userData, token } = req.body;

    try {
      const response = await axios.patch(
        `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/users/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
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
