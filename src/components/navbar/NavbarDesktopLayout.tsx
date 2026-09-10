import { useRef } from 'react';
import { Navbar } from '@components';
import styles from './NavbarDesktopLayout.module.css'

function NavbarDesktopLayout () {
    const closeNavbarRef = useRef(() => {});
    return (
        <nav className={styles['desktop-navbar']}>
            <Navbar closeNavbarRef={closeNavbarRef} className={styles['desktop-navbar-main']}/>
        </nav>
    )
}

export default NavbarDesktopLayout;