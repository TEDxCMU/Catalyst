import Page from '@components/page';
import Layout from '@components/layout';
import TicketContainer from '@components/ticket-container';
import { META_DESCRIPTION } from '@lib/constants';

export default function TicketPage() {
  const meta = {
    title: 'Your Ticket - TEDxCMU Catalyst',
    description: META_DESCRIPTION
  };

  // TicketContainer takes undefined information since that data will be fetched in the component itself
  return (
    <Page meta={meta} fullViewport>
      <Layout>
        <TicketContainer />
      </Layout>
    </Page>
  );
}
