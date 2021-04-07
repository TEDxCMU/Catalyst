import Link from 'next/link';
import cn from 'classnames';
import styles from './expo-button.module.css';

type Props = {
    expoLink: React.ReactNode;
  };

export default function ExpoButton({ expoLink }: Props) {
    return (
        <div className={styles.buttonContainer}>
            <Link href={`${expoLink}`}>
                {expoLink != "/" ? 
                    <button className={styles.button}>
                        Join Live Zoom Call
                    </button>
                : 
                    <button className={styles.reg_button}>
                        Sign In to Join Zoom
                    </button>
                }
                
            </Link>
        </div>
    );
}