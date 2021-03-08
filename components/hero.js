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

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import styles from './hero.module.css';
import Modal from '@components/modal';
import Form from '@components/form';
import useLoginStatus from '@lib/hooks/use-login-status';
import { signOut } from '@lib/user-api';

export default function Hero() {
  const router = useRouter();
  const overlayImgRef = useRef(null);
  const sliderRef = useRef(null);
  const knobRef= useRef(null);
  const arrowsRef = useRef(null);
  const imgWidth = useRef(null);
  const imgHeight = useRef(null);
  const clicked = useRef(false);
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
    router.push('/ticket');
  };

  const handleLogout = async () => {
    await signOut();
    router.reload();
  };

  const slide = (x) => {
    overlayImgRef.current.style.width = `${x}px`;
    sliderRef.current.style.left = `${overlayImgRef.current.offsetWidth - (sliderRef.current.offsetWidth / 2)}px`;
  };

  const handleSlideMove = (event) => {
    if (!clicked.current) return false;

    const rect = overlayImgRef.current.getBoundingClientRect();
    const xCoord = event.pageX - rect.left;
    const position = xCoord - window.pageYOffset;

    if (position < 0) return slide(0);
    if (position > imgWidth.current) return slide(imgWidth.current);
    return slide(position);
  }

  const handleSlideStart = (event) => {
    event.preventDefault();
    clicked.current = true;
    window.addEventListener('mousemove', handleSlideMove);
    window.addEventListener('touchmove', handleSlideMove);
  };

  const handleSlideEnd = () => {
    clicked.current = false;
  };

  const addEvents = () => {
    sliderRef.current.addEventListener('mousedown', handleSlideStart);
    window.addEventListener('mouseup', handleSlideEnd);
    sliderRef.current.addEventListener('touchstart', handleSlideStart);
    window.addEventListener('touchend', handleSlideEnd);
  };

  const removeEvents = () => {
    sliderRef.current.removeEventListener('mousedown', handleSlideStart);
    window.removeEventListener('mouseup', handleSlideEnd);
    sliderRef.current.removeEventListener('touchstart', handleSlideStart);
    window.removeEventListener('touchend', handleSlideEnd);
    window.removeEventListener('mousemove', handleSlideMove);
    window.removeEventListener('touchmove', handleSlideMove);
  };

  useEffect(() => {
    if (overlayImgRef && overlayImgRef.current) {
      // Get overlay img dimensions
      imgWidth.current = overlayImgRef.current.offsetWidth;
      imgHeight.current = overlayImgRef.current.offsetHeight;

      // Set width of overlay img to 50%
      overlayImgRef.current.style.width = `${(imgWidth.current / 2)}px`;

      // Create slider element
      sliderRef.current = document.createElement('div');
      sliderRef.current.setAttribute('class', styles.slider);

      // Add knob to slider
      knobRef.current = document.createElement('div');
      knobRef.current.setAttribute('class', styles.knob);
      sliderRef.current.appendChild(knobRef.current);

      // Add image to circle
      arrowsRef.current = document.createElement('img');
      arrowsRef.current.setAttribute('src', '/slider-arrows.svg');
      arrowsRef.current.setAttribute('class', styles.arrows);
      knobRef.current.appendChild(arrowsRef.current);

      // Add slider to the DOM
      overlayImgRef.current.parentElement.insertBefore(sliderRef.current, overlayImgRef.current);

      // Position the slider in the center
      sliderRef.current.style.top = `${(imgHeight.current / 2) - (sliderRef.current.offsetHeight / 2)}px`;
      sliderRef.current.style.left = `${(imgWidth.current / 2) - (sliderRef.current.offsetWidth / 2)}px`;

      // Add slider events
      addEvents();

      // Clean up events
      return () => {
        removeEvents();
        arrowsRef.current.remove();
        knobRef.current.remove();
        sliderRef.current.remove();
      }
    }
  }, [])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.slide}>
          <div className={styles.content}>
            <img className={styles.img} src="/hero.jpg" width="2880" height="1646" />
            <h1 className={cn(styles.heading, styles.stroke)}>
              TEDxCMU 2021: CATALYST
              {loginStatus === 'loggedIn' ? (
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
            <p className={cn(styles.body, styles.stroke)}>
              April 4, 2021 10:00AM
            </p>
            <p className={cn(styles.body, styles.stroke)}>
              Online Experience
            </p>
          </div>
        </div>
        <div ref={overlayImgRef} className={cn(styles.slide, styles.overlay)}>
          <div className={styles.content}>
            <img className={styles.img} src="/hero.jpg" width="2880" height="1646" />
            <h1 className={styles.heading}>
              TEDxCMU 2021: CATALYST
              {loginStatus === 'loggedIn' ? (
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
            <p className={styles.body}>
              April 4, 2021 10:00AM
            </p>
            <p className={styles.body}>
              Online Experience
            </p>
          </div>
        </div>
      </div>
      {loginStatus !== 'loggedIn' && (
        <Modal active={activeLoginModal} setActive={setActiveLoginModal}>
          <Form />
        </Modal>
      )}
      {loginStatus !== 'loggedIn' && (
        <Modal active={activeRegisterModal} setActive={setActiveRegisterModal}>
          <Form />
        </Modal>
      )}
    </>
  );
}
