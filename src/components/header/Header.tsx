import styles from './Header.module.css'
import logo from '@assets/main-app-logo.png'

/**
 * Stateless component. Memoize it to avoid re-render.
 */
function Header() {
    return (
        <div className={styles["header-main"]}>
            <div className={styles["logo-container"]}>
                <img className={styles['logo']} src={logo} alt='logo' />
                <span className={styles['appName_1']}>Simple&nbsp;</span>
                <span className={styles['appName_2']}>Todo</span>
            </div>
            <div className={styles['slogan-container']}>
                <span className={styles["slogan"]}>
                    Manage Your Day to Day Tasks
                </span>
            </div>
        </div>
    )
}

export default Header;