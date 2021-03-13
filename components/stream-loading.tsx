import cn from 'classnames';
import styleUtils from './utils.module.css';
import styles from './conf-entry.module.css';
import SignInButton from './sign-in-button';

export default function StreamLoading() {
  return (
    <div className={cn(styles.container, styleUtils.appear, styleUtils['appear-first'])}>
      <div className={styles.heroContainer}>
        <h1 className={cn(styles.hero)}>Stay Tuned.</h1>
        <h2 className={cn(styles.description)}>The stream is currently loading, check back in at a later time to view the livestream!</h2>
      </div>
    </div>
  );
}