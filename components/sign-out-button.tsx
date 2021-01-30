import { useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import LoadingDots from './loading-dots';
import styleUtils from './utils.module.css';
import styles from './sign-out-button.module.css';
import { signOut } from '@lib/user-api';


type SignOutState = 'default' | 'loading' | 'error';

export default function SignOutButton() {
    const router = useRouter();
    const [signOutState, setSignOutState] = useState<SignOutState>('default');
    const [errorTryAgain, setErrorTryAgain] = useState(false);

    return signOutState === 'error' ? (
        <button
            type="button"
            className={cn(styles.submit, styles.error)}
            onClick={() => {
                setSignOutState('default');
                setErrorTryAgain(true);
            }}
        >
            Try Again
        </button>
    ) : (
        <form
            className={cn(styles.form)}
            onSubmit={e => {
                if (signOutState === 'default') {
                    setSignOutState('loading');
                    signOut()
                        .then(async res => {
                            if (!res.ok) {
                                setSignOutState('error');
                            }

                            const data = await res.json();
                            console.log("In button");
                            console.log(data)
                            if (!data?.signOutSuccess){
                                setSignOutState('error');
                            }
                            
                            router.push("/expo");
                        });
                } else {
                    setSignOutState('default');
                    console.log("form - set form state to default");
                }
                e.preventDefault();
            }}
        >
            <button
                type="submit"
                className={cn(styles.submit, styles[signOutState])}
                disabled={signOutState === 'loading'}
            >
                {signOutState === 'loading' ? <LoadingDots size={4} /> : <>Sign Out</>}
            </button>
        </form>
    )
}