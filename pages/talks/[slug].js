import Page from '@components/page';
import Layout from '@components/layout';
import Header from '@components/header';
import Schedule from "components/schedule";
import TalkSection from '@components/talk-section';

import { getSchedule } from 'lib/cms-api';
import { META_DESCRIPTION } from '@lib/constants';

export default function TalkPage({ talks, talk }) {
  const meta = {
    title: `${talk.title} - TEDxCMU Catalyst`,
    description: META_DESCRIPTION
  };

  return (
    <Page meta={meta}>
      <Layout>
        <Header hero='Schedule' />
        <Schedule events={talks} />
        <TalkSection talk={talk} />
      </Layout>
    </Page>
  );
}

export async function getStaticProps({ params }) {
  const slug = params?.slug;
  const talks = await getSchedule();
  const talk = talks.find((s) => s.slug === slug) || null;

  if (!talk) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      talks,
      talk,
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  const talks = await getSchedule();
  const slugs= talks.map((s) => ({ params: { slug: s.slug } }));

  return {
    paths: slugs,
    fallback: false
  };
}