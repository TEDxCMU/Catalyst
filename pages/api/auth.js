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

import { COOKIE } from '@lib/constants';
import { getCurrentUser } from '@lib/firebase-server';
import cookie from 'cookie';

export default async function auth(req, res) {
  if (req.method !== 'POST') {
    return res.status(501).json({
      error: {
        code: 'method_unknown',
        message: 'This endpoint only responds to POST',
      },
    });
  }

  // 2 modes of auth, the username cookie and the user logged into Firebase auth.
  // Need to check both, and make sure they correspond
  const uid = req.cookies[COOKIE];
  const idToken = req.body.idToken;
  if (!uid || !idToken) return res.status(200).json({ loggedIn: false });

  const user = await getCurrentUser(uid, idToken);
  if (!user) return res.status(200).json({ loggedIn: false });

  res.setHeader(
    'Set-Cookie',
    cookie.serialize(COOKIE, uid, {
      httpOnly: true,
      maxAge: -1,
      path: '/api',
    })
  );
  return res.status(200).json({ loggedIn: true, user });
}
