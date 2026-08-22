import { useState, type CSSProperties } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@hooks';
import { schema, type FormData } from './signup.data';
import styles from './SignupDialog.v2.module.css';
import signupLogo from '@assets/signin-logo.png';

interface Props {
    onClose: () => void;
    changeDialog: () => void;
}

function SignupDialog ({onClose, changeDialog}: Props) {
    const [ , , , , signup, checkUsername] = useAuthContext();
    const [ httpNotif, setHttpNotif ] = useState<string | null>();
    const {
        register, handleSubmit, trigger, setFocus, getValues, formState: {errors, isSubmitting, touchedFields}
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onTouched'
    });
    const [ usernameAvailability, setUsernameAvailability ] = useState<null | "Username Not Availabe">(null);
    () => {onClose()}

    /** Submit handler for signup form */
    const onSubmit = async (data: FormData) => {
        if (usernameAvailability) {
            setFocus('username');
            return;
        };
        setHttpNotif(null);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const resSignup = await signup(data);

        if (resSignup === 200 || resSignup === 201) {
            setHttpNotif('Account Created Successfully');
            await new Promise(resolve => setTimeout(resolve, 2000));
            changeDialog();
        } else if (typeof resSignup !== 'number') {
            if (resSignup.statusCode === 409) {
                setHttpNotif('Username already taken');
                setFocus('username');
            } else {
                setHttpNotif('Intenal Server Error. Please try again later.')
            }
        } else {
            setHttpNotif('Intenal Server Error. Please try again later.')
        }
    }

    const borderColorOnError = (field: keyof FormData) => {
        if (errors[field]) {
            return {'outline': '2px solid var(--input-error-border-color)'} as CSSProperties;
        }
        return {'outline': '2px solid transparent'} as CSSProperties;
    }

    const triggerPasswordValidation = async () => {
        if (touchedFields.confirmPassword) await trigger('confirmPassword');
        return;
    }

    const usernameAvailabilityCheck = async (username: string) => {
        if (errors.username) return;
        const resCheckUsername = await checkUsername(username);
        if (resCheckUsername === 200) {
            setUsernameAvailability(null);
        } else if (resCheckUsername === 409) {
            setUsernameAvailability('Username Not Availabe');
        } else {
            setUsernameAvailability(null);
        }
    }

    const {onChange: rhfOnChangePassword, ...restPassword } = register('password');
    const {onChange: rhfOnChangeUsername, ...restUsername } = register('username');

    return (
        <div className={'dialog-root ' + styles["signup-root"] + (isSubmitting ? " " + styles['disabled'] : "" )}>

{/* Header, subheader and logo     */}
            <div className={'dialog-logo-container ' + styles['logo-container']}>
                <img className={'dialog-logo ' + styles['signup-logo']} src={signupLogo} alt='login-logo' />
                <p className={'dialog-header ' + styles['signup-header']}>
                    Create Account
                </p>
            </div>

            { !httpNotif ? (
                <div className={'dialog-http-notif-container ' + styles['http-notif-container']}>
                    <div className={httpNotif === 'Account Created Successfully' ? 'dialog-http-notif-message-success' : 'dialog-http-notif-message-failure'}>{"Failure Message"}</div>
                </div>
            ) : (<></>)}

            
{/* Form starts from here */}
            <form className={'dialog-form ' + styles['form']} onSubmit={handleSubmit(onSubmit)}>

    {/* Firstname input group */}
                <div className={'dialog-input-group ' + styles['input-group']}>

                    <div className={`dialog-input-label-error ${styles['login-input-label-error']}`} >

                        <p className={'dialog-input-label ' + styles['input-label']}>Name</p>

                        {errors.firstname ? (
                            <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                            {errors.firstname.message}
                        </p>
                        )  : <></>}

                    </div>

                    <div className={styles['multiple-text-input-container']} style={borderColorOnError('firstname')}>
                        
                        <input {...register('firstname')} className={`dialog-text-input ${styles['text-input']} ${styles['text-input-top']}`} disabled={isSubmitting} placeholder="Firstname" autoFocus/>
                        
                        <input {...register('lastname')} className={`dialog-text-input ${styles['text-input']} ${styles['text-input-bottom']}`} disabled={isSubmitting} placeholder="Lastname" />
                    </div>
                </div>

    {/* Username input group */}
                <div className={'dialog-input-group ' + styles['input-group']}>

                    <div className={`dialog-input-label-error ${styles['login-input-label-error']}`} >

                        <p className={'dialog-input-label ' + styles['input-label']}>Username</p>

                        {errors.username ? (
                            <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                                {errors.username.message}
                            </p>
                        )  : usernameAvailability ? (
                            <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                                {usernameAvailability}
                            </p>
                        ): <></>}

                    </div>

                    <input {...restUsername} onChange={(e) => {
                        rhfOnChangeUsername(e);
                        usernameAvailabilityCheck(getValues('username'));
                    }} className={'dialog-text-input ' + styles['text-input']} style={borderColorOnError('username')} disabled={isSubmitting} placeholder='Desired Username' />

                </div>

    {/* Goto Login Dialog */}
                <div className={styles['goto-login-container']}>
                    <p className={styles['goto-login-label']}>Already have account? <span className={styles['goto-login-link']} onClick={changeDialog}>Log In</span></p>
                </div>

    {/* Password input group */}
                <div className={'dialog-input-group ' + styles['input-group']}>

                    <div className={`dialog-input-label-error ${styles['login-input-label-error']}`} >

                        <p className={`dialog-input-label ${styles['input-label']}`}>Password</p>

                        {errors.password ? (
                            <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                            {errors.password.message}
                        </p>
                        )  : errors.confirmPassword ? (
                            <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                            {errors.confirmPassword.message}
                        </p>
                        )  : <></>}

                    </div>

                    <div className={styles['multiple-text-input-container']} style={borderColorOnError('password')}>
                        
                        <input {...restPassword} onChange={async (e) => {
                            rhfOnChangePassword(e);
                            await triggerPasswordValidation();
                        }} className={`dialog-text-input ${styles['text-input']} ${styles['text-input-top']}`} type='password' disabled={isSubmitting} placeholder='Enter Password'/>
                        
                        <input {...register('confirmPassword')} className={`dialog-text-input ${styles['text-input']} ${styles['text-input-bottom']}`} placeholder='Confirm Above Password' disabled={isSubmitting}/>
                    </div>
                </div>
                <button className={'dialog-submit-button ' + styles['signup-button']} type='submit' disabled={isSubmitting}>
                    {isSubmitting ? (<span className={"dialog-submit-loader " + styles['submit-loader']}></span>) : <span>Create Account</span>}
                </button>
            </form>
        </div>
    )
}

export default SignupDialog;