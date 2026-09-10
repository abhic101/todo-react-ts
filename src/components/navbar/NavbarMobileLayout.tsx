import { useState, useEffect, useRef, type MouseEvent, type CSSProperties } from 'react';
import { Navbar } from '@components';
import { FaBars as HamburgerMenuIcon, FaTimes as CloseIcon } from "react-icons/fa";
import styles from './NavbarMobileLayout.module.css';

const CLOSE_DELAY = 250;

function NavbarMobileLayout() {
    const [ showNavbar, setShowNavbar ] = useState<boolean>(false);
    const [closeRequested, setCloseRequested ] = useState<boolean>(false);
    const closeWithDelay = useRef(() => {});

    useEffect(() => {
        if (!showNavbar) return;
        let closeTimerId: number;
        closeWithDelay.current = () => {
            setCloseRequested(true);
            closeTimerId = setTimeout(() => {setShowNavbar(false)}, CLOSE_DELAY);
        }

        return () => {
            clearTimeout(closeTimerId);
            setCloseRequested(false);
        }
    }, [showNavbar]);

    function handleOnClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (showNavbar) {
            closeWithDelay.current();
        } else {
            setShowNavbar(true);
        }
    }

    function transitionSelector() {
        if (closeRequested) return styles['close'];
        return styles['open'];
    }

    function positionSelector() {
        if (showNavbar) return styles['hamburger-button-open'];
        return ''
    }

    function toggleDisplay() {
        if (showNavbar) return {display: 'flex'} as CSSProperties;
        return {display: 'none'} as CSSProperties;
    }

    return (
        <nav className={styles['mobile-navbar']}>
            <button className={styles['hamburger-button'] + ' ' + positionSelector()} onClick={handleOnClick}>
                {showNavbar ? <CloseIcon/> : <HamburgerMenuIcon />}
            </button>
                <div className={styles['navbar-overlay']} onClick={(e) => {e.preventDefault();closeWithDelay.current()}} style={toggleDisplay()}> 
                    <Navbar closeNavbarRef={closeWithDelay} className={`${styles['mobile-navbar-main']} ${transitionSelector()}`} />
                </div>
                    
        </nav>
    )
}

export default NavbarMobileLayout;