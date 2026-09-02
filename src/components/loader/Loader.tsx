import { createPortal } from 'react-dom';
import styles from './Loader.module.css';

interface Props {
    className?: string;
    message?: string;
}

function Loader({className = 'loader-overlay', message=''}: Props) {
    return createPortal(
        <div className={styles[className]}>
            <div className={styles['loader-container']}>

                <span className={styles.message}>
                    {message}
                    <span className={styles.loader}></span>
                </span>
            </div>
        </div>
    , document.body)
}

export default Loader;