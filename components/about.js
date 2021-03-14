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

 import { useEffect, useState } from 'react';
 import { useRouter } from 'next/router';
 import styles from './about.module.css';
 import Modal from './modal';
 import IconTwitter from './icons/icon-twitter';
 import IconLinkedin from './icons/icon-linkedin';

 export default function About({showAbout, setShowAbout}) {

    const router = useRouter();
    const [active, setActive] = [showAbout, setShowAbout];

    useEffect(() => {
      if (showAbout) {
        setActive(true);
      } else {
        setActive(false);
      }
    }, [active]);
 
   return (
     <>
      <Modal className={styles.modalContainer} active={active} setActive={setActive} large>
        <div className={styles.container}>
          <div className={styles.overlay}>
            <img className={styles.logo} src="/logo.svg" alt="TEDxCMU Logo" />
          </div>
          <div className={styles.content}>
              <h2 className={styles.title}>TEDxCMU 2021: CATALYST</h2>
              <p>The power of a bold idea uttered publicly in defiance of dominant opinion cannot be easily measured. Those special people who speak out in such a way as to shake up not only the self-assurance of their enemies, but the complacency of their friends, are precious catalysts for change. <br /><br />We provide the answers now to problems of the future. TEDx Catalyst hopes to inspire you, for tomorrow belongs to the people who prepare for it today.</p>
              <div className={styles.buttonsContainer}>
                <a className={styles.button} href="https://tedxcmu.org" rel="noopener noreferrer" target="_blank">
                  TEDxCMU.ORG
                </a>
                <div className={styles.socials}>
                  <a href="https://twitter.com/tedxcmu" rel="noopener noreferrer" target="_blank">
                    <IconTwitter width="30" />
                  </a>
                  <a href="https://www.linkedin.com/company/tedxcmu/about/" rel="noopener noreferrer" target="_blank">
                    <IconLinkedin width="30" />
                  </a>
                </div>
              </div>
          </div>
        </div>
      </Modal>
    </>
   );
 }
 