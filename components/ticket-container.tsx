import cn from 'classnames';
import { Stage } from '@lib/types';
import useLoginStatus from '@lib/hooks/use-login-status';
import styles from './stage-container.module.css';
import Ticket from './ticket';
import styleUtils from './utils.module.css';
import { UserData } from '@lib/hooks/use-conf-data';
import ConfEntry from './conf-entry';
import ConfContainer from './conf-container';

type Props = {
  username: UserData['username'];
  ticketNumber: UserData['ticketNumber'];
  name: UserData['name'];
};

export default async function TicketContainer({
  name,
  username,
  ticketNumber,
}: Props) {
  const { loginStatus } = await useLoginStatus();

  return (
    <>
      {loginStatus === 'loggedIn' ? (
        <ConfContainer>
          <Ticket
            username={username}
            name={name}
            ticketNumber={ticketNumber}
            sharePage={false}
          />
        </ConfContainer>
      ) : loginStatus === 'loading' ? null : (
        <div className={styles.container}>
          <div className={styles.streamContainer}>
            <ConfEntry />
          </div>
        </div>
      )}
    </>
  );
}
