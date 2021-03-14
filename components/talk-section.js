import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./talk-section.module.css";
import Modal from "./modal";
import { parseISO, format } from "date-fns";

const formatDate = (date) => {
  // https://github.com/date-fns/date-fns/issues/946
  return format(parseISO(date), "h:mmaaaaa'm'");
};

export default function TalkSection({ talk }) {
  const router = useRouter();
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) {
      router.push("/schedule");
    }
  }, [active]);

  return (
    <Modal active={active} setActive={setActive} large>
      <div className={styles.overlay}>
        <img
          className={styles.logo}
          src={talk.image.url}
          alt={talk.image.alt}
        />
      </div>
      <div className={styles.content}>
        <p className={styles.time}>
          {formatDate(talk.startTime).toUpperCase()} –{" "}
          {formatDate(talk.endTime).toUpperCase()}
        </p>
        <h2 className={styles.title}>{talk.title}</h2>
        <div className={styles.people}>
          {talk.speaker ? (
            <div className={styles.person} key={talk.speaker.name}>
              <img
                className={styles.avatar}
                src={talk.speaker.image?.url}
                alt={talk.speaker.image?.alt}
              />
              <div>
                <p className={styles.name}>
                  {talk.speaker?.name.toUpperCase()}
                </p>
                <p className={styles.tag}>{talk.speaker?.tagline}</p>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        <p className={styles.body}>{talk.description}</p>
      </div>
    </Modal>
  );
}
