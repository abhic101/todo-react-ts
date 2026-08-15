// import { useState, useRef, type ChangeEvent, type FocusEvent, type SubmitEvent, type CSSProperties } from 'react';
// import { ZodError } from 'zod';
// import { useAuthContext, type InvalidFieldToComponent } from '@hooks';
// import {schema, type FormData, httpErrorMessage} from './signup.data'
// import styles from './SignupDialog.module.css';
// import signupLogo from '@assets/add-user-2.png'

// interface Props {
//     onClose: () => void;
// }

// const inputPriorityOrder = [
//     'firsname',
//     'lastname',
//     'username',
//     'password',
//     'confirmPassword'
// ]

// function SignupDialog({onClose}: Props) {
//     const [ formData, setFormData ] = useState<FormData>(initialFormData);
//     const [ invalidatedFields, setInvalidatedFields ] = useState(new Map<keyof FormData, string>);
//     const [ , , , , signup] = useAuthContext();
//     const [ httpError, setHttpError ] = useState<string | null>(null);
//     const [ toggleError, setToggleError ] = useState<string>('open');
//     let touchedFields = useRef(new Map<keyof FormData, boolean>());

//     const firstnameInputRef = useRef<HTMLInputElement | null>(null);
//     const lastnameInputRef = useRef<HTMLInputElement | null>(null);
//     const usernameInputRef = useRef<HTMLInputElement | null>(null);
//     const passwordInputRef = useRef<HTMLInputElement | null>(null);
//     const confirmPasswordInputRef = useRef<HTMLInputElement | null>(null);

//     const inputRef = {
//         firstname: firstnameInputRef,
//         lasname: lastnameInputRef,
//         username: usernameInputRef,
//         password: passwordInputRef,
//         confirmPassword: confirmPasswordInputRef
//     };

//     /**
//      * Validate form field values using zod schema 'schema'
//      * @param field Form field to validate
//      */
//     function validateFormData(field: keyof FormData, val: string) {
//         try {
//             const validated = schema.shape[field].parse(val);
//             if (field === 'confirmPassword') {
//                 if (val !== formData.password) {
//                     setInvalidatedFields((prev) => {
//                     const invalidated = new Map(prev);
//                     invalidated.set(field, 'Passwords do not match');
//                     return invalidated;
//                     });
//                     return false;
//                 }
//             }
//             setInvalidatedFields((prev) => {
//                 const invalidated = new Map(prev);
//                 invalidated.delete(field);
//                 return invalidated;
//             });
//             return true;
//         } catch(err: any) {
//             if (err instanceof ZodError) {
//                 // for (let issue of err.issues) {
//                 //     if (issue.path[0] === field) {
//                 //         invalidated.set(issue.path[0], issue.message);
//                 //     }
//                 // }
//                 setInvalidatedFields((prev) => {
//                     const invalidated = new Map(prev);
//                     invalidated.set(field, err.issues[0].message);
//                     return invalidated;
//                 });
//             }
//             return false;
//         }
//     }

//     /**
//      * Validate form fields on blur. Only works when element is touched for first time
//      * @param field Form field to validate
//      */
//     function handleOnBlur(e: FocusEvent<HTMLInputElement, Element>, field: keyof FormData) {
//         e.preventDefault();

//         // If the field is touched, its alredy being validated by handleOnChange()
//         if (touchedFields.current.has(field)) return;
//         if (e.target.value === '') return;
//         else {
//             touchedFields.current.set(field, true);
//         }

//         // Setting value (should be done by handleOnChange())
//         // const val = e.target?.value;
//         // if (!val) return;
//         // setFormData((prev) => ({...prev, [field]: val}))

//         // Validate
//         validateFormData(field, e.target.value);
//     }

//     /**
//      * Update/validate form fields on blur. Works after element is touched for first time
//      * @param field Form field to validate
//      */
//     function handleOnChange(e: ChangeEvent<HTMLInputElement, Element>, field: keyof FormData) {
//         e.preventDefault();

//         // Update value
//         const val = e.target.value;
//         setFormData((prev) => ({...prev, [field]: val}));
        
//         // If the element is not touched, then handleOnBlur will do validate
//         if (!touchedFields.current.has(field)) return;

//         // Validate
//         validateFormData(field, val);
//     }

//     /** Submits the form data to the login hook and display UI for http failures */
//     async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
//         e.preventDefault();

//         // Validating once more (for edge cases)
//         validateFormData('firstname', formData.firstname);
//         validateFormData('lastname', formData.lastname as string);
//         validateFormData('username', formData.username);
//         validateFormData('password', formData.password);
//         validateFormData('confirmPassword', formData.confirmPassword);
//         touchedFields.current.set('firstname', true);
//         touchedFields.current.set('lastname', true);
//         touchedFields.current.set('username', true);
//         touchedFields.current.set('password', true);
//         touchedFields.current.set('confirmPassword', true);
        
//         if (!schema.safeParse(formData).success) {
//             reanimateError();
//             setHttpError(null);
//             setFocusedInput();
//             return;
//         }

//         // Making request
//         const success: InvalidFieldToComponent | number = await signup(formData);
        
//         // Handling http error
//         if (success === 201) {
//             setHttpError("Login Success");
//             reanimateError();
//             setTimeout(onClose, 1000);
//             return;
//         } else if (success === 1000) {
//             setHttpError("Internal Server Error. Please try again later");
//         } else if (typeof success !== 'number'){
//             switch (success.statusCode) {
//                 case 401:
//                     setHttpError(httpErrorMessage[success.field as keyof typeof httpErrorMessage] as string)
//                     const invalidated = new Map(invalidatedFields);
//                     invalidated.set(success.field as keyof FormData, '')
//                     setInvalidatedFields(invalidated);
//                     break;
//                 default: 
//                     setHttpError("Internal Server Error. Please try again later");
//             }
//         }
//         reanimateError();
//         setFocusedInput();
//     }

//     function setFocusedInput() {
//         setInvalidatedFields((prev) => {
//             for (let field of inputPriorityOrder) {
//                 if (prev.has(field as keyof FormData))
//                     inputRef[field as keyof typeof inputRef].current?.focus();
//             }
//             return prev;
//         })
//     }

//     function reanimateError() {
//         if (toggleError === 'open') setToggleError('close');
//         else setToggleError('open');
//     }

//     function conditionalBorder(field: keyof FormData) {
//         if (invalidatedFields.has(field)) {
//             return { 'border': '1px solid rgb(255, 88, 88)' } as CSSProperties
//         }
//         return { 'border': '1px solid transparent' } as CSSProperties
//     }

//     return (
//         <div className={styles["signup-main"]}>
//             <div className={styles['close-button-container']}><button onClick={onClose} tabIndex={-1}>x</button></div>

//             {/* <div className={styles['side-banner-container']}>
//                 <img className={styles['side-banner']} src={signupSideBanner} alt='side-banner' />
//             </div> */}
//             {/* <div className={styles['form-container']}> */}

// {/* Header, subheader and logo     */}
//             <div className={styles['header-container']}>
//                 <img className={styles['logo']} src={signupLogo} alt='login-logo' />
//                 <p className={styles['header']}>
//                     Create Account
//                 </p>
//             </div>
//             {/* <p className={styles["subheader"]}>Create a New Account</p> */}

//             <form className={styles['signup-form']} onSubmit={(e) => handleSubmit(e)}>

// {/* Form starts from here */}
//                 <div className={styles['input-group']}>

//     {/* Firstname input group */}
//                     {invalidatedFields.has('firstname') ? (
//                         <p key={toggleError} className={styles['input-error-message']}>
//                         {invalidatedFields.get('firstname')}
//                     </p>
//                     )  : <></>}

//                     <p className={styles['input-label']}>Name</p>

//                     <div className={styles['double-input-container'] } style={conditionalBorder('firstname')}>
                        
//                         <input ref={firstnameInputRef} className={[styles['text-input'], styles['text-input-top']].join(' ')}  onBlur={(e) => handleOnBlur(e, 'firstname')} placeholder="Firstname" onChange={(e) => handleOnChange(e, 'firstname')}/>
                        
//                         <input ref={lastnameInputRef} className={[styles['text-input'], styles['text-input-bottom']].join(' ')}  onBlur={(e) => handleOnBlur(e, 'lastname')}placeholder="Lastname" onChange={(e) => handleOnChange(e, 'lastname')}/>
//                     </div>
//                 </div>

//     {/* Username input group */}
//                 <div className={styles['input-group']}>

//                     {invalidatedFields.has('username') ? (
//                         <p key={toggleError} className={styles['input-error-message']}>
//                         {invalidatedFields.get('username')}
//                     </p>
//                     )  : <></>}

//                     <p className={styles['input-label']}>Username</p>

//                     <input ref={usernameInputRef} className={styles['text-input']}  onBlur={(e) => handleOnBlur(e, 'username')} placeholder='Desired Username' style={conditionalBorder('username')} onChange={(e) => handleOnChange(e, 'username')}/>

//                 </div>

//     {/* Password input group */}
//                 <div className={styles['input-group']}>

//                     {}

//                     {invalidatedFields.has('password') ? (
//                         <p key={toggleError} className={styles['input-error-message']}>
//                         {invalidatedFields.get('password')}
//                     </p>
//                     )  : invalidatedFields.has('confirmPassword') ? (
//                         <p key={toggleError} className={styles['input-error-message']}>
//                         {invalidatedFields.get('confirmPassword')}
//                     </p>
//                     )  : <></>}

//                     <p className={styles['input-label']}>Password</p>

//                     <div className={styles['double-input-container']} style={conditionalBorder('password')}>
                        
//                         <input ref={passwordInputRef} className={[styles['text-input'], styles['text-input-top']].join(' ')} type='password'  onBlur={(e) => handleOnBlur(e, 'password')} placeholder='Enter Password' onChange={(e) => handleOnChange(e, 'password')}/>
                        
//                         <input ref={confirmPasswordInputRef} className={[styles['text-input'], styles['text-input-bottom']].join(' ')}  onBlur={(e) => handleOnBlur(e, 'confirmPassword')} placeholder='Confirm Above Password' onChange={(e) => handleOnChange(e, 'confirmPassword')}/>

//                     </div>
//                 </div>
//                 {/* <div className={styles['input-group']}>
//                     <p className={styles['input-label']}>Confirm Password</p>
//                     <input className={styles['text-input']}  onChange={(e) => handleBlur(e, 'confirmPassword')} placeholder='Confirm Above Password' />
//                 </div> */}
//                 <button className={styles['signup-button']} type='submit'>Create Account</button>
//             </form>
//             {/* </div> */}
//         </div>
//     )

// }

// export default SignupDialog;