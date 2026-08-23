import { useCallback } from 'react';
import { Navbar } from '@components';
import styles from './NavbarDesktopLayout.module.css'

function NavbarDesktopLayout () {
    const showNavbar = true;
    const setShowNavbar = useCallback(() => {showNavbar}, []);
    return (
        <nav className={styles['desktop-navbar']}>
            <Navbar setShowNavbar={setShowNavbar} className={styles['desktop-navbar-main']}/>
        </nav>
    )
}

export default NavbarDesktopLayout;