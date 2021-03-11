import useLoginStatus from '@lib/hooks/use-login-status';
import styles from './stage-container.module.css';
import Ticket from './ticket'
import ConfEntry from './conf-entry';

export default function TicketContainer() {
    const { loginStatus, user } = useLoginStatus();

    return (
        <>
            {loginStatus === 'loggedIn' && user.info ? (
                <Ticket
                    username={user.info.username}
                    name={user.info.name}
                    ticketNumber={user.info.ticketNumber}
                    sharePage={false}
                />
            ) : loginStatus === 'loggedIn' ? (
                <p>Couldn't load your ticket right now. Check back later!</p>
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
