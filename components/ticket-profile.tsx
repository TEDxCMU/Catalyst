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

import { useRef } from 'react';
import cn from 'classnames';
import { TicketGenerationState } from '@lib/constants';
import styles from './ticket-profile.module.css';

type Props = {
  name?: string;
  ticketNumber?: number;
  size?: number;
  ticketGenerationState: TicketGenerationState;
};

export default function TicketProfile({ name, ticketNumber, ticketGenerationState }: Props) {
  const imageIndex = useRef(Math.floor(Math.random() * 6) + 1);

  return (
    <div className={styles.profile}>
      <img className={styles.image} src={`/tickets/ticket-${imageIndex.current}.jpg`} width="2976" height="1674" />
      <img className={styles.logo} src="/logo.svg" alt="TEDxCMU Logo" width="2976" height="1674" />
      <div className={styles.content}>
        <div>
          <h3 className={styles.heading}>CATALYST CONFERENCE</h3>
          <p className={styles.subheading}>ONLINE EXPERIENCE</p>
        </div>
        <p className={styles.name}>
          {name || 'Your Name'}
        </p>
        <div className={styles.details}>
          <div className={styles.item}>
            <p className={styles.title}>Date:</p>
            <p className={styles.body}>April 4, 2021</p>
          </div>
          <div className={styles.item}>
            <p className={styles.title}>Time:</p>
            <p className={styles.body}>10:00AM EST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
