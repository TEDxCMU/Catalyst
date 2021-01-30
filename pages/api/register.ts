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
import { emailToId } from '@lib/hash';
import { incrementTicketCounter, checkUser, registerUser } from '@lib/firestore-api';

type ErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export default async function register(
  req: NextApiRequest,
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

  console.log("register - is post");

  const email: string = ((req.body.email as string) || '').trim().toLowerCase();
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: {
        code: 'bad_email',
        message: 'Invalid email'
      }
    });
  }

  console.log("register - email is valid");

  const password: string = ((req.body.password as string) || '');
  const firstName: string = ((req.body.firstName as string) || '');
  const lastName: string = ((req.body.lastName as string) || '');

  let id;
  let ticketNumber: number;
  let createdAt: number;
  let statusCode: number;
  let name: string;

  
    id = emailToId(email);
    let existingUserId;
    try {
        existingUserId = await checkUser(id);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            error: {
              code: 'user_err',
              message: e.message
            }
        });
    }
    

    if (existingUserId) {
        console.log("register - id already exists");
        return res.status(400).json({
            error: {
              code: 'email_exists',
              message: 'Email already exists'
            }
          });
          
    } else {
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
        
        console.log("register - ticket number is " + ticketNumber);
        createdAt = Date.now();
        name = `${firstName} ${lastName}`
        try{
            await registerUser(id, email, password, firstName, lastName, ticketNumber )
        } catch (e) {
            console.log(e);
            if (e.code?.slice(0, 5) === "auth/"){
                console.log("AUTH ERROR");
                return res.status(400).json({
                    error: {
                    code: 'auth_err',
                    message: e.message
                    }
                });
            }
            
            console.log("FROM ADD USER");
            return res.status(400).json({
                error: {
                    code: 'user_err',
                    message: e.message
                }
            });
            
        }
    
        console.log("register - registered user");
        statusCode = 201;
    }
  

  // Save `key` in a httpOnly cookie
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(COOKIE, id, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/api',
      expires: new Date(Date.now() + ms('7 days'))
    })
  );

  console.log("register - cookie saved");

  return res.status(statusCode).json({
    id,
    email,
    ticketNumber,
    createdAt,
    name
  });
}