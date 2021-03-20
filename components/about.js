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

import { useEffect } from "react";
import styles from "./about.module.css";
import Modal from "./modal";
import IconTwitter from "./icons/icon-twitter";
import IconLinkedin from "./icons/icon-linkedin";

export default function About({ showAbout, setShowAbout }) {
  const [active, setActive] = [showAbout, setShowAbout];

  useEffect(() => {
    if (showAbout) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [active]);

  return (
    <Modal active={active} setActive={setActive} large>
      <div className={styles.container}>
        <div className={styles.overlay}>
          <img className={styles.logo} src='/logo.svg' alt='TEDxCMU Logo' />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>TEDxCMU: CATALYST</h2>
          <p>
            It takes a catalyst to create meaningful change. Those who are catalysts shake up the status quo. They add
            new ideas, new dreams, and new perspectives that can shift the societal dogma. They change perspectives, and
            can elevate the minds of those who are receptive. A catalyst transforms an existing narrative by proposing
            new ideas, and telling stories that matter deeply to them.
            <br />
            <br />
            It is imperative that we listen to each other to solve the problems of today and tomorrow. TEDx Catalyst
            hopes to inspire you to make change when you can, and make the world what you want it to look like.
          </p>
          <div className={styles.buttonsContainer}>
            <a className={styles.button} href='https://tedxcmu.org' rel='noopener noreferrer' target='_blank'>
              TEDxCMU.ORG
            </a>
            <div className={styles.socials}>
              <a href='https://twitter.com/tedxcmu' rel='noopener noreferrer' target='_blank'>
                <IconTwitter width='30' />
              </a>
              <a href='https://www.linkedin.com/company/tedxcmu/about/' rel='noopener noreferrer' target='_blank'>
                <IconLinkedin width='30' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
