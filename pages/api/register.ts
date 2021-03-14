/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { ConfUser } from '@lib/types';
import validator from 'validator';
import { COOKIE } from '@lib/constants';
import cookie from 'cookie';
import ms from 'ms';
import { encrypt } from '@lib/hash';
import { incrementTicketCounter, registerUser } from '@lib/firestore-api';

type ErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

interface Request extends NextApiRequest {
  netlifyFunctionParams: any;
}

export default async function register(
  req: Request,
  res: NextApiResponse<ConfUser | ErrorResponse>
) {
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
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: {
        code: 'bad_email',
        message: 'Invalid email'
      }
    });
  }

  const password: string = ((req.body.password as string) || '');
  const firstName: string = ((req.body.firstName as string) || '');
  const lastName: string = ((req.body.lastName as string) || '');

  let id;
  let ticketNumber: number;
  let createdAt: number;
  let statusCode: number;
  let name: string;
  let username: string;

  
  try{
      ticketNumber = await incrementTicketCounter();
  } catch (e) {
      console.log(e);
      return res.status(400).json({
          error: {
            code: 'ticket_err',
            message: e.message
          }
      });
  }
  
  createdAt = Date.now();
  name = `${firstName} ${lastName}`
  // Assume username is the part just before the @ in the email
  // Username is NOT used for auth purposes thus it doesn't have to
  // be unique, it will just be used to display on the ticket
  username = email.split('@')[0];

  try{
      id = await registerUser(email, password, firstName, lastName, username, ticketNumber)
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
              code: 'user_err',
              message: e.message
          }
      });
      
  }
  
  statusCode = 201;
 
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


  return res.status(statusCode).json({
    id,
    email,
    username,
    ticketNumber,
    createdAt,
    name
  });
}