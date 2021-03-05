import { useEffect, useRef } from 'react';
import cn from 'classnames';
import Form from '@components/form';
import styles from './register-modal.module.css';

export default function RegisterModal({ active, setActive }) {
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
                <Form />
            </div>
        </section>
    );
}
