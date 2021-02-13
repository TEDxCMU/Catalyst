import { GetStaticProps } from 'next';
import Page from '@components/page';
import Layout from '@components/layout';
import TicketContainer from '@components/ticket-container';
import { META_DESCRIPTION } from '@lib/constants';
import { getCurrentUser, getUser } from '@lib/firestore-api';

type Props = {
  name: string;
  username: string;
  ticketNumber: number;
};

export default function TicketPage({ name, username, ticketNumber }: Props) {
  const meta = {
    title: 'Your Ticket - TEDxCMU Catalyst',
    description: META_DESCRIPTION,
  };

  return (
    <Page meta={meta} fullViewport>
      <Layout>
        <TicketContainer
          name={name}
          username={username}
          ticketNumber={ticketNumber}
        />
      </Layout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  let user;
  let ticketProps = {
    name: 'XXXXXX XXXXXXXXX',
    username: 'XXXXXXXX',
    ticketNumber: 0,
  };

  user = await getCurrentUser();
  let userInfo = user ? await getUser(user.uid) : null;
  ticketProps = userInfo
    ? {
        name: userInfo.name,
        username: userInfo.username,
        ticketNumber: userInfo.ticketNumber,
      }
    : ticketProps;

  return {
    props: ticketProps,
    revalidate: 5,
  };
};
