import { useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import LoadingDots from './loading-dots';
import styles from './sign-in-form.module.css';
import FormError from '@lib/form-error';
import { signIn } from '@lib/user-api';
import useEmailQueryParam from '@lib/hooks/use-email-query-param';

type FormState = 'default' | 'loading' | 'error';

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [formState, setFormState] = useState<FormState>('default');
  useEmailQueryParam('email', setEmail);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formState === 'default') {
      setFormState('loading');
      try {
        const response = await signIn(email, password);
        if (!response.ok) {
          throw new FormError(response);
        }

        const data = await response.json();
        if (!data?.signInSuccess) {
          setFormState('error');
        }
        router.push('/ticket');
      } catch (error) {
        let message = 'Error! Please try again.';
        if (error instanceof FormError) {
          const { res } = error;
          const data = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : null;

          if (data?.error?.code === 'bad_email') {
            message = 'Please enter a valid email';
          } else if (data?.error?.code === 'auth_err' || data?.error.code === 'no_data_err') {
            message = data.error.message;
          }
        }

        setErrorMsg(message);
        setFormState('error');
      }
    } else {
      setFormState('default');
    }
  }

  if (formState === 'error') {
    return (
      <div className={styles.form}>
        <div className={styles.row}>
          <h2 className={styles.title}>SIGN IN</h2>
          <p>{errorMsg}</p>
          <button
            className={styles.submit}
            type="button"
            onClick={() => setFormState('default')}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <h2 className={styles.title}>SIGN IN</h2>
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button
          type="submit"
          className={cn(styles.submit, styles[formState])}
          disabled={formState === 'loading'}
        >
          {formState === 'loading' ? <LoadingDots size={4} /> : <>Sign In</>}
        </button>
      </div>
    </form>
  );
}
