import { Navbar } from '@components';
import styles from './NavbarDesktopLayout.module.css'

function NavbarDesktopLayout () {
    const showNavbar = true;
    const setShowNavbar = () => {showNavbar};
    return (
        <nav className={styles['desktop-navbar']}>
            <Navbar closeNavbar={setShowNavbar} className={styles['desktop-navbar-main']}/>
        </nav>
    )
}

export default NavbarDesktopLayout;