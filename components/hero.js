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
import { useEffect, useRef } from 'react';
import styles from './hero.module.css';

export default function Hero() {
  const overlayImgRef = useRef(null);
  const sliderRef = useRef(null);
  const imgWidth = useRef(null);
  const imgHeight = useRef(null);
  const clicked = useRef(false);

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

      // Add circle to slider
      const circle = document.createElement('div');
      circle.setAttribute('class', styles.circle);
      sliderRef.current.appendChild(circle);

      // Add slider to the DOM
      overlayImgRef.current.parentElement.insertBefore(sliderRef.current, overlayImgRef.current);

      // Position the slider in the center
      sliderRef.current.style.top = `${(imgHeight.current / 2) - (sliderRef.current.offsetHeight / 2)}px`;
      sliderRef.current.style.left = `${(imgWidth.current / 2) - (sliderRef.current.offsetWidth / 2)}px`;

      // Add slider events
      addEvents();

      // Clean up events
      return () => removeEvents();
    }
  }, [])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.imgContainer}>
          {/* <h1 className={styles.heading}>
            The future belongs to those who believe in the beauty of their dreams.
          </h1> */}
          <div className={styles.img}>
            <img src="/hero.jpg" width="2880" height="1646" />
          </div>
          <div ref={overlayImgRef} className={cn(styles.img, styles.imgOverlay)}>
            <img src="/hero.jpg" width="2880" height="1646" />
          </div>
        </div>
      </div>
    </>
  );
}
