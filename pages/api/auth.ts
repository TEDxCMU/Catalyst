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
import { COOKIE } from '@lib/constants';
import { signInUser, signOutUser, getCurrentUser } from '@lib/firestore-api';
import { decrypt } from '@lib/hash';
import cookie from 'cookie';

interface Request extends NextApiRequest {
  netlifyFunctionParams: any;
}

export default async function auth(req: Request, res: NextApiResponse) {
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

  // 2 modes of auth, the cookie and the user looged into Firebase auth.
  // Need to check both, and make sure they correspond 

  const user_id_cookie = req.cookies["user_id"];
  const session_id_cookie = req.cookies["session_id"];
  let authUser = await getCurrentUser();


  if(user_id_cookie && session_id_cookie){
    let emailFromCookie = decrypt(user_id_cookie);
    let passFromCookie = decrypt(session_id_cookie);

    if(authUser){

      // Check whether they actually correspond with eachother
      //console.log("cookie && authUser");
      let emailFromAuth = authUser.email;
      //console.log(`${emailFromAuth} and ${emailFromCookie}`);
      if (emailFromAuth != emailFromCookie){
        //console.log("DO NOT CORRESPOND!");
        // If they don't correspond clear EVERYTHING and return false
        res.setHeader(
          'Set-Cookie',
          [
            cookie.serialize("user_id", user_id_cookie, {
            httpOnly: true,
            maxAge: -1,
            path: '/api'
            }),
            cookie.serialize("session_id", session_id_cookie, {
            httpOnly: true,
            maxAge: -1,
            path: '/api'
            })
          ]
        );
  
        await signOutUser();
  
        return res.status(200).json({ loggedIn: false });
      }

      // id and authUser exist and correspond with eachother, return true
      // and the authUser's info
      return res.status(200).json({ loggedIn: true, user: authUser });

    } else {
      // Sign in with cookie and return true
      // console.log("cookie && !authUser");
      await signInUser(emailFromCookie, passFromCookie);
      authUser = await getCurrentUser();
      return res.status(200).json({ loggedIn: true, user: authUser });
    }
    
  } else {

    // Handle if either one is true
    if(user_id_cookie || session_id_cookie){
      // console.log("cookie existed, deleting now");
      res.setHeader(
        'Set-Cookie',
        [
          cookie.serialize("user_id", user_id_cookie, {
          httpOnly: true,
          maxAge: -1,
          path: '/api'
          }),
          cookie.serialize("session_id", session_id_cookie, {
          httpOnly: true,
          maxAge: -1,
          path: '/api'
          })
        ]
      );
    }

    if(authUser){
      //console.log("!cookie && authUser");
      // Sign out of Firebase auth and return false
      await signOutUser();
      return res.status(200).json({ loggedIn: false });
    }

    //console.log("!cookie && !authUser");
    return res.status(200).json({ loggedIn: false });

  }
  
}
