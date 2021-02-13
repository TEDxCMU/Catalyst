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
import { signOutUser, getCurrentUser } from '@lib/firestore-api';
import cookie from 'cookie';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // 2 modes of auth, the username cookie and the user looged into Firebase auth.
  // Need to check both, and make sure they correspond

  const id = req.cookies[COOKIE];
  const authUser = await getCurrentUser();

  if (!id && !authUser) {
    //console.log("!id && !authUser");
    return res.status(200).json({ loggedIn: false });
  } else if (!id && authUser) {
    //console.log("!id && authUser");
    // Sign out of Firebase auth and return false
    await signOutUser();
    return res.status(200).json({ loggedIn: false });
  } else if (id && !authUser) {
    //console.log("id && !authUser");
    // TODO: update so that it actually auto-logs you in and return true
    // Delete cookie and return false
    res.setHeader(
      'Set-Cookie',
      cookie.serialize(COOKIE, id, {
        httpOnly: true,
        maxAge: -1,
        path: '/api',
      })
    );
    return res.status(200).json({ loggedIn: false });
  } else if (id && authUser) {
    //console.log("id && authUser");
    // Check whether they actually correspond with eachother
    let idFromUser = authUser.uid;
    //console.log(`${idFromUser} and ${idFromUser}`);

    if (idFromUser != id) {
      //console.log("DO NOT CORRESPOND!");
      // If they don't correspond clear BOTH and return false
      res.setHeader(
        'Set-Cookie',
        cookie.serialize(COOKIE, id, {
          httpOnly: true,
          maxAge: -1,
          path: '/api',
        })
      );

      await signOutUser();

      return res.status(200).json({ loggedIn: false });
    }

    // id and authUser exist and correspond with eachother, return true
    // and the authUser's info
    return res.status(200).json({ loggedIn: true, user: authUser });
  } else {
    // Should never reach here
    return res.status(200).json({ loggedIn: false });
  }
}
