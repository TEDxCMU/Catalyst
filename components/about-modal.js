import { useState, useEffect, useRef } from "react";
import cn from "classnames";
import styles from "./modal.module.css";
import gsap from "gsap";

export default function RegisterModal({ active, setActive, large, children }) {
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (active) {
      document.body.classList.add(styles.body);
    } else {
      document.body.classList.remove(styles.body);
    }
  }, [active]);

  useEffect(() => {
    if (active) {
      console.log("animation is running");
      const timeline = gsap.timeline();
      timeline.to(
        modalRef.current,
        {
          backdropFilter: "blur(10px) opacity(1)",
        },
        0.02
      );
      timeline.to(
        modalRef.current,
        {
          backgroundColor: "rgba(10, 10, 11, 0.5)",
        },
        0.02
      );
      timeline.from(contentRef.current, { opacity: 0 }, 0);
      timeline.from(contentRef.current, { y: 20, ease: "power3" }, 0);
    }
  }, [active]);

  useEffect(() => {
    if (modalRef) {
      const handleClick = (event) => {
        if (event.target == modalRef.current) {
          setActive(false);
        }
      };

      window.addEventListener("click", handleClick);

      () => {
        window.removeEventListener("click", handleClick);
      };
    }
  }, [modalRef]);

  return (
    <section
      ref={modalRef}
      className={cn(styles.modal, { [styles.active]: active })}
    >
      <div
        ref={contentRef}
        className={cn(styles.aboutModal, { [styles.large]: large })}
      >
        {children}
      </div>
    </section>
  );
}
