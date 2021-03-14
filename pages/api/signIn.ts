import { NextApiRequest, NextApiResponse } from 'next';
import { COOKIE } from '@lib/constants';
import cookie from 'cookie';
import ms from 'ms';
import { encrypt } from '@lib/hash';
import { checkUser, getCurrentUser, signInUser } from '@lib/firestore-api';

type ErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

interface Request extends NextApiRequest {
  netlifyFunctionParams: any;
}

export default async function signIn( req: Request, res: NextApiResponse) 
{
  if (req.method !== 'POST') {
    return res.status(501).json({
      error: {
        code: 'method_unknown',
        message: 'This endpoint only responds to POST'
      }
    });
  }

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

  const email: string = ((req.body.email as string) || '').trim().toLowerCase();
  const password: string = ((req.body.password as string) || '');
  let user;
  let id;

    try{
        await signInUser(email, password);
    } catch (e) {
        console.log(e);
        if (e.code?.slice(0, 5) === "auth/"){
            return res.status(400).json({
                error: {
                code: 'auth_err',
                message: e.message
                }
            });
        }

        return res.status(400).json({
            error: {
                code: 'other_err',
                message: e.message
            }
        });
        
    }
  
  user = await getCurrentUser();
  if (!user){
    return res.status(400).json({
      error: {
          code: 'other_err',
          message: "Could not get Current User"
      }
    });
  }

  // If no information is saved to this user in firestore, return error
  id = user.uid;
  let infoExists = await checkUser(id);
  if(!infoExists) {
    return res.status(400).json({
      error: {
          code: 'no_data_err',
          message: "Data could not be found for this account."
      }
    });

  }

  // Save `key` in a httpOnly cookie
  res.setHeader(
    'Set-Cookie',
    [
      cookie.serialize("user_id", encrypt(email), {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/api',
        expires: new Date(Date.now() + ms('1 day'))
      }),
      cookie.serialize("session_id", encrypt(password), {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/api',
        expires: new Date(Date.now() + ms('1 day'))
      })
    ]
  );

  return res.status(200).json({ signInSuccess: true });
}