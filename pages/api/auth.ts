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
import { signOutUser, getCurrentUser, getEmailInfo } from '@lib/firestore-api';
import cookie from 'cookie';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // 2 modes of auth, the username cookie and the user looged into Firebase auth.
  // Need to check both, and make sure they correspond 

  console.log("IN AUTH")
  const id = req.cookies[COOKIE];
  const authUser = await getCurrentUser();

  if (!id && !authUser) {
      console.log("!id && !authUser");
      return res.status(200).json({ loggedIn: false });
  } else if (!id && authUser) {
      console.log("!id && authUser");
      // Sign out of Firebase auth and return false
      await signOutUser();
      return res.status(200).json({ loggedIn: false });
  } else if (id && !authUser){
      console.log("id && !authUser");
      // Delete cookie and return false
      res.setHeader(
        'Set-Cookie',
        cookie.serialize(COOKIE, id, {
          httpOnly: true,
          maxAge: -1,
          path: '/api'
        })
      );
      return res.status(200).json({ loggedIn: false });
  } else if (id && authUser){
    console.log("id && authUser");
    // Check whether they actually correspond with eachother
    let idFromEmail =  await getEmailInfo(authUser.email);
    
    if (idFromEmail != id){
      // If they don't correspond clear BOTH and return false
      res.setHeader(
        'Set-Cookie',
        cookie.serialize(COOKIE, id, {
          httpOnly: true,
          maxAge: -1,
          path: '/api'
        })
      );

      await signOutUser();

      return res.status(200).json({ loggedIn: false });
    }

    return res.status(200).json({ loggedIn: true });
  } else {
    // Should never reach here
    return res.status(200).json({ loggedIn: false });
  }
  
}
