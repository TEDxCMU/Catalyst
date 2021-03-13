import cn from 'classnames';
import styleUtils from './utils.module.css';
import styles from './conf-entry.module.css';
import SignInButton from './sign-in-button';
import {DATE, TIME} from '@lib/constants';

export default function BeforeConfEntry() {
  return (
    <div className={cn(styles.container, styleUtils.appear, styleUtils['appear-first'])}>
      <div className={styles.heroContainer}>
        <h1 className={cn(styles.hero)}>Join the conference.</h1>
        <h2 className={cn(styles.description)}>Log back in on {DATE} at {TIME} to view the livestream. We look forward to seeing you here!</h2>
        <SignInButton />
      </div>
    </div>
  );
}