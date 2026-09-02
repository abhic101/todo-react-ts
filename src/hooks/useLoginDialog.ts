import { useState, useRef } from 'react';
import type { FocusEvent, ChangeEvent, SubmitEvent, CSSProperties } from 'react';
import { ZodError } from 'zod';
import { useAuthContext, type InvalidFieldToComponent } from '@hooks';
import { LoginData } from '../components/index.componentTypes';

type FormData = LoginData.FormData;
type InputRef = LoginData.InputRef;
const { schema, initialFormData, httpErrorMessage } = LoginData;

/**
 * Specific login Dialog logic for FormData management, submission and error display
 * May contain some utility functions
 */
function useLoginDialog(onClose: () => void, inputRef: InputRef) {
    const [ formData, setFormData ] = useState<FormData>(initialFormData);
    const [ invalidatedFields, setInvalidatedFields ] = useState(new Map<keyof FormData, string>);
    const {login}  = useAuthContext();
    const [ httpError, setHttpError ] = useState<string | null>(null);
    const [ toggleError, setToggleError ] = useState<string>('open');
    let touchedFields = useRef(new Map<keyof FormData, boolean>());

    /**
     * Validate form field values using zod schema 'schema'
     * @param field Form field to validate
     */
    function validateFormData(field: keyof FormData, val: string) {
        try {
            schema.shape[field].parse(val);
            setInvalidatedFields((prev) => {
                const invalidated = new Map(prev);
                invalidated.delete(field);
                return invalidated;
            });
            return true;
        } catch(err: any) {
            if (err instanceof ZodError) {
                // for (let issue of err.issues) {
                //     if (issue.path[0] === field) {
                //         invalidated.set(issue.path[0], issue.message);
                //     }
                // }
                setInvalidatedFields((prev) => {
                    const invalidated = new Map(prev);
                    invalidated.set(field, err.issues[0].message);
                    return invalidated;
                });
            }
            return false;
        }
    }

     /**
     * Validate form fields on blur. Only works when element is touched for first time
     * @param field Form field to validate
     */
    function handleOnBlur(e: FocusEvent<HTMLInputElement, Element>, field: keyof FormData) {
        e.preventDefault();

        // If the field is touched, its alredy being validated by handleOnChange()
        if (touchedFields.current.has(field)) return;
        if (e.target.value === '') return;
        else {
            touchedFields.current.set(field, true);
        }

        // Setting value (should be done by handleOnChange())
        // const val = e.target?.value;
        // if (!val) return;
        // setFormData((prev) => ({...prev, [field]: val}))

        // Validate
        validateFormData(field, e.target.value);
    }

    /**
     * Update/validate form fields on blur. Works after element is touched for first time
     * @param field Form field to validate
     */
    function handleOnChange(e: ChangeEvent<HTMLInputElement, Element>, field: keyof FormData) {
        e.preventDefault();

        // Update value
        const val = e.target.value;
        setFormData((prev) => ({...prev, [field]: val}));
        
        // If the element is not touched, then handleOnBlur will do validate
        if (!touchedFields.current.has(field)) return;

        // Validate
        validateFormData(field, val);
    }

    /** Submits the form data to the login hook and display UI for http failures */
    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        // Validating once more (for edge cases)
        validateFormData('password', formData.password);
        validateFormData('username', formData.username);
        touchedFields.current.set('password', true);
        touchedFields.current.set('username', true);
        
        if (!schema.safeParse(formData).success) {
            reanimateError();
            setHttpError(null);
            setFocusedInput();
            return;
        }

        // Making request
        const success: InvalidFieldToComponent | number = await login(formData.username, formData.password);
        
        // Handling http error
        if (success === 201) {
            setHttpError("Login Success");
            reanimateError();
            setTimeout(onClose, 1000);
            return;
        } else if (success === 1000) {
            setHttpError("Internal Server Error. Please try again later");
        } else if (typeof success !== 'number'){
            switch (success.statusCode) {
                case 401:
                    setHttpError(httpErrorMessage[success.field as keyof typeof httpErrorMessage] as string)
                    const invalidated = new Map(invalidatedFields);
                    invalidated.set(success.field as keyof FormData, '')
                    setInvalidatedFields(invalidated);
                    break;
                default: 
                    setHttpError("Internal Server Error. Please try again later");
            }
        }
        reanimateError();
        setFocusedInput();
    }

    // Utils
    function setFocusedInput() {
        setInvalidatedFields((prev) => {
            if (prev.has('username')) inputRef.username.current?.focus();
            else if (prev.has('password')) inputRef.password.current?.focus();
            return prev;
        })
    }

    function reanimateError() {
        if (toggleError === 'open') setToggleError('close');
        else setToggleError('open');
    }

    function conditionalBorder(field: keyof FormData) {
        if (invalidatedFields.has(field)) {
            return { '--input-border-color': 'rgb(255, 88, 88)' } as CSSProperties
        }
        return { '--input-border-color': 'transparent' } as CSSProperties
    }

    return [ formData, invalidatedFields, httpError, toggleError, handleOnBlur, handleOnChange, handleSubmit, conditionalBorder ] as const;
}

export default useLoginDialog;