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

// export const SITE_URL = 'http://localhost:3000';
export const SITE_URL = 'https://catalyst.tedxcmu.edu';
export const SITE_ORIGIN = new URL(SITE_URL).origin;
export const TWITTER_USER_NAME = 'TEDxCMU';
export const BRAND_NAME = 'TEDxCMU';
export const CONF_TITLE = 'Catalyst';
export const SITE_NAME_MULTILINE = ['TEDxCMU', 'Catalyst'];
export const SITE_NAME = 'TEDxCMU Virtual Conference';
export const META_DESCRIPTION = 'TEDxCMU\'s first ever virtual conference. Introducing, CATALYST.';
export const SCHEDULE_DESCRIPTION = 'View the schedule for the conference';
export const SPEAKERS_DESCRIPTION = 'Check out our lineup of speakers this year.';
export const EXPO_DESCRIPTION = 'See the lineup of innovators at the conference.';
export const SITE_DESCRIPTION = 'A free, virtual conference .';
export const DATE = 'April 10, 2021';
export const TIME = '2:00pm EST';
export const SHORT_DATE = 'Apr 10th - ' + TIME;

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
  }
];

export type TicketGenerationState = 'default' | 'loading';
