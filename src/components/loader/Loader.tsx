import styles from './Loader.module.css';

interface Props {
    className?: string;
}

function Loader({className = 'loader-overlay'}: Props) {
    return (
        <div className={styles[className]}>
            <div className={styles['loader-container']}>

                <span className={styles.message}>
                    Loading your tasks
                    <span className={styles.loader}></span>
                </span>
            </div>
        </div>
    )
}

export default Loader;