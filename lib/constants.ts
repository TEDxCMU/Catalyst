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

export const SITE_URL = 'https://catalyst.tedxcmu.edu';
// export const SITE_URL = 'http://localhost:3000';
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || new URL(SITE_URL).origin;
export const TWITTER_USER_NAME = 'TEDxCMU';
export const BRAND_NAME = 'TEDxCMU';
export const CONF_TITLE = 'Catalyst';
export const SITE_NAME_MULTILINE = ['TEDxCMU', 'Catalyst'];
export const SITE_NAME = 'TEDxCMU Virtual Conference';
export const META_DESCRIPTION =
  'TEDxCMU\'s first ever virtual conference. Introducing, CATALYST.';
export const SCHEDULE_DESCRIPTION =
  'This is the tagline for the schedule page.';
export const SPEAKERS_DESCRIPTION =
  'This is the tagline for the speakers page.';
export const EXPO_DESCRIPTION =
  'This is the tagline for the expo page.';
export const SITE_DESCRIPTION =
  'An interactive online experience by the community, free for everyone.';
export const DATE = 'April 3, 2021';
export const SHORT_DATE = 'Apr 3rd - 9:00am PST';
export const FULL_DATE = 'Apr 3rd 9am Pacific Time (GMT-7)';
export const TWEET_TEXT = META_DESCRIPTION;
export const COOKIE = 'user-id';

export const SAMPLE_TICKET_NUMBER = 1234;
export const NAVIGATION = [
  {
    name: 'Home',
    route: '/'
  },
  {
    name: 'Stage',
    route: '/stage'
  },
  {
    name: 'Schedule',
    route: '/schedule'
  },
  {
    name: 'Speakers',
    route: '/speakers'
  },
  {
    name: 'Innovation Expo',
    route: '/expo'
  },
];

export type TicketGenerationState = 'default' | 'loading';
