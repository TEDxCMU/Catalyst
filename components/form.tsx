/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState } from 'react';
import cn from 'classnames';
import useConfData from '@lib/hooks/use-conf-data';
import { useRouter } from 'next/router';
import FormError from '@lib/form-error';
import LoadingDots from './loading-dots';
import styles from './form.module.css';
import useEmailQueryParam from '@lib/hooks/use-email-query-param';
import { register } from '@lib/user-api';

type FormState = 'default' | 'loading' | 'error';

type Props = {
  sharePage?: boolean;
};

export default function Form({ sharePage }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [focused, setFocused] = useState(false);
  const [formState, setFormState] = useState<FormState>('default');
  const { setPageState, setUserData } = useConfData();
  const router = useRouter();
  useEmailQueryParam('email', setEmail);

  const handleSubmit = (e: any) => {
    if (formState === 'default') {
      setFormState('loading');
      register(email, password, firstName, lastName)
        .then(async res => {
          if (!res.ok) {
            throw new FormError(res);
          }

          const data = await res.json();
          const params = {
            id: data.id,
            email: data.email,
            username: data.username,
            ticketNumber: data.ticketNumber,
            name: data.name
          };

          if (sharePage) {
            const queryString = Object.keys(params)
              .map(
                key =>
                  `${encodeURIComponent(key)}=${encodeURIComponent(
                    params[key as keyof typeof params] || ''
                  )}`
              )
              .join('&');
            router.replace(`/?${queryString}`, '/');
          } else {
            setUserData(params);
            setPageState('ticket');
          }
        })
        .catch(async err => {
          let message = 'Error! Please try again.';
          if (err instanceof FormError) {
            const { res } = err;
            const data = res.headers.get('Content-Type')?.includes('application/json')
              ? await res.json()
              : null;

            if (data?.error?.code === 'bad_email') {
              message = 'Please enter a valid email';
            } else if (data?.error?.code === 'auth_err') {
              message = data.error.message
            } else if (data?.error?.code === 'ticket_err' || data?.error?.code === 'user_err') {
              message = 'Our services are down. Please try again later.';
            }
          }

          setErrorMsg(message);
          setFormState('error');
        });
    } else {
      setFormState('default');
    }
    e.preventDefault();
  }

  return formState === 'error' ? (
    <div className={cn(styles.form, { [styles['share-page']]: sharePage })} >
      <div className={styles['form-row']}>
        <div className={cn(styles['input-label'], styles.error)}>
          <div className={cn(styles.input, styles['input-text'])}>{errorMsg}</div>
          <button
            type="button"
            className={cn(styles.submit, styles.register, styles.error)}
            onClick={() => setFormState('default')}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  ) : (
    <form className={cn(styles.form, { [styles['share-page']]: sharePage })} onSubmit={handleSubmit}>
      <div className={styles['form-row']}>
        <h2>Registration</h2>
        <label htmlFor="fname-input-field" className={cn(styles['input-label'], { [styles.focused]: focused })}>
          <input
            className={styles.input}
            autoComplete="off"
            type="text"
            id="fname-input-field"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="First Name"
            aria-label="Your First Name"
            required
          />
        </label>
        <label htmlFor="lname-input-field" className={cn(styles['input-label'], { [styles.focused]: focused })}>
          <input
            className={styles.input}
            autoComplete="off"
            type="text"
            id="lname-input-field"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Last Name"
            aria-label="Your Last Name"
            required
          />
        </label>
        <label htmlFor="email-input-field" className={cn(styles['input-label'], { [styles.focused]: focused })}>
          <input
            className={styles.input}
            autoComplete="off"
            type="email"
            id="email-input-field"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Email"
            aria-label="Your email address"
            required
          />
        </label>
        <label htmlFor="pass-input-field" className={cn(styles['input-label'], { [styles.focused]: focused })}>
          <input
            className={styles.input}
            autoComplete="off"
            type="password"
            id="pass-input-field"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Password (must be at least 6 chars.)"
            aria-label="Your password"
            required
          />
        </label>
        <button
          type="submit"
          className={cn(styles.submit, styles.register, styles[formState])}
          disabled={formState === 'loading'}
        >
          {formState === 'loading' ? <LoadingDots size={4} /> : <>Register</>}
        </button>
      </div>
    </form>
  );
}
