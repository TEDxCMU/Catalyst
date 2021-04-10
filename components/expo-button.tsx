import Link from 'next/link';
import cn from 'classnames';
import styles from './expo-button.module.css';

type Props = {
    expoLink: React.ReactNode;
  };

export default function ExpoButton({ expoLink }: Props) {
    return (
        <div className={styles.buttonContainer}>
            {expoLink != "/" ? 
            (
                <a href={`${expoLink}`} target="_blank">
                   <button className={styles.button}>
                        Join Live Zoom Call
                    </button> 
                </a>
            ) : (
                <Link href={`${expoLink}`}>
                    <button className={styles.reg_button}>
                        Sign In to Join Zoom
                    </button>
                </Link>
            )
            }
        </div>
    );
}