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
import Header from '@components/header';
import Layout from '@components/layout';
import InnovatorsGrid from 'components/innovators-grid';
import { EXPO_DESCRIPTION } from '@lib/constants';
import { getStage, getInnovators } from 'lib/cms-api';

export default function ExpoPage({ stage, innovators }) {
  const meta = {
    title: 'Expo - TEDxCMU Catalyst',
    description: EXPO_DESCRIPTION
  };

  const expo_link = stage.expo_link;

  return (
    <Page meta={meta}>
      <Layout>
        <Header hero="Innovation Expo" description={meta.description} expo_link={expo_link}/>
        <InnovatorsGrid innovators={innovators} />
      </Layout>
    </Page>
  );
}

export async function getStaticProps() {
  const stages = await getStage();
  const innovators = await getInnovators();
  const stage = stages[0];

  return {
    props: {
      stage,
      innovators
    },
    revalidate: 1
  };
}
