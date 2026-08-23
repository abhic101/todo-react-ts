import { CenterModal, LoginDialog, SignupDialog, TaskEditorDialog, SettingsDialog, ChangeUsernameDialog, ChangePasswordDialog } from '@components'
import { type SetStateAction, type Dispatch, useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { type AvailableDialogs } from './modalRenderer.data';

const DELAY_TIMER = 150;    // In milliseconds

interface Props {
    activeDialog: AvailableDialogs;
    setActiveDialog: Dispatch<SetStateAction<AvailableDialogs>>;
    onClose?: () => void;
    dialogProps?: any;
}

/**
 * @returns Dialog component to be rendered based on whats currently active
 */
function ActiveModalRender({activeDialog, setActiveDialog, onClose, dialogProps}: Props) {
    const [closeRequested, setCloseRequested] = useState(true);
    const onCloseWrapperForDelay = useRef(() => {});
    const changeDialogWrapperForDelay = useRef((dialog: AvailableDialogs) => {dialog});

    useEffect(() => {
        if (activeDialog === null) return;
        setCloseRequested(false);
        let onCloseWrapperTimerId: number, changeDialogWrapperTimerId: number;

        onCloseWrapperForDelay.current = () => {
            setCloseRequested(true);
            onCloseWrapperTimerId = setTimeout(() => {
                if (onClose) {
                    onClose();
                } else {
                    setActiveDialog(null);
                }
            }, DELAY_TIMER)
        };

        changeDialogWrapperForDelay.current = (dialog: AvailableDialogs) => {
            setCloseRequested(true);
            changeDialogWrapperTimerId = setTimeout(() => setActiveDialog(dialog), DELAY_TIMER)
        }

        return () => {
            clearTimeout(onCloseWrapperTimerId);
            clearTimeout(changeDialogWrapperTimerId);
        };
    }, [activeDialog]);

    if (activeDialog === null) return null;

    return createPortal(
        <CenterModal closeRequested={closeRequested} onClose={onCloseWrapperForDelay.current}>
            {activeDialog === 'login' && <LoginDialog onClose={onCloseWrapperForDelay.current} changeDialog={() => changeDialogWrapperForDelay.current('signup')}/>}
            {activeDialog === 'signup' && <SignupDialog onClose={onCloseWrapperForDelay.current} changeDialog={() => changeDialogWrapperForDelay.current('login')}/>}
            {activeDialog === 'task-editor' && <TaskEditorDialog onClose={onCloseWrapperForDelay.current} task={dialogProps?.task ? dialogProps.task : undefined }/>}
            {activeDialog === 'settings' && <SettingsDialog onClose={onCloseWrapperForDelay.current} changeDialog={changeDialogWrapperForDelay.current}/>}
            {activeDialog === 'username-updator' && <ChangeUsernameDialog changeDialog={changeDialogWrapperForDelay.current} setParentNotif={dialogProps?.setHttpNotif || null}/>}
            {activeDialog === 'password-updator' && <ChangePasswordDialog changeDialog={changeDialogWrapperForDelay.current} />}
        </CenterModal>
        , document.body
    )
}

export default ActiveModalRender;