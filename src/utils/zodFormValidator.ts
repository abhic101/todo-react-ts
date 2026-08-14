import type { Dispatch, SetStateAction } from 'react';
import { SignupData, LoginData } from '../components/index.componentTypes.ts';

// Aliases for easy use
type FormData = SignupData.FormData | LoginData.FormData;
type FormDataKeyType = keyof SignupData.FormData | keyof LoginData.FormData;
type InvalidatedFieldSetter = Dispatch<SetStateAction<Map<keyof SignupData.FormData, string>>> | Dispatch<SetStateAction<Map<keyof LoginData.FormData, string>>>;

function validateOne(formData: FormData, field: FormDataKeyType, value: string): boolean {

    return true;
}