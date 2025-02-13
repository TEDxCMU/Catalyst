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

import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import { isMobileOnly } from "react-device-detect";
import gsap from "gsap";
import styles from "./hero.module.css";
import Modal from "@components/modal";
import SignInForm from "@components/sign-in-form";
import RegisterForm from "@components/register-form";
import useLoginStatus from "@lib/hooks/use-login-status";
import { signOut } from "@lib/user-api";
import { DATE, TIME } from "@lib/constants";

const ThreeCanvas = lazy(() => import("./canvas"));

export default function Hero() {
  const router = useRouter();
  const overlayImageRef = useRef(null);
  const sliderRef = useRef(null);
  const imageWidth = useRef(null);
  const imageHeight = useRef(null);
  const clicked = useRef(false);
  const [imageIndex, setImageIndex] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [activeLoginModal, setActiveLoginModal] = useState(false);
  const [activeRegisterModal, setActiveRegisterModal] = useState(false);
  const { loginStatus } = useLoginStatus();

  const handleLoginModal = () => {
    setActiveLoginModal((prevState) => !prevState);
  };

  const handleRegisterModal = () => {
    setActiveRegisterModal((prevState) => !prevState);
  };

  const handleTicket = () => {
    router.push("/ticket");
  };

  const handleLogout = async () => {
    await signOut();
    router.reload();
  };

  const slide = (x) => {
    overlayImageRef.current.style.width = `${x}px`;
    sliderRef.current.style.left = `${
      overlayImageRef.current.offsetWidth - sliderRef.current.offsetWidth / 2
    }px`;
  };

  const handleSlideMove = (event) => {
    if (!clicked.current) return false;

    const rect = overlayImageRef.current.getBoundingClientRect();
    const xCoord = event.pageX - rect.left;
    const position = xCoord - window.pageYOffset;

    if (position < 0) return slide(0);
    if (position > imageWidth.current) return slide(imageWidth.current);
    return slide(position);
  };

  const handleSlideStart = (event) => {
    event.preventDefault();
    clicked.current = true;
    window.addEventListener("mousemove", handleSlideMove);
    window.addEventListener("touchmove", handleSlideMove);
  };

  const handleSlideEnd = () => {
    clicked.current = false;
  };

  const handleResize = () => {
    imageWidth.current = window.innerWidth;
    imageHeight.current = window.innerHeight;
  };

  useEffect(() => {
    setMounted(true);
    setImageIndex(Math.floor(Math.random() * 6) + 1);
  }, []);

  useEffect(() => {
    if (
      mounted &&
      overlayImageRef?.current &&
      sliderRef?.current &&
      !isMobileOnly
    ) {
      console.log("not done");
      // Get overlay img dimensions
      imageWidth.current = overlayImageRef.current.offsetWidth;
      imageHeight.current = overlayImageRef.current.offsetHeight;

      const timeline = gsap.timeline();

      timeline.to(`.${styles.img}`, { opacity: 1, delay: 0 }, 0);

      timeline.to(`.${styles.heading}`, { opacity: 1 }, 0.4);

      timeline.to(`[data-left]`, { opacity: 1 }, 0.8);
      timeline.to(`[data-right]`, { opacity: 1 }, 0.8);

      // Set width of overlay img to 50%
      timeline.fromTo(
        overlayImageRef.current,
        {
          width: 0,
        },
        {
          width: `${imageWidth.current * 0.55}px`,
          ease: "power3.inOut",
          duration: 1.3,
        },
        0.8
      );
      timeline.from(sliderRef.current, { opacity: 0, duration: 0.5 }, "<");

      // Position the slider in the center
      timeline.fromTo(
        sliderRef.current,
        {
          left: "-20px",
        },
        {
          left: `${
            imageWidth.current * 0.55 - sliderRef.current.offsetWidth / 2
          }px`,
          ease: "power3.inOut",
          duration: 1.3,
        },
        0.8
      );

      // Add slider events
      window.addEventListener("mouseup", handleSlideEnd);
      sliderRef.current.addEventListener("mousedown", handleSlideStart);
      sliderRef.current.addEventListener("touchstart", handleSlideStart);
      window.addEventListener("touchend", handleSlideEnd);
      window.addEventListener("resize", handleResize);

      // Clean up events
      return () => {
        window.removeEventListener("mouseup", handleSlideEnd);
        window.removeEventListener("touchend", handleSlideEnd);
        window.removeEventListener("mousemove", handleSlideMove);
        window.removeEventListener("touchmove", handleSlideMove);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [mounted, isMobileOnly]);

  return (
    <>
      {imageIndex && (
        <div className={styles.container}>
          <div className={styles.slide}>
            <div className={styles.content}>
              {/* {mounted && !isMobileOnly && (
                <Suspense fallback={null}>
                  <ThreeCanvas image={`/visuals/${imageIndex}-branch.jpg`} height={imageHeight.current} width={imageWidth.current} />
                </Suspense>
              )} */}
              <img
                className={styles.img}
                src={`/visuals/${imageIndex}-branch.jpg`}
                width="2976"
                height="1674"
              />
              <h1 className={cn(styles.heading, styles.stroke)}>
                TEDxCMU 2021: CATALYST
                {loginStatus === "loggedIn" ? (
                  <div>
                    <button className={styles.btn} onClick={handleTicket}>
                      View Ticket
                    </button>
                    <button className={styles.btn} onClick={handleLogout}>
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div>
                    <button className={styles.btn} onClick={handleLoginModal}>
                      Sign In
                    </button>
                    <button className={styles.btn} onClick={handleRegisterModal}>
                      Register For Free
                    </button>
                  </div>
                )}
              </h1>
              <p data-left className={cn(styles.body, styles.strokeLight)}>
                {DATE.slice(0, 9)} {TIME}
                {/* April 10, 2021 10:00AM */}
              </p>
              <p data-right className={cn(styles.body, styles.strokeLight)}>
                Online Experience
              </p>
            </div>
          </div>
          <div ref={sliderRef} className={styles.slider}>
            <div className={styles.knob}>
              <img
                className={styles.arrows}
                src="/slider-arrows.svg"
                alt="Slider Arrow"
              />
            </div>
          </div>
          <div ref={overlayImageRef} className={cn(styles.slide, styles.overlay)}>
            <div className={styles.content}>
              {/* {mounted && !isMobileOnly && (
                <Suspense fallback={null}>
                  <ThreeCanvas image={`/visuals/${imageIndex}-flower.jpg`} height={imageHeight.current} width={imageWidth.current} />
                </Suspense>
              )} */}
              <img
                className={styles.img}
                src={`/visuals/${imageIndex}-flower.jpg`}
                width="2976"
                height="1674"
              />
              <h1 className={styles.heading}>
                TEDxCMU 2021: CATALYST
                {loginStatus === "loggedIn" ? (
                  <div>
                    <button className={styles.btn} onClick={handleTicket}>
                      View Ticket
                    </button>
                    <button className={styles.btn} onClick={handleLogout}>
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div>
                    <button className={styles.btn} onClick={handleLoginModal}>
                      Sign In
                    </button>
                    <button className={styles.btn} onClick={handleRegisterModal}>
                      Register For Free
                    </button>
                  </div>
                )}
              </h1>
              <p data-left className={styles.body}>
                {DATE.slice(0, 9)} {TIME}
                {/* April 10, 2021 10:00AM */}
              </p>
              <p data-right className={styles.body}>
                Online Experience
              </p>
            </div>
          </div>
        </div>
      )}
      {loginStatus !== "loggedIn" && (
        <Modal active={activeLoginModal} setActive={setActiveLoginModal}>
          <SignInForm activeRegisterModal={activeLoginModal} />
        </Modal>
      )}
      {loginStatus !== "loggedIn" && (
        <Modal active={activeRegisterModal} setActive={setActiveRegisterModal}>
          <RegisterForm />
        </Modal>
      )}
    </>
  );
}
