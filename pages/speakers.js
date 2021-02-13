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

import Page from '@components/page';
import Layout from '@components/layout';
import Header from '@components/header';
import SpeakersGrid from 'components/speakers-grid';

import { getSpeakers } from 'lib/cms-api';
import { SPEAKERS_DESCRIPTION } from '@lib/constants';

export default function Speakers({ speakers }) {
  const meta = {
    title: 'Speakers - TEDxCMU Catalyst',
    description: SPEAKERS_DESCRIPTION,
  };

  return (
    <Page meta={meta}>
      <Layout>
        <Header hero="Speakers" description={meta.description} />
        <SpeakersGrid speakers={speakers} />
      </Layout>
    </Page>
  );
}

export async function getStaticProps() {
  const speakers = await getSpeakers();

  return {
    props: {
      speakers,
    },
    revalidate: 1,
  };
}
