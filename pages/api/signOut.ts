import { NextApiRequest, NextApiResponse } from 'next';
import { COOKIE } from '@lib/constants';
import cookie from 'cookie';

export default async function signOut(req: NextApiRequest, res: NextApiResponse) {
  const id = req.cookies[COOKIE];

  if (!id) {
    return res.status(401).json({
      error: {
        code: 'missing_cookie',
        message: 'Missing cookie'
      }
    });
  }

  // Deletes the cookie by making it expire immediately
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(COOKIE, id, {
      httpOnly: true,
      maxAge: -1,
      path: '/api'
    })
  );

  return res.status(200).json({ signOutSuccess: true });
}


