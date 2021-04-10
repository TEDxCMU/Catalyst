import cn from 'classnames';
import styleUtils from './utils.module.css';
import styles from './conf-entry.module.css';
import {DATE, TIME} from '@lib/constants';

export default function StreamLoading() {
  return (
    <div className={cn(styles.container, styleUtils.appear, styleUtils['appear-first'])}>
      <div className={styles.heroContainer}>
        <h1 className={cn(styles.hero)}>Stay Tuned.</h1>
        <h2 className={cn(styles.description)}>Check back in on {DATE} at {TIME} to view the livestream. See you soon!</h2>
      </div>
    </div>
  );
}