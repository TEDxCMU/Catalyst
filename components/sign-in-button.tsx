import Link from 'next/link';
import cn from 'classnames';
import styles from './sign-in-button.module.css';

export default function SignInButton() {
    return (
        <div className={styles.buttonContainer}>
            <Link href="/">
                <button className={cn(styles.signin, styles.button)}>
                    Go Home
                </button>
            </Link>
        </div>
    );
}
