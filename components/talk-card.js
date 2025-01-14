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

import cn from "classnames";
import Link from "next/link";
import { useState, useEffect } from "react";
import { parseISO, format, isBefore, isAfter } from "date-fns";

import styles from "./talk-card.module.css";

const formatDate = (date) => {
  // https://github.com/date-fns/date-fns/issues/946
  return format(parseISO(date), "h:mmaaaaa'm'");
};

export default function TalkCard({ talk }) {
  const [isTalkLive, setIsTalkLive] = useState(false);
  const [startAndEndTime, setStartAndEndTime] = useState("");

  useEffect(() => {
    const now = Date.now();
    setIsTalkLive(
      isAfter(now, parseISO(talk.startTime)) &&
        isBefore(now, parseISO(talk.endTime))
    );
    setStartAndEndTime(
      `${formatDate(talk.startTime)} – ${formatDate(talk.endTime)}`
    );
  }, []);

  return (
    <div key={talk.title} className={styles.talk}>
      {<p className={styles.time}>{startAndEndTime || <>&nbsp;</>}</p>}
      <Link
        className={styles["card-container"]}
        href={
          talk.speaker
            ? `/talks/${talk.slug}`
            : talk.slug === "innovation-expo"
            ? `/expo`
            : "/schedule"
        }
      >
        <a className={cn(styles.card, { [styles["is-live"]]: isTalkLive })}>
          {talk.image != null && (
            <div key={talk.slug} className={styles["avatar-wrapper"]}>
              <img
                className={styles.avatar}
                src={talk.image.url}
                alt={talk.title}
                loading="lazy"
              />
            </div>
          )}
          <div className={styles["card-body"]}>
            <h4 title={talk.title} className={styles.title}>
              {talk.title}
            </h4>
            {talk.speaker != null && (
              <>
                <div className={styles.speaker}>
                  <h5 className={styles.name}>
                    {/* {talk.speaker.length === 1 ? talk.speaker[0].name : `${talk.speaker.length} speakers`} */}
                    {talk.speaker.name}
                  </h5>
                </div>
                <p className={styles.tagline}>{talk.speaker.tagline}</p>
              </>
            )}
            {talk.blurb ? talk.blurb.split(' ').length > 15 ? (<p className="styles.blurb">{talk.blurb.split(' ').slice(0, 15).join(" ")}...</p>) : (<p className="styles.blurb">{talk.blurb}</p>) : <></>}
          </div>
        </a>
      </Link>
    </div>
  );
}
