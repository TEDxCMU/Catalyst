import { NextApiRequest, NextApiResponse } from 'next';
import { signOutUser, getCurrentUser} from '@lib/firestore-api';
import { COOKIE } from '@lib/constants';
import cookie from 'cookie';

interface Request extends NextApiRequest {
  netlifyFunctionParams: any;
}

export default async function signOut(req: Request, res: NextApiResponse) {
  // Get event and context from Netlify Function
  const { context } = req.netlifyFunctionParams || {};

  // If we are currently in a Netlify function (deployed on netlify.app or
  // locally with netlify dev), do not wait for empty event loop.
  // See: https://stackoverflow.com/a/39215697/6451879
  // Skip during next dev.
  if (context) {
    console.log("Setting callbackWaitsForEmptyEventLoop: false");
    context.callbackWaitsForEmptyEventLoop = false;
  }

  const id = req.cookies[COOKIE];
  const authUser = await getCurrentUser();

  if (id) {
    // Deletes the cookie by making it expire immediately
    res.setHeader(
      'Set-Cookie',
      cookie.serialize(COOKIE, id, {
        httpOnly: true,
        maxAge: -1,
        path: '/api'
      })
    );
  }

  if(authUser) {
    await signOutUser();
  }

  return res.status(200).json({ signOutSuccess: true });
}


