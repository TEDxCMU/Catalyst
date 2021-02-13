import Link from 'next/link';
import cn from 'classnames';
import styles from './sign-in-button.module.css';

export default function SignInButton() {
  return (
    <Link href="/sign-in">
      <button className={cn(styles.signin)}>Sign In</button>
    </Link>
  );
}
