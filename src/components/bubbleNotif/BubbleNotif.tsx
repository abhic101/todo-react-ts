import {useEffect, useState, useRef} from 'react';
import {createPortal} from 'react-dom';
import { FaTimes as CloseIcon } from 'react-icons/fa';
import styles from './BubbleNotif.module.css';

interface Props {
    message: string;
    autoCloseTime?: number;
    onClose: () => void;
}

function BubbleNotif({message, autoCloseTime, onClose}: Props) {
    const [closeRequested, setCloseRequested] = useState(false);
    
    let onCloseWrapper = useRef(() => {});
    useEffect(() => {
        let closeAnimTimerId: number;
        onCloseWrapper.current = () => {
            setCloseRequested(true);
            closeAnimTimerId = setTimeout(onClose, 200);
        }
        return () => {clearTimeout(closeAnimTimerId)}
    }, [onClose])

    useEffect(() => {
        if (!autoCloseTime) return;
        const closeTimerId = setTimeout(() => {onCloseWrapper.current()}, autoCloseTime);
        return () => {clearTimeout(closeTimerId)};
    });

    function dynamicTransitionClass(originalName: string) {
        if (closeRequested) return styles[originalName] + ' ' + styles['close'];
        return styles[originalName] + ' ' + styles['open'];
    }

    return createPortal(
        <div className = {styles['bubble-notif-main']} >
            <div className = {dynamicTransitionClass('bubble-notif-container')} >
                <p className = {styles['bubble-notif-message']}>
                    {message}
                </p>
                <button className = {styles['bubble-notif-close']} onClick={(e)=>{e.preventDefault(); onCloseWrapper.current()}}>
                    <CloseIcon className={styles['close-icon']} />
                </button>
            </div>
        </div>
    , document.body)
}

export default BubbleNotif;

