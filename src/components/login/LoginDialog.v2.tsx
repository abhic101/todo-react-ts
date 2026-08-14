import { useState, type CSSProperties } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema, type FormData } from './login.data';
import { useAuthContext } from '@hooks';
import styles from './LoginDialog.v2.module.css';
import loginLogo from '@assets/fingerprint.png';


interface Props {
    onClose: () => void;
    changeDialog: () => void;
}

function LoginDialog({onClose, changeDialog}: Props) {
    const [httpNotif, setHttpNotif] = useState<string | null>(null); 
    const [ , , login] = useAuthContext();
    const {
        register, setFocus, handleSubmit, formState: { errors, isSubmitting }
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onTouched'
    });

    const onSubmit = async (data: FormData) => {
        setHttpNotif(null);
        await new Promise(resolve=>setTimeout(resolve, 1000));
        

        const resLogin = await login(data.username, data.password);
        if (resLogin === 201) {
            setHttpNotif('Login Success');
            await new Promise(resolve=>setTimeout(resolve, 500));
            onClose();
        } else if (typeof resLogin !== 'number') {
            if (resLogin.field === 'password') {
                setFocus('password');
                setHttpNotif('Incorrect Password');
            } else {
                setFocus('username');
                setHttpNotif('Incorrect Username');
            }
        } else {
            setHttpNotif('Internal Server Error. Please try again later');
        }
    }

    const borderColorOnError = (field: keyof FormData) => {
        if (errors[field]) {
            return {'border': '2px solid var(--input-error-border-color)'} as CSSProperties;
        }
        return {'border': '2px solid transparent'} as CSSProperties;
    }

    return (
        <div className={'dialog-root ' + styles["login-root"] + ' ' + (isSubmitting ? styles['disabled']: '')} >
            
{/* Header, subheader and logo section */}
            <div className={'dialog-logo-container ' + styles["login-logo-container"]}>
                <img className={'dialog-logo ' + styles['login-logo']} src={loginLogo} alt='login-logo' />
                <p className={'dialog-header ' + styles["login-header"]}>Welcome</p>
            </div>
            <p className={'dialog-subheader ' + styles["login-subheader"]}>Log in to Access Your Tasks</p>

{/*Server notifications are rendered here*/}
            {httpNotif ? (
                <div key={httpNotif} className={'dialog-http-notif-container ' + styles['http-notif-container']}>
                    <p className={styles[(httpNotif === 'Login Success' ? 'http-notif-message-success' : 'http-notif-message-failure')]}>{httpNotif}</p>
                </div>
            ) : <></> }

{/* Form starts here */}
            <form className={'dialog-form ' + styles["login-form"]} onSubmit={handleSubmit(onSubmit)}>

    {/* Username input group: label, input field and error message */}
                <div className={'dialog-input-group ' + styles["login-input-group"]}>

                    {errors.username? (
                        <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                        {errors.username.message}
                    </p>
                    )  : <></>}

                    <p className={'dialog-input-label ' + styles["login-input-label"]}>Username</p>
                    
                    <input {...register('username')} className={'dialog-text-input ' + styles["login-text-input"]} style={borderColorOnError('username')}  placeholder='Enter your username' disabled={isSubmitting} autoFocus />
                </div>

    {/* Password input group: label, input field and error message */}
                <div className={'dialog-input-group ' + styles["login-input-group"]}>

                    {errors.password ? (
                        <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                        {errors.password.message}
                    </p>
                    )  : <></>}

                    <p className={'dialog-input-label ' + styles["login-input-label"]}>Password</p>

                    <input type="password" {...register('password')} className={'dialog-text-input ' + styles["text-input"]} style={borderColorOnError('password')} placeholder='Enter your password' disabled={isSubmitting}/>
                </div>
    {/* Register now label here */}
                <div className={styles['register-now-container']}>
                    <p className={styles['register-now-label']}>
                        New User ? &nbsp;
                        <a className={styles['register-now']} onClick={(e) => {e.preventDefault();if(!isSubmitting) changeDialog();}}>
                            Register Now
                        </a>
                    </p>
                </div>
    {/* Reset password should go here */}

    {/* Submit button */}
                <button className={'dialog-submit-button ' + styles["login-submit-button"]} type="submit" disabled={isSubmitting}>{!isSubmitting ? (<span>SIGN IN</span>) : (
                <span className={'dialog-submit-loader ' + styles['submit-loader']} ></span>)}
                </button>
            </form>
        </div>
    )
}

export default LoginDialog;