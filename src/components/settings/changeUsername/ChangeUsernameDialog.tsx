import { useState, type SetStateAction, type CSSProperties, type Dispatch } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateUsername } from '@/hooks/accountQueryHooks';
import { useMe, useCheckUsername } from '@/hooks/authQueryHooks';
import { accountErrToCode, StatusCodeMap as ErrCode } from '@errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { usernameUpdateSchema, type UsernameFormType as FormType } from '../settings.data'
import { ModalData } from '../../index.componentTypes';
import { FaChevronLeft  as BackIcon, FaSave as SaveIcon  } from "react-icons/fa";
import logo from '@assets/edit-profile-logo.png'
import styles from './ChangeUsernameDialog.module.css'

interface Props {
    changeDialog: (dialog: ModalData.AvailableDialogs) => void;
    setParentNotif: Dispatch<SetStateAction<string | null>> | null;
}

function ChangeUsernameDialog({changeDialog, setParentNotif}: Props) {
    const {
        data: user,
        isSuccess: isUserSuccess,
        isLoading: isUserLoading,
        isError: isUserError,
        error: userError,
    } = useMe();
    const checkUsernameMutation = useCheckUsername();
    const updateUsernameMutation = useUpdateUsername();
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        getValues,
        formState: {errors, isSubmitting}
    } = useForm<FormType>({
        resolver: zodResolver(usernameUpdateSchema),
        mode: 'onChange'
    });
    const [httpNotif, setHttpNotif] = useState<string | null>(null);

    function handleUsernameUpdateError(errCode: number) {
        switch (errCode) {
            case ErrCode.timeout:
                setHttpNotif('Server Busy. Please try later');
                return;
            case ErrCode.unreachable:
                setHttpNotif('Failed! Please check your internet.')
                return;
            case 401:
                setHttpNotif('Invalid Password');
                return;
            case 403:
                setHttpNotif('Account Error! Please login again');
                return;
            case 409:
                setHttpNotif('Sorry! Username is taken.');
                break;
            default:
                setHttpNotif('Internal Server Error.');
        }
    }

    async function onSubmit(data: FormType) {
        setHttpNotif(null);
        if (data.newUsername === user?.username) {
            setHttpNotif('New username is same as current');
            return;
        }

        try {
            await updateUsernameMutation.mutateAsync(data);
            setHttpNotif('Username Updated');
            await new Promise((resolve) => setTimeout(resolve, 1000));
            changeDialog('settings');
        } catch(err) {
            console.log(err);
            const errCode = accountErrToCode(err as Error);
            handleUsernameUpdateError(errCode);
        }
    }

    const {onChange: rhfUsernameOnchange, ...usernameRest} = register('newUsername');

    async function checkUsernameAvailability(username: string) {
        if (username === user?.username) {
            clearErrors('newUsername');
            setError('newUsername', {type: 'onChange', message: 'Same as current username', });
            return;
        }
        try {
            usernameUpdateSchema.shape.newUsername.parse(username);
            await checkUsernameMutation.mutateAsync(username);
        } catch(err) {
            const errCode = accountErrToCode(err as Error);
            if (errCode === 409) {
                setError('newUsername', {type: 'onChange', message: 'Username not available', });
            }
        }
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
                <p className={'dialog-header ' + styles["update-header"]}>Change Username</p>
            </div>

{/*Server notifications are rendered here*/}
            {httpNotif ? (
                <div key={httpNotif} className={'dialog-http-notif-container ' + styles['http-notif-container']}>
                    <p className={styles[(httpNotif === 'Username Updated' ? 'http-notif-message-success' : 'http-notif-message-failure')]}>{httpNotif}</p>
                </div>
            ) : <></> }

{/* Form starts here */}
            <form className={'dialog-form ' + styles["update-form"]} onSubmit={handleSubmit(onSubmit)}>

    {/* Username input group: label, input field and error message */}
                <div className={'dialog-input-group ' + styles["update-input-group"]}>

                    <div className={`dialog-input-label-error`} >

                        <p className={'dialog-input-label ' + styles["update-input-label"]}>New Username</p>

                        {errors.newUsername? (
                            <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                            {errors.newUsername.message}
                        </p>
                        )  : <></>}

                    </div>
                    
                    <input {...usernameRest} onChange={async (e) => {
                        await rhfUsernameOnchange(e);
                        checkUsernameAvailability(getValues('newUsername'));
                    }} className={'dialog-text-input ' + styles["update-text-input"]} style={borderColorOnError('newUsername')}  placeholder={'Current Username: '+user?.username} disabled={isSubmitting} autoFocus />
                </div>

    {/* Password input group: label, input field and error message */}
                <div className={'dialog-input-group ' + styles["update-input-group"]}>

                    <div className={`dialog-input-label-error`} >

                        <p className={'dialog-input-label ' + styles["update-input-label"]}>Password</p>

                        {errors.password ? (
                            <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                            {errors.password.message}
                        </p>
                        )  : <></>}

                    </div>

                    <input type="password" {...register('password')} className={'dialog-text-input ' + styles["text-input"]} style={borderColorOnError('password')} placeholder='Enter your password' disabled={isSubmitting}/>
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
                                    <SaveIcon className={styles.icon} />
                                </span>
                                <span className={styles['button-label']}>Save</span>
                            </span>
                        </button>                        
                    </div>
            </form>
            {isSubmitting &&
                <div className={styles['progress-loader-container']}>
                    <span className={styles["progress-loader"]}></span>
                </div>
            }
        </div>
    )
}

export default ChangeUsernameDialog;