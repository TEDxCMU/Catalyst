import { GetStaticProps } from 'next';
import Page from '@components/page';
import Layout from '@components/layout';
import TicketContainer from '@components/ticket-container';
import { META_DESCRIPTION } from '@lib/constants';
import { getCurrentUser, getUser } from '@lib/firestore-api'


type Props = {
  name: string;
  username: string;
  ticketNumber: number;
};

export default function TicketPage({name, username, ticketNumber}:Props) {
  const meta = {
    title: 'Your Ticket - TEDxCMU Catalyst',
    description: META_DESCRIPTION
  };

  // TicketContainer takes undefined information since that data will be fetched in the component itself
  return (
    <Page meta={meta} fullViewport>
      <Layout>
        <TicketContainer/>
      </Layout>
    </Page>
  );
}

