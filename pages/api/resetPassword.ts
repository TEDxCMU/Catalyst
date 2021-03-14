import { NextApiRequest, NextApiResponse } from 'next';
import { COOKIE } from '@lib/constants';
import cookie from 'cookie';
import ms from 'ms';
import { encrypt } from '@lib/hash';
import { resetPassword } from '@lib/firestore-api';

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
  
    try{
        await resetPassword(email);
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

  return res.status(200).json({ sentEmail: true });
}