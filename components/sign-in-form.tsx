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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [formState, setFormState] = useState<FormState>('default');

  const router = useRouter();
  useEmailQueryParam('email', setEmail);

  const handleSubmit = (e: any) => {
    if (formState === 'default') {
      setFormState('loading');
      signIn(email, password)
        .then(async res => {
          if (!res.ok) {
            throw new FormError(res);
          }

          const data = await res.json();

          if (!data?.signInSuccess){
            setFormState('error');
          }

          router.push("/ticket");
        })
        .catch(async err => {
          let message = 'Error! Please try again.';
          console.log("Error from sign in:");
           
          if (err instanceof FormError) {
            const { res } = err;
            
            const data = res.headers.get('Content-Type')?.includes('application/json')
              ? await res.json()
              : null;

            if (data?.error?.code === 'bad_email') {
              message = 'Please enter a valid email';
            } else if (data?.error?.code === 'auth_err' || data?.error.code === 'no_data_err') {
              message = data.error.message;
            }
          }

          setErrorMsg(message);
          setFormState('error');
        });
    } else {
      setFormState('default');
      console.log("form - set form state to default");
    }
    e.preventDefault();
  }

  return formState === 'error' ? (
    <div className={cn(styles.form)}>
      <div className={styles['form-row']}>
        <h2>SIGN IN</h2>
        <div className={cn(styles['input-label'], styles.error)}>
          <div className={cn(styles.input, styles['input-text'])}>{errorMsg}</div>
          <button
            type="button"
            className={cn(styles.submit, styles.error)}
            onClick={() => { setFormState('default')}}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  ) : (
    <form className={cn(styles.form)} onSubmit={handleSubmit}>
      <div className={styles['form-row']}>
        <h2>SIGN IN</h2>
      <label
          htmlFor="email-input-field"
          className={cn(styles['input-label'])}
        >
          <input
            className={styles.input}
            autoComplete="off"
            type="email"
            id="email-input-field"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            aria-label="Your email address"
            required
          />
        </label>
        <label
          htmlFor="pass-input-field"
          className={cn(styles['input-label'])}
        >
          <input
            className={styles.input}
            autoComplete="off"
            type="password"
            id="pass-input-field"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Your password"
            required
          />
        </label>
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
