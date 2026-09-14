import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateProfile, useGetAccount } from '@/hooks/accountQueryHooks';
import type { ModalData } from '../index.componentTypes';
import { AiFillEdit as EditIcon, AiFillCloseCircle as NotEditIcon } from "react-icons/ai";
import { accountErrToCode, StatusCodeMap as ErrCode } from '@errors';
import { FaSave as SaveIcon } from "react-icons/fa";
import { profileUpdateSchema, type ProfileFormType } from './settings.data';
import editProfileLogo from '@assets/edit-profile-logo.png';
import styles from './SettingsDialog.module.css';

interface Props {
    onClose: () => void;
    changeDialog: (dialogs: ModalData.AvailableDialogs) => void;
}

function SettingsDialog({onClose, changeDialog}: Props) {
    const {
        data: profile,
        isLoading: isProfileLoading,
        isError: isProfileError,
        isSuccess: isProfileSuccess,
        error: profileError
    } = useGetAccount();
    const updateProfileMutation = useUpdateProfile();
    const {
        register,
        handleSubmit,
        setFocus,
        getValues,
        setValue,
        formState: {errors, isSubmitting}
    } = useForm<ProfileFormType>({
        resolver: zodResolver(profileUpdateSchema),
        mode: 'onTouched',
        
    });
    const [ httpNotif, setHttpNotif] = useState<string | null>(null);
    const [ editField, setEditField ] = useState({
        firstname: false,
        lastname: false
    });

    function handleProfileUpdateError(errCode: number) {
        switch (errCode) {
            case ErrCode.timeout:
                setHttpNotif('Server Busy. Please try later');
                return;
            case ErrCode.unreachable:
                setHttpNotif('Failed! Please check your internet.')
                return;
            case 401:
                setHttpNotif('Account Error! Please login again');
                return;
            case 403:
                setHttpNotif('Account Error! Please login again');
                return;
            default:
                setHttpNotif('Internal Server Error.');
        }
    }

    async function onSubmit(data: ProfileFormType) {
        setHttpNotif(null);
        const isFirstnameSame = profile?.firstname === getValues('firstname');
        const isLastnameSame = profile?.lastname === getValues('lastname');
        if (isFirstnameSame && isLastnameSame) {
            setHttpNotif('No Changes');
            return;
        }
        try {
            await updateProfileMutation.mutateAsync(data);
            setHttpNotif('Profile Updated');
            setEditField(() => {
                return {firstname: false, lastname: false}
            });
        } catch (err) {
            const errCode = accountErrToCode(err as Error);
            handleProfileUpdateError(errCode);
        }
    }
    
    return (
        <div className={'dialog-root ' + styles["signup-root"] + (isSubmitting ? " " + styles['disabled'] : "" )}>

{/* Header, subheader and logo     */}
            <div className={'dialog-logo-container ' + styles['logo-container']}>
                <img className={'dialog-logo ' + styles['settings-logo']} src={editProfileLogo} alt='login-logo' />
                <p className={'dialog-header ' + styles['settings-header']}>
                    Account Details
                </p>
            </div>

            {httpNotif ? (
                <div key={httpNotif} className={'dialog-http-notif-container ' + styles['http-notif-container']}>
                    <div className={httpNotif === 'Profile Updated' ? 'dialog-http-notif-message-success' : 'dialog-http-notif-message-failure'}>{httpNotif}</div>
                </div>
            ) : (<></>)}
            
            { profile ? (
            <form className={'dialog-form ' + styles['form']} onSubmit={handleSubmit(onSubmit)}>

    {/* fistname input group */}
                <div className={'dialog-input-group ' + styles['input-group']}>

                    <div className={`dialog-input-label-error`} >
                        <p className={'dialog-input-label ' + styles['input-label']}>Firstname</p>
                        {errors.firstname ? (
                            <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                            {errors.firstname.message}
                        </p>
                        )  : <></>}
                    </div>

                    <div className={styles['input-group-interactibles']}>
                        <input {...register('firstname', {value: profile?.firstname})} className={'dialog-text-input ' + styles['text-input']} disabled={isSubmitting || !editField.firstname} placeholder="Firstname" autoFocus/>

                        <button className={styles['input-state-button']} onClick={(e) => {e.preventDefault();setEditField((prev) => ({...prev, firstname:!prev.firstname}));setFocus('firstname')}}>
                            {editField.firstname ? <NotEditIcon onClick={(e) => {e.preventDefault;setValue('firstname', profile.firstname)}}/> : <EditIcon/>}
                        </button>
                    </div>

                    {(editField.firstname) && (
                        <button type='submit' className={styles['save-button']} ><SaveIcon className={styles['save-icon']}/> <span>Save </span></button>
                    )}
                    
                </div>

    {/* lastname input group */}                
                <div className={'dialog-input-group ' + styles['input-group']}>

                    <div className={`dialog-input-label-error`} >
    
                        <p className={'dialog-input-label ' + styles['input-label']}>Lastname</p>

                        {errors.lastname ? (
                            <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                            {errors.lastname.message}
                        </p>
                        )  : <></>}

                    </div>
                    <div className={styles['input-group-interactibles']}>
                        <input {...register('lastname', {value: profile?.lastname || ''})} className={'dialog-text-input ' + styles['text-input']} disabled={isSubmitting || !editField.lastname} placeholder="Lastname" />
                        <button className={styles['input-state-button']} onClick={(e) => {e.preventDefault();setEditField((prev) => ({...prev, lastname: !editField.lastname}));setFocus('lastname')}}>
                            {editField.lastname ? <NotEditIcon onClick={(e) => {e.preventDefault;setValue('lastname', profile.lastname)}}/> : <EditIcon/>}
                        </button>
                    </div>
                    {(editField.lastname) && (
                        <button type='submit' className={styles['save-button']} ><SaveIcon className={styles['save-icon']}/> <span>Save </span></button>
                    )}
                        
                </div>
                {/* {(editField.firstname || editField.lastname) && (
                    <button type='submit' className={styles['save-button']} ><SaveIcon className={styles['save-icon']}/> <span>Save </span></button>
                )} */}
                
                <div className={'dialog-input-group ' + ' ' + styles['input-group'] + ' ' + styles['prompt-group']}>
    
                    <p className={'dialog-input-label ' + styles['input-label']}>Username:</p>
                    <button className={styles['prompt-button']} onClick={(e) => {e.preventDefault();changeDialog('username-updator')}}>
                        Change Username
                    </button>
                </div>
                <div className={'dialog-input-group ' + styles['prompt-group'] + ' ' + styles['input-group']}>
    
                    <p className={'dialog-input-label ' + styles['input-label']}>Password:</p>
                    
                    <button className={styles['prompt-button']} onClick={(e) => {e.preventDefault();changeDialog('password-updator')}}>
                        Change Password
                    </button>
                </div>

            </form>
            ) : (
                <p className={styles['no-profile-message']}> No Profile found </p>
            )}
        </div>
    )
}

export default SettingsDialog;