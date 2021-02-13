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

import cn from 'classnames';
import styleUtils from './utils.module.css';
import styles from './conf-entry.module.css';
import { SITE_DESCRIPTION } from '@lib/constants';
import SignInButton from './sign-in-button';

export default function ConfEntry() {
  return (
    <div
      className={cn(
        styles.container,
        styleUtils.appear,
        styleUtils['appear-first']
      )}
    >
      <h1 className={cn(styles.hero)}>Join the conference.</h1>
      <h2 className={cn(styles.description)}>{SITE_DESCRIPTION}</h2>
      <SignInButton />
    </div>
  );
}
