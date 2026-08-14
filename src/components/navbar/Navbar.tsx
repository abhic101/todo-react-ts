import { useState, useEffect, type MouseEvent } from 'react';
import { useAuthContext } from '@hooks';
import { ActiveModalRenderer, RenderConfirmDialog } from '@components';
import { ModalData } from '../index.componentTypes';
import { loggedInNavLinks, loggedOutNavLinks, type NavLink} from './navbar.data';
import styles from './Navbar.module.css';

type AvailableDialogs = ModalData.AvailableDialogs;

// --------------use SIGNUP and SETTING DIALOGS in this component ----------------

/** Statefull component. Depends on authContext's 'user' state */
function Navbar() {
    const [user, , , logout] = useAuthContext();
    const [currentNavLinks, setCurrentNavLinks] = useState(loggedOutNavLinks);
    const [showConfirm, setShowConfirm] = useState<string | null>(null);

    // Dialog box state
    const [ activeDialog, setActiveDialog ] = useState<AvailableDialogs>(null);

    // Set which navlinks group to render
    useEffect(() => {
        if (user?.userId !== 'guest') {
            setCurrentNavLinks(structuredClone(loggedInNavLinks))
        } else {
            setCurrentNavLinks(structuredClone(loggedOutNavLinks));
        }
    }, [user])

    /**
     * @param e ClickEvent
     * @param navLink NavLink on which e is triggered (clicked)
     */
    function handleOnClick(e: MouseEvent<HTMLAnchorElement>, navLink: NavLink) {
        e.preventDefault();
        if (navLink.name === 'logout') {
            setShowConfirm('Are you sure to logout?');
        }
        else {
            setActiveDialog(navLink.name as keyof AvailableDialogs);
        }
    }
    
    return (
        <nav>
            <div className={styles['navbar-message']}>
                <span className={styles.temp}>
                    <span className={styles["navbar-message-welcome"]}>Welcome,&nbsp;</span>
                    <span className={styles['navbar-message-firstname']}>{user.firstname} !</span>
                </span>
            </div> 
            {/* <div className={styles['theme-container']}>
                <span className={styles["theme"]}>
                    &#128262;
                </span>
            </div> */}
            <div className={styles['navlink-container']}>
                {currentNavLinks?.map((navLink) => {
                    return (
                        <a className={styles["navlink"]} key={navLink.name} href="#" onClick={(e) => {handleOnClick(e, navLink)}}>
                            <span className={styles['navlink-label']}>{navLink.label}</span>
                        </a>
                    )
                })}
            </div>
            {activeDialog ? (
                <ActiveModalRenderer activeDialog={activeDialog} setActiveDialog={setActiveDialog} />
            ) : <></>}
            {showConfirm && <RenderConfirmDialog
                message={showConfirm}
                onCancel={() => {setShowConfirm(null)}}
                onClose={() => {setShowConfirm(null)}}
                onConfirm={() => {logout()}}
            />}
            </nav>
    )
}

export default Navbar;