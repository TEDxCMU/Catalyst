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

import validator from 'validator';
import cookie from 'cookie';
import ms from 'ms';
import { COOKIE } from '@lib/constants';
import { incrementTicketCounter, registerUser } from '@lib/firebase-server';

export default async function register(req, res) {
  if (req.method !== 'POST') {
    return res.status(501).json({
      error: {
        code: 'method_unknown',
        message: 'This endpoint only responds to POST',
      },
    });
  }

  const email = ((req.body.email) || '').trim().toLowerCase();
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: {
        code: 'bad_email',
        message: 'Invalid email',
      },
    });
  }

  const password = (req.body.password) || '';
  const firstName = (req.body.firstName) || '';
  const lastName = (req.body.lastName) || '';

  let ticketNumber;
  let createdAt;
  let name;
  let username;

  try {
    ticketNumber = await incrementTicketCounter();
  } catch (e) {
    console.error(e);
    return res.status(400).json({
      error: {
        code: 'ticket_err',
        message: e.message,
      },
    });
  }

  createdAt = Date.now();
  name = `${firstName} ${lastName}`;
  // Assume username is the part just before the @ in the email
  // Username is NOT used for auth purposes thus it doesn't have to
  // be unique, it will just be used to display on the ticket
  username = email.split('@')[0];

  try {
    const [token, id] = await registerUser(
      email,
      password,
      firstName,
      lastName,
      username,
      ticketNumber
    );

    res.setHeader(
      'Set-Cookie',
      cookie.serialize(COOKIE, id, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/api',
        expires: new Date(Date.now() + ms('1 day'))
      })
    );
  
    return res.status(201).json({
      token,
      id,
      email,
      username,
      ticketNumber,
      createdAt,
      name,
    });
  } catch (e) {
    console.error(e);
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
        code: 'user_err',
        message: e.message,
      },
    });
  }
}
