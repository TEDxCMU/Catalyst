import { useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import LoadingDots from './loading-dots';
import styles from './sign-in-form.module.css';
import FormError from '@lib/form-error';
import { signIn, resetPassword } from '@lib/user-api';
import useEmailQueryParam from '@lib/hooks/use-email-query-param';

type FormState = 'default' | 'sign-in-loading' | 'reset-pass' | 'reset-pass-loading' | 'reset-pass-complete' |'error-sign-in' | 'error-reset-pass';

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
      setFormState('sign-in-loading');
      try {
        const response = await signIn(email, password);
        if (!response.ok) {
          throw new FormError(response);
        }

        const data = await response.json();
        if (!data?.signInSuccess) {
          setFormState('error-sign-in');
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
        setFormState('error-sign-in');
      }
    } else {
      setFormState('default');
    }
  }

  const handleResetPass = async (e: any) => {
    e.preventDefault();
    if (formState === 'reset-pass') {
      setFormState('reset-pass-loading');
      try {
        const response = await resetPassword(email);
        if (!response.ok) {
          throw new FormError(response);
        }

        const data = await response.json();
        if (!data?.sentEmail) {
          setFormState('error-sign-in');
        }

        setFormState('reset-pass-complete');
      } catch (error) {
        let message = 'Error! Please try again.';
        if (error instanceof FormError) {
          const { res } = error;
          const data = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : null;

          if (data?.error?.code === 'auth_err' || data?.error?.code === 'other_err') {
            message = data.error.message;
          }
        }

        setErrorMsg(message);
        setFormState('error-reset-pass');
      }
    } else {
      setFormState('reset-pass');
    }
  }

  if (formState === 'error-sign-in') {
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

  if (formState === 'error-reset-pass') {
    return (
      <div className={styles.form}>
        <div className={styles.row}>
          <h2 className={styles.title}>RESET PASSWORD</h2>
          <p>{errorMsg}</p>
          <button
            className={styles.submit}
            type="button"
            onClick={() => setFormState('reset-pass')}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (formState === 'reset-pass-complete') {
    return (
      <div className={styles.form}>
        <div className={styles.row}>
          <h2 className={styles.title}>RESET PASSWORD</h2>
          <p>A reset password link has just been sent to your email. Please create a new password and sign in again.</p>
          <button
            className={styles.submit}
            type="button"
            onClick={() => setFormState('default')}
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {formState === 'reset-pass' || formState === 'reset-pass-loading' ? (
        <>
          <form className={styles.form} onSubmit={handleResetPass}>
            <div className={styles.row}>
              <h2 className={styles.title}>RESET PASSWORD</h2>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email to send password reset link to"
                required
              />
              <button
                type="submit"
                className={cn(styles.submit, styles[formState])}
                disabled={formState === 'reset-pass-loading'}
              >
                {formState === 'reset-pass-loading' ? <LoadingDots size={4} /> : <>Send Link</>}
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
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
                disabled={formState === 'sign-in-loading'}
              >
                {formState === 'sign-in-loading' ? <LoadingDots size={4} /> : <>Sign In</>}
              </button>
            </div>
          </form>
          <a onClick={() => setFormState('reset-pass')}>
            Forgot Password?
          </a>
          <p>Having trouble logging in? Email us at tedxcmuinnovation@gmail.com.</p>
        </>
      )} 
    </>
  );
}