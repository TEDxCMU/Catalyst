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
import SpeakersGrid from '@components/speakers-grid';
import SpeakerSection from '@components/speaker-section';

import { getSpeakers } from 'lib/cms-api';
import { META_DESCRIPTION } from '@lib/constants';

export default function SpeakerPage({ speakers, speaker }) {
  const meta = {
    title: `${speaker.name} - TEDxCMU Catalyst`,
    description: META_DESCRIPTION
  };

  return (
    <Page meta={meta}>
      <Layout>
        <Header hero="Speakers" description={meta.description} />
        <SpeakersGrid speakers={speakers} />
        <SpeakerSection speaker={speaker} />
      </Layout>
    </Page>
  );
}

export async function getStaticProps({ params }) {
  const slug = params?.slug;
  const speakers = await getSpeakers();
  const speaker = speakers.find((s) => s.slug === slug) || null;

  if (!speaker) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      speakers,
      speaker,
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  const speakers = await getSpeakers();
  const slugs = speakers.map((s) => ({ params: { slug: s.slug } }));

  return {
    paths: slugs,
    fallback: false
  };
}
