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
import styles from './register-form.module.css';
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formState === 'default') {
      setFormState('loading');
      try {
        const response = await register(email, password, firstName, lastName);
        if (!response.ok) {
          throw new FormError(response);
        }

        const data = await response.json();
        const params = {
          id: data.id,
          email: data.email,
          username: data.username,
          ticketNumber: data.ticketNumber,
          name: data.name
        };

        if (sharePage) {
          const queryString = Object.keys(params).map((key) => {
            return `${encodeURIComponent(key)}=${encodeURIComponent(params[key as keyof typeof params] || '')}`
          }).join('&');
          router.replace(`/?${queryString}`, '/');
        } else {
          setUserData(params);
          setPageState('ticket');
        }
      } catch (error) {
        let message = 'Error! Please try again.';
        if (error instanceof FormError) {
          const { res } = error;
          const data = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : null;

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
      }
    } else {
      setFormState('default');
    }
  }

  if (formState === 'error') {
    return (
      <div className={styles.form}>
        <div className={styles.row}>
          <h2 className={styles.title}>Registration</h2>
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
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <h2 className={styles.title}>Registration</h2>
          <input
            className={styles.input}
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
          <input
            className={styles.input}
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
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
            placeholder="Password (must be at least 6 chars.)"
            required
          />
          <button
            type="submit"
            className={cn(styles.submit, styles[formState])}
            disabled={formState === 'loading'}
          >
            {formState === 'loading' ? <LoadingDots size={4} /> : <>Register</>}
          </button>
        </div>
      </form>
      <p className={styles.blurb}>Having trouble registering? Email us at tedxcmuinnovation@gmail.com.</p>
    </>
  )
}
