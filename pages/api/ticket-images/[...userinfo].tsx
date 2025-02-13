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
import screenshot from '@lib/screenshot';
import { SITE_URL, SAMPLE_TICKET_NUMBER } from '@lib/constants';
import { getUser, checkUser, getCurrentUser } from '@lib/firestore-api';

export default async function ticketImages(req: NextApiRequest, res: NextApiResponse) {

  // const authUser = await getCurrentUser();
  const user = req.query || {};

  const site_url = req.headers.host;

  const userinfo = user.userinfo;
  // const user = await getCurrentUser();
  // let userInfo = user ? await getUser(user.uid) : null;
  let data = userinfo ? {
    name: userinfo[1],
    username: userinfo[0],
    ticketNumber: userinfo[2],
  } : {
    name: 'XXXXXX XXXXXXXXX',
    username: 'XXXXXXXX',
    ticketNumber: 0
  };

  // console.log("name", data.username);

  let url: string;

  const usernameString = data.username.toString();
  url = `https://${site_url}/ticket-image?username=${encodeURIComponent(
    usernameString
  )}&ticketNumber=${encodeURIComponent(data.ticketNumber)}&name=${encodeURIComponent(data.name)}`;

  // TODO: Code fails here at screenshot, still need to fix
  const file = await screenshot(url);
  // console.log(file);
  res.setHeader('Content-Type', `image/png`);
  res.setHeader(
    'Cache-Control',
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  );
  res.statusCode = 200;
  res.end(file);

  // } else {
  //   res.status(404).send('Not Found');
  // }
}
