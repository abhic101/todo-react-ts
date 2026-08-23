import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {CenterModal, ConfirmDialog} from '@components'

interface Props {
    onConfirm: () => void;
    onCancel: () => void;
    onClose: () => void;
    message: string;
}

const DELAY = 100;

function RenderConfirmDialog({message, onConfirm, onCancel, onClose}: Props) {
    const [closeRequested, setCloseRequested] = useState<boolean>(false);
    const onCloseDelayWrapper = useRef(() => {});
    const onCancelDelayWrapper = useRef(() => {});
    let onCloseTimerId: number, onCancelTimerId: number;
    onCloseDelayWrapper.current = () => {
        setCloseRequested(true);
        onCloseTimerId = setTimeout(onClose, DELAY);
    }
    onCancelDelayWrapper.current = () => {
        setCloseRequested(true);
        onCancelTimerId = setTimeout(onCancel, DELAY);
    }

    useEffect(() => {
        if (message === null) return
        setCloseRequested(false);

        return () => {
            clearTimeout(onCloseTimerId);
            clearTimeout(onCancelTimerId);
        };
    }, [])
    if (!message) return null;

    return createPortal(
        <CenterModal closeRequested={closeRequested} onClose={onCloseDelayWrapper.current}>
            <ConfirmDialog message={message} onConfirm={onConfirm} onCancel={onCancelDelayWrapper.current} onClose={onCloseDelayWrapper.current}/>
        </CenterModal>
    , document.body);
}

export default RenderConfirmDialog;