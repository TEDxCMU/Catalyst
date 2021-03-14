import { useEffect, useRef } from 'react';
import cn from 'classnames';
import styles from './modal.module.css';

export default function RegisterModal({ active, setActive, large, children }) {
    const modalRef = useRef(null);

    useEffect(() => {
        if (active) {
            document.body.classList.add(styles.body);
        } else {
            document.body.classList.remove(styles.body);
        }
    }, [active]);

    useEffect(() => {
        if (modalRef) {
            const handleClick = (event) => {
                if (event.target == modalRef.current) {
                    setActive(false);
                }
            };

            window.addEventListener('click', handleClick);

            () => {
                window.removeEventListener('click', handleClick);
            }
        }
    }, [modalRef]);

    return (
        <section ref={modalRef} className={cn(styles.modal, { [styles.active]: active })}>
            <div className={cn(styles.content, styles.aboutModal, { [styles.large]: large })}>
                {children}
            </div>
        </section>
    );
}
