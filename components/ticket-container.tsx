import cn from 'classnames';
import { Stage } from '@lib/types';
import useLoginStatus from '@lib/hooks/use-login-status';
import styles from './stage-container.module.css';
import Ticket from './ticket'
import styleUtils from './utils.module.css';
import { UserData } from '@lib/hooks/use-conf-data';
import ConfEntry from './conf-entry';
import ConfContainer from './conf-container'

type Props = {
    username: UserData['username'];
    ticketNumber: UserData['ticketNumber'];
    name: UserData['name'];
};

export default function TicketContainer() {
    const { loginStatus, user } = useLoginStatus();

    return (
        <>
            {loginStatus === 'loggedIn' && user.info ? (
                <ConfContainer>
                    <Ticket
                    username={user.info.username}
                    name={user.info.name}
                    ticketNumber={user.info.ticketNumber}
                    sharePage={false} />
                </ConfContainer>
            ) : loginStatus === 'loggedIn' ? (
                <p>Couldn't load your ticket right now. Check back later!</p>
            )
               : loginStatus === 'loading' ? null : (
                <div className={styles.container}>
                    <div className={styles.streamContainer}>
                        <ConfEntry/>
                    </div>
                </div>
                
            )}
        </>
    );
}