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
import Tilt from 'vanilla-tilt';
import { useRef, useEffect, useState } from 'react';
import { UserData } from '@lib/hooks/use-conf-data';
import { TicketGenerationState } from '@lib/constants';
import isMobileOrTablet from '@lib/is-mobile-or-tablet';
import { scrollTo } from '@lib/smooth-scroll';
import styles from './ticket.module.css';
import styleUtils from './utils.module.css';
import TicketVisual from './ticket-visual';
import IconDownload from './icons/icon-download';
import LoadingDots from './loading-dots';
import { DATE, SITE_NAME } from '@lib/constants';
import Form from './register-form';

type Props = {
  username: UserData['username'];
  ticketNumber: UserData['ticketNumber'];
  name: UserData['name'];
  sharePage?: boolean;
};

export default function Ticket({ username, name, ticketNumber, sharePage }: Props) {
  const [imgReady, setImgReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const downloadLink = useRef<HTMLAnchorElement>();

  const downloadUrl = name && ticketNumber ? `/api/ticket-images/${username}/${encodeURIComponent(name)}/${encodeURIComponent(ticketNumber)}` : `/api/ticket-images/${username}/${encodeURIComponent("XXXXXX")}/${encodeURIComponent(0)}`;

  const ticketRef = useRef<HTMLDivElement>(null);
  const [ticketGenerationState, setTicketGenerationState] = useState<TicketGenerationState>(
    'default'
  );
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ticketRef.current && !window.matchMedia('(pointer: coarse)').matches) {
      Tilt.init(ticketRef.current, {
        glare: true,
        max: 5,
        'max-glare': 0.16,
        'full-page-listening': true
      });
    }
  }, [ticketRef]);

  useEffect(() => {
    if (!sharePage && divRef && divRef.current && isMobileOrTablet()) {
      scrollTo(divRef.current, -30);
    }
  }, [divRef, sharePage]);

  useEffect(() => {
    setImgReady(false);

    const img = new Image();
    img.src = downloadUrl;
    img.onload = () => {
      // console.log("downloadUrl", img.src);
      setImgReady(true);
      setLoading(false);
      if (downloadLink.current) {
        // console.log("hi!");
        downloadLink.current.click();
        downloadLink.current = undefined;
      }
    };
  }, [downloadUrl]);

  return (
    <div
      className={cn(styles['ticket-layout'], {
        [styles['ticket-share-layout']]: sharePage
      })}
    >
      <div ref={divRef}>
        <div className={styles['ticket-text']}>
          <h2 className={cn(styles.hero, styleUtils.appear, styleUtils['appear-first'])}>
            {sharePage ? (name ? (
              <>{name}’s Ticket</>
            ) : (
              <>{SITE_NAME}</>
            )
            ) : (
              <>
                WELCOME TO THE TEDxCMU FAMILY
              </>
            )}
          </h2>
          <p className={cn(styles.description, styleUtils.appear, styleUtils['appear-second'])}>
            {sharePage ? (
              <>
                Join {name && 'them '} on {DATE}.
              </>
            ) : (
              <>
                On the day of the event, sign in with your email and password. We look forward to seeing you there!
                </>
            )}
          </p>
          {!sharePage && (
            <div className={cn(styles.buttonsContainer, styleUtils.appear, styleUtils['appear-third'])}>
              <a className={styles.button} href={loading ? undefined : downloadUrl}
                onClick={e => {
                  if (imgReady) return;

                  e.preventDefault();
                  // console.log("current target", e.currentTarget);
                  downloadLink.current = e.currentTarget;
                  // Wait for the image download to finish
                  // console.log("loading");
                  setLoading(true);
                }}
                download="ticket.png">
                {loading ? (
                  <LoadingDots size={4} />
                ) : (
                  <> SHARE EVENT </>
                )}
              </a>
              <a className={styles.button} href="/" rel="noopener noreferrer">
                RETURN HOME
              </a>
            </div>
          )}
        </div>
        <div className={cn(styleUtils.appear, styleUtils['appear-third'])}>
          {sharePage &&
            <Form sharePage />
          }
        </div>
      </div>
      <div className={styles['ticket-visual-wrapper']}>
        <div
          ref={ticketRef}
          className={cn(styles['ticket-visual'], styleUtils.appear, styleUtils['appear-fourth'])}
        >
          <TicketVisual
            name={name}
            ticketNumber={ticketNumber}
            ticketGenerationState={ticketGenerationState}
          />
        </div>
      </div>
    </div>
  );
}
