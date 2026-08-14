
import { FaCheck as ConfirmIcon, FaTimes as CancelIcon } from "react-icons/fa";
import styles from './ConfirmDialog.module.css';

interface Props {
    onConfirm: () => void;
    onCancel: () => void;
    onClose: () => void;
    message: string;
}

function ConfirmDialog({message, onConfirm, onCancel, onClose}: Props) {

    return (
    <div className={'dialog-root ' + styles["confirm-root"]} >
            

            <p className={'dialog-subheader ' + styles["confirm-message"]}>{message}</p>


{/* Form starts here */}
            <form className={'dialog-form ' + styles["confirm-form"]} onSubmit={(e) => {e.preventDefault();onConfirm()}}>
                
    {/* Submit button */}
                    <div className={styles['button-group']}>
                        <button className={styles["confirm-button"]} type="submit" onClick={(e) => {e.preventDefault();onConfirm();onClose()}} >
                            <span>
                                <span className={styles['confirm-icon']} >
                                    <ConfirmIcon className={styles.icon} />
                                </span>
                                <span className={styles['button-label']}>Confirm</span>
                            </span>
                        </button>     
                        <button className={styles["cancel-button"]} onClick={(e) => {e.preventDefault();onCancel()}}>
                            <span>
                                <span className={styles['cancel-icon']} >
                                    <CancelIcon className={styles.icon} />
                                </span>
                                <span className={styles['button-label']}>Cancel</span>
                            </span>
                        </button>
                                           
                    </div>
            </form>
        </div>
    )
}

export default ConfirmDialog;