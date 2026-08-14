import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAccountContext } from '@hooks';
import type { ModalData } from '../index.componentTypes';
import { AiFillEdit as EditIcon, AiFillCloseCircle as NotEditIcon } from "react-icons/ai";
import { ActiveModalRenderer } from '@components';
import { FaSave as SaveIcon } from "react-icons/fa";
import { profileUpdateSchema, type ProfileFormType } from './settings.data';
import editProfileLogo from '@assets/edit-profile-logo.png';
import styles from './SettingsDialog.module.css';

interface Props {
    onClose: () => void;
    changeDialog: (dialogs: ModalData.AvailableDialogs) => void;
}

function SettingsDialog({onClose, changeDialog}: Props) {
    const {profile, updateProfile} = useAccountContext();
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
    const [currentSubDialog, setCurrentSubDialog] = useState<ModalData.AvailableDialogs | null>(null);

    async function onSubmit(data: ProfileFormType) {
        let profileRes: number | undefined;
        setHttpNotif(null);
        const isFirstnameSame = profile?.firstname === getValues('firstname');
        const isLastnameSame = profile?.lastname === getValues('lastname');
        if (isFirstnameSame && isLastnameSame) {
            setHttpNotif('No Changes');
            return;
        }
        else {
            profileRes = await updateProfile(data);
        }

        if (!profileRes) {
            setHttpNotif('Unknown Error');
        } else if (profileRes === 200 || profileRes === 201) {
            setHttpNotif('Profile Updated');
            setEditField(() => {
                return {firstname: false, lastname: false}
            });
        } else if (profileRes >= 400 || profileRes <= 403) {
            setHttpNotif('Unauthorized');
        } else {
            setHttpNotif('Internal Sever Error');
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

            { httpNotif ? (
                <div key={httpNotif} className={'dialog-http-notif-container ' + styles['http-notif-container']}>
                    <div className={httpNotif === 'Profile Updated' ? 'dialog-http-notif-message-success' : 'dialog-http-notif-message-failure'}>{httpNotif}</div>
                </div>
            ) : (<></>)}
            
            { profile ? (
            <form className={'dialog-form ' + styles['form']} onSubmit={handleSubmit(onSubmit)}>

    {/* fistname input group */}
                <div className={'dialog-input-group ' + styles['input-group']}>
    
                    {errors.firstname ? (
                        <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                        {errors.firstname.message}
                    </p>
                    )  : <></>}

                    <p className={'dialog-input-label ' + styles['input-label']}>Firstname:</p>
                    <input {...register('firstname', {value: profile?.firstname})} className={'dialog-text-input ' + styles['text-input']} disabled={isSubmitting || !editField.firstname} placeholder="Firstname" autoFocus/>
                    <button className={styles['input-state-button']} onClick={(e) => {e.preventDefault();setEditField((prev) => ({...prev, firstname:!prev.firstname}));setFocus('firstname')}}>
                        {editField.firstname ? <NotEditIcon onClick={(e) => {e.preventDefault;setValue('firstname', profile.firstname)}}/> : <EditIcon/>}
                    </button>
                    
                </div>

    {/* lastname input group */}                
                <div className={'dialog-input-group ' + styles['input-group']}>
    
                    {errors.lastname ? (
                        <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                        {errors.lastname.message}
                    </p>
                    )  : <></>}

                    <p className={'dialog-input-label ' + styles['input-label']}>Lastname:</p>
                    <input {...register('lastname', {value: profile?.lastname || ''})} className={'dialog-text-input ' + styles['text-input']} disabled={isSubmitting || !editField.lastname} placeholder="Lastname" />
                    <button className={styles['input-state-button']} onClick={(e) => {e.preventDefault();setEditField((prev) => ({...prev, lastname: !editField.lastname}));setFocus('lastname')}}>
                        {editField.lastname ? <NotEditIcon onClick={(e) => {e.preventDefault;setValue('lastname', profile.lastname)}}/> : <EditIcon/>}
                    </button>
                        
                </div>
                {(editField.firstname || editField.lastname) && (
                    <button type='submit' className={styles['save-button']} ><SaveIcon className={styles['save-icon']}/> <span>Save </span></button>
                )}
                
                <div className={'dialog-input-group ' + styles['prompt-group'] + ' ' + styles['input-group']}>
    
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

            {currentSubDialog && <ActiveModalRenderer activeDialog={currentSubDialog} setActiveDialog={setCurrentSubDialog} dialogProps={{setParentNotif: setHttpNotif}}/>}
        </div>
    )
}

export default SettingsDialog;