import Link from 'next/link';
import cn from 'classnames';
import styles from './sign-in-button.module.css';

export default function SignInButton() {
    return (
        <div className={styles.buttonContainer}>
            <Link href="/sign-in">
                <button
                    className={cn(styles.signin, styles.button)}
                >
                    Sign In
                </button>
            </Link>
            <Link href="/">
                <button
                    className={cn(styles.register, styles.button)}
                >
                    Register for Free
                </button>
            </Link>
        </div>
    );
}