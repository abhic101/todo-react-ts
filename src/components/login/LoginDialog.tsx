import { useRef, type AnimationEvent } from 'react';
import type { ModalData } from '../index.componentTypes'; 
import { useLoginDialog } from '@hooks';
import styles from './LoginDialog.module.css';
import loginLogo from '@assets/fingerprint.png'

type AvailableDialogs = ModalData.AvailableDialogs;

interface Props {
    onClose: () => void;
    changeDialog: (dialog: AvailableDialogs) => void;
}

function LoginDialog({onClose, changeDialog}: Props) {
    const usernameInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const [ formData, invalidatedFields, httpError, toggleError, handleOnBlur, handleOnChange, handleSubmit, conditionalBorder] = useLoginDialog(onClose, {username: usernameInputRef, password: passwordInputRef});

    function handleAnimationEnd(e: AnimationEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    return (
        <div className={styles["login-main"]} onAnimationEnd={handleAnimationEnd}>
            <div className={styles['close-button-container']}><button onClick={onClose} tabIndex={-1}>x</button></div>
            
{/* Header, subheader and logo section */}
            <div className={styles["login-logo-container"]}>
                <img className={styles['login-logo']} src={loginLogo} alt='login-logo' />
                <p className={styles["login-header"]}>Welcome</p>
            </div>
            <p className={styles["login-subheader"]}>Log in to Access Your Tasks</p>

{/*Server notifications are rendered here*/}
            {httpError ? (
                <div key={toggleError} className={styles['http-notif-container']}>
                    <p className={styles[(httpError === 'Login Success' ? 'http-notif-message-success' : 'http-notif-message-failure')]}>{httpError}</p>
                </div>
            ) : <></> }

{/* Form starts here */}
            <form className={styles["login-form"]} onSubmit={handleSubmit}>

    {/* Username input group: label, input field and error message */}
                <div className={styles["login-from-input-group"]}>

                    {invalidatedFields.has('username') ? (
                        <p key={toggleError} className={styles['input-error-message']}>
                        {invalidatedFields.get('username')}
                    </p>
                    )  : <></>}

                    <p className={styles["login-form-input-label"]}>Username</p>
                    
                    <input ref={usernameInputRef} className={styles["login-form-input"]} value={formData.username} style={conditionalBorder('username')} placeholder='Enter your username' onChange={(e) => {handleOnChange(e, 'username')}} onBlur={(e) => {handleOnBlur(e, 'username')}} autoFocus />
                </div>

    {/* Password input group: label, input field and error message */}
                <div className={styles["login-from-input-group"]}>

                    {invalidatedFields.has('password') ? (
                        <p key={toggleError} className={styles['input-error-message']}>
                        {invalidatedFields.get('password')}
                    </p>
                    )  : <></>}

                    <p className={styles["login-form-input-label"]}>Password</p>

                    <input type="password" ref={passwordInputRef} className={styles["login-form-input"]} style={conditionalBorder('password')} placeholder='Enter password' value={formData.password} onChange={(e) => {handleOnChange(e, 'password')}} onBlur={(e) => {handleOnBlur(e, 'password')}} />
                </div>
    {/* Register now label here */}
                <div className={styles['register-now-container']}>
                    <p className={styles['register-now-label']}>
                        New User ? &nbsp;
                        <a className={styles['register-now']} onClick={(e) => {e.preventDefault();changeDialog('signup')}}>
                            Register Now
                        </a>
                    </p>
                </div>
    {/* Reset password should go here */}

    {/* Submit button */}
                <button className={styles["login-submit-button"]} type="submit">SIGN IN</button>
            </form>
        </div>
    )
}


export default LoginDialog;