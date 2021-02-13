import { NextApiRequest, NextApiResponse } from 'next';
import { COOKIE } from '@lib/constants';
import cookie from 'cookie';
import ms from 'ms';
import { checkUser, getCurrentUser, signInUser } from '@lib/firebase-server';

type ErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(501).json({
      error: {
        code: 'method_unknown',
        message: 'This endpoint only responds to POST',
      },
    });
  }

  const email: string = (req.body.email as string) || '';
  const password: string = (req.body.password as string) || '';
  let user;
  let id;

  try {
    await signInUser(email, password);
  } catch (e) {
    console.log(e);
    if (e.code?.slice(0, 5) === 'auth/') {
      return res.status(400).json({
        error: {
          code: 'auth_err',
          message: e.message,
        },
      });
    }

    return res.status(400).json({
      error: {
        code: 'other_err',
        message: e.message,
      },
    });
  }

  user = await getCurrentUser();
  if (!user) {
    return res.status(400).json({
      error: {
        code: 'other_err',
        message: 'Could not get Current User',
      },
    });
  }

  // If no information is saved to this user in firestore, return error
  id = user.uid;
  let infoExists = await checkUser(id);
  if (!infoExists) {
    return res.status(400).json({
      error: {
        code: 'no_data_err',
        message: 'Data could not be found for this account.',
      },
    });
  }

  // Save `key` in a httpOnly cookie
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(COOKIE, id, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/api',
      expires: new Date(Date.now() + ms('1 day')),
    })
  );

  return res.status(200).json({ signInSuccess: true });
}
