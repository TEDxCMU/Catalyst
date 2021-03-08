import { useEffect, useRef } from 'react';
import cn from 'classnames';
import styles from './modal.module.css';

export default function RegisterModal({ active, setActive, children }) {
    const modalRef = useRef(null);

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
            <div className={styles.content}>
                {children}
            </div>
        </section>
    );
}
