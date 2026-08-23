import { useState, useEffect, type MouseEvent, useMemo } from 'react';
import { useAuthContext } from '@hooks';
import { ActiveModalRenderer, RenderConfirmDialog } from '@components';
import { AccountProvider } from '@context';
import { ModalData } from '../index.componentTypes';
import { userNavLinks, guestNavLinks, type NavLink} from './navbar.data';
import { FaExclamationTriangle as WarningIcon } from "react-icons/fa";

import styles from './Navbar.module.css';

type AvailableDialogs = ModalData.AvailableDialogs;

interface Props {
    closeNavbar: () => void;
    className: string;
}

// --------------use SIGNUP and SETTING DIALOGS in this component ----------------

/** Statefull component. Depends on authContext's 'user' state */
function Navbar({closeNavbar, className}: Props) {
    const [user, , , logout] = useAuthContext();
    const [currentNavLinks, setCurrentNavLinks] = useState(guestNavLinks);
    const [showConfirm, setShowConfirm] = useState<string | null>(null);
    const memoizedUserNavLinks = useMemo(() => userNavLinks, []);
    const memoizedGuestNavLinks = useMemo(() => guestNavLinks, []);

    // Dialog box state
    const [ activeDialog, setActiveDialog ] = useState<AvailableDialogs>(null);

    // Set which navlinks group to render
    useEffect(() => {
        setShowConfirm(null);
        if (user?.userId !== 'guest') {
            setCurrentNavLinks(memoizedUserNavLinks)
        } else {
            setCurrentNavLinks(memoizedGuestNavLinks);
        }
    }, [user])

    /**
     * @param e ClickEvent
     * @param navLink NavLink on which e is triggered (clicked)
     */
    async function handleOnClick(e: MouseEvent<HTMLAnchorElement>, navLink: NavLink) {
        e.preventDefault();
        if (navLink.name === 'logout') {
            setShowConfirm('Are you sure to logout?');
        }
        else {
            setActiveDialog(navLink.name as keyof AvailableDialogs);
        }
    }

    function dialogOnClose() {
        setActiveDialog(null);
        closeNavbar();
    }
    
    return (
        <div className={className} onClick={(e) => {e.stopPropagation();}}>
            <div className={styles['navbar-messages']}>
                <span className={styles['navbar-message']}>
                    <span className={styles["message-welcome"]}>Welcome,&nbsp;</span>
                    <span className={styles['message-firstname']}>{user.firstname} !</span>
                </span>
                {user.userId==='guest' ? 
                    <span className={`${styles['navbar-message']} ${styles['warning-container']}`}>
                        <span className={styles['warning-icon']}>
                            <WarningIcon />
                        </span>
                        <span className={styles["warning-message"]} >
                            Log in to save list into server
                        </span>
                    </span>
                    :
                    null
                }
            </div> 

            <div className={styles['navlink-container']}>
                {currentNavLinks?.map((navLink) => {
                    return (
                        <a className={styles["navlink"]} key={navLink.name} href="#" onClick={(e) => {handleOnClick(e, navLink)}}>
                            <span className={styles['navlink-label']}>{navLink.label}</span>
                        </a>
                    )
                })}
            </div>
            <AccountProvider>
                {activeDialog ? (
                    <ActiveModalRenderer activeDialog={activeDialog} setActiveDialog={setActiveDialog} onClose={dialogOnClose}/>
                ) : <></>}
            </AccountProvider>
            {showConfirm && <RenderConfirmDialog
                message={showConfirm}
                onCancel={() => {setShowConfirm(null);closeNavbar()}}
                onClose={() => {setShowConfirm(null);closeNavbar()}}
                onConfirm={() => {logout();closeNavbar()}}
            />}
        </div>
    )
}

export default Navbar;