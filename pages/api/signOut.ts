import { NextApiRequest, NextApiResponse } from 'next';
import { signOutUser, getCurrentUser } from '@lib/firestore-api';
import { COOKIE } from '@lib/constants';
import cookie from 'cookie';

export default async function signOut(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.cookies[COOKIE];
  const authUser = await getCurrentUser();

  if (id) {
    // Deletes the cookie by making it expire immediately
    res.setHeader(
      'Set-Cookie',
      cookie.serialize(COOKIE, id, {
        httpOnly: true,
        maxAge: -1,
        path: '/api',
      })
    );
  }

  if (authUser) {
    await signOutUser();
  }

  return res.status(200).json({ signOutSuccess: true });
}
