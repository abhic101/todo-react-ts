import { useState, useEffect, type MouseEvent, useMemo, useRef, type RefObject } from 'react';
import { useAuthContext } from '@hooks';
import { ActiveModalRenderer, RenderConfirmDialog, BubbleNotif } from '@components';
import { StatusCodeMap as ErrCode } from '@errors';
import { ModalData } from '../index.componentTypes';
import { userNavLinks, guestNavLinks, type NavLink} from './navbar.data';
import { FaExclamationTriangle as WarningIcon } from "react-icons/fa";

import styles from './Navbar.module.css';

type AvailableDialogs = ModalData.AvailableDialogs;

interface Props {
    closeNavbarRef?: RefObject<() => void>;
    className: string;
}

// --------------use SIGNUP and SETTING DIALOGS in this component ----------------

/** Statefull component. Depends on authContext's 'user' state */
function Navbar({closeNavbarRef, className}: Props) {
    const {user, logout} = useAuthContext();
    const [currentNavLinks, setCurrentNavLinks] = useState(guestNavLinks);
    const [showConfirm, setShowConfirm] = useState<string | null>(null);
    const [showBubbleNotif, setShowBubbleNotif] = useState(false);
    const memoizedUserNavLinks = useMemo(() => userNavLinks, []);
    const memoizedGuestNavLinks = useMemo(() => guestNavLinks, []);

    // Dialog box state
    const [ activeDialog, setActiveDialog ] = useState<AvailableDialogs>(null);
    const bubbleNotifMsg = useRef('');

    // Set which navlinks group to render
    useEffect(() => {
        setShowConfirm(null);
        if (user?.userId !== 'guest') {
            setCurrentNavLinks(memoizedUserNavLinks)
        } else {
            setCurrentNavLinks(memoizedGuestNavLinks);
        }
    }, [user])

    async function logoutWrapper() {
        const statusCode = await logout();
        if (statusCode === 200) {
            closeNavbarRef?.current?.();
            return
        } else {
            switch (statusCode) {
                case 401:
                    return;
                case 403:
                    return;
                case ErrCode.timeout:
                    bubbleNotifMsg.current = 'Server Busy. Please try later';
                    break;
                case ErrCode.unreachable:
                    bubbleNotifMsg.current = 'Logout Failed! Please check your internet';
                    break;
                default:
                    bubbleNotifMsg.current = 'Logout Failed due to Server Issue'
            }
            setShowBubbleNotif(true);
        } 
    }

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
            closeNavbarRef?.current?.();
        }
    }

    function dialogOnClose() {
        setActiveDialog(null);
        
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
            {activeDialog ? (
                <ActiveModalRenderer activeDialog={activeDialog} setActiveDialog={setActiveDialog} onClose={dialogOnClose}/>
            ) : <></>}
            {showConfirm && <RenderConfirmDialog
                message={showConfirm}
                onCancel={() => {setShowConfirm(null)}}
                onClose={() => {setShowConfirm(null)}}
                onConfirm={async () => {await logoutWrapper()}}
            />}
            {showBubbleNotif && <BubbleNotif message={bubbleNotifMsg.current} onClose={() => {setShowBubbleNotif(false)}} />
            }
        </div>
    )
}

export default Navbar;