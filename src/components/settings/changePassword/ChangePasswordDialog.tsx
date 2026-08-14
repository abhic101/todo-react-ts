import { useState, type CSSProperties } from 'react';
import { useForm } from 'react-hook-form';
import { useAccountContext } from '@hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordUpdateSchema, type PasswordFormType as FormType } from '../settings.data'
import { ModalData } from '../../index.componentTypes';
import { FaChevronLeft  as BackIcon, FaSave as SaveIcon  } from "react-icons/fa";
import logo from '@assets/edit-profile-logo.png'
import styles from './ChangePasswordDialog.module.css'

interface Props {
    changeDialog: (dialog: ModalData.AvailableDialogs) => void;
}

function ChangePasswordDialog({changeDialog}: Props) {
    const { updatePassword } = useAccountContext();
    const {
        register,
        handleSubmit,
        trigger,
        formState: {errors, isSubmitting, touchedFields}
    } = useForm<FormType>({
        resolver: zodResolver(passwordUpdateSchema),
        mode: 'onTouched'
    });
    const [httpNotif, setHttpNotif] = useState<string | null>(null);

    async function onSubmit(data: FormType) {
        let updateRes: number | undefined;
        setHttpNotif(null);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        updateRes = await updatePassword(data);
        console.log(updateRes);
        if (!updateRes) {
            setHttpNotif('Unknown Error');
        } else if (updateRes === 200 || updateRes === 201) {
            setHttpNotif('Password Updated. Please login again');
            await new Promise((resolve) => setTimeout(resolve, 1000));
            changeDialog('login');
        } else if (updateRes === 401) {
            setHttpNotif('Incorrect Current Password');
        } else {
            setHttpNotif('Internal Server Error')
        }
    }

    const {onChange: rhfOnChangeNewPassword, ...restNewPassword} = register('newPassword');
    async function triggerPasswordValidation() {
        if (touchedFields.confirmNewPassword) trigger('confirmNewPassword');
        return;
    }

    const borderColorOnError = (field: keyof FormType) => {
        if (errors[field]) {
            return {'border': '2px solid var(--input-error-border-color)'} as CSSProperties;
        }
        return {'border': '2px solid transparent'} as CSSProperties;
    }

    return (
        <div className={'dialog-root ' + styles["update-root"] + ' ' + (isSubmitting ? styles['disabled']: '')} >
            
{/* Header, subheader and logo section */}
            <div className={'dialog-logo-container ' + styles["update-logo-container"]}>
                <img className={'dialog-logo ' + styles['update-logo']} src={logo} alt='update-logo' />
                <p className={'dialog-header ' + styles["update-header"]}>Change Password</p>
            </div>

{/*Server notifications are rendered here*/}
            {httpNotif ? (
                <div key={httpNotif} className={'dialog-http-notif-container ' + styles['http-notif-container']}>
                    <p className={styles[(httpNotif === 'Password Updated. Please login again' ? 'http-notif-message-success' : 'http-notif-message-failure')]}>{httpNotif}</p>
                </div>
            ) : <></> }

{/* Form starts here */}
            <form className={'dialog-form ' + styles["update-form"]} onSubmit={handleSubmit(onSubmit)}>

    {/* Current input group: label, input field and error message */}
                <div className={'dialog-input-group ' + styles["update-input-group"]}>

                    {errors.currentPassword? (
                        <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                        {errors.currentPassword.message}
                    </p>
                    )  : <></>}

                    <p className={'dialog-input-label ' + styles["update-input-label"]}>Current Password</p>
                    
                    <input {...register('currentPassword')} type='password'
                     className={'dialog-text-input ' + styles["text-input"]} style={borderColorOnError('currentPassword')}  placeholder='Enter current password' disabled={isSubmitting} autoFocus />
                </div>

    {/* New Password input group: label, input field and error message */}
                <div className={'dialog-input-group ' + styles['input-group']}>

                    {errors.newPassword ? (
                        <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                        {errors.newPassword.message}
                    </p>
                    )  : errors.confirmNewPassword ? (
                        <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                        {errors.confirmNewPassword.message}
                    </p>
                    )  : <></>}

                    <p className={`dialog-input-label ${styles['input-label']} ${styles['password-input-label']}`}>New Password</p>

                    <div className={styles['multiple-text-input-container']} style={borderColorOnError('newPassword')}>
                        
                        <input {...restNewPassword} onChange={async (e) => {
                            rhfOnChangeNewPassword(e);
                            await triggerPasswordValidation();
                        }} className={`dialog-text-input ${styles['text-input']} ${styles['text-input-top']}`} type='password' disabled={isSubmitting} placeholder='Enter New Password'/>
                        
                        <input {...register('confirmNewPassword')} className={`dialog-text-input ${styles['text-input']} ${styles['text-input-bottom']}`} placeholder='Confirm New Password' disabled={isSubmitting}/>
                    </div>
                </div>

    {/* Submit button */}
                    <div className={styles['button-group']}>
                        <button className={styles["back-button"]} onClick={(e) => {e.preventDefault();changeDialog('settings');}} disabled={isSubmitting}>
                            <span>
                                <span className={styles['back-icon']} >
                                    <BackIcon className={styles.icon} />
                                </span>
                                <span className={styles['button-label']}>Back</span>
                            </span>
                        </button>
                        <button className={styles["save-button"]} type="submit" disabled={isSubmitting}>
                            <span>
                                <span className={styles['back-icon']} >
                                    {isSubmitting ?
                                        <span className={styles.loader}></span>
                                        :
                                        <SaveIcon className={styles.icon} />
                                    }
                                </span>
                                <span className={styles['button-label']}>Save</span>
                            </span>
                        </button>                        
                    </div>
            </form>
        </div>
    )
}

export default ChangePasswordDialog;