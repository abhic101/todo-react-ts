import { z } from 'zod';
import { type RefObject } from 'react';

const schema = z.object({
    username: z.string().toLowerCase()
        .min(1, 'Please provide username')
        .min(3, 'Username too short')
        .max(64, 'Username too long'),
    password: z.string()
        .min(1, 'Please provide password')
        .max(128, 'Password too long')
});

type FormData = z.infer<typeof schema>;

const initialFormData: FormData = {
    username: '',
    password: ''
}

interface InputRef {
    username: RefObject<HTMLInputElement> | RefObject<null>;
    password: RefObject<HTMLInputElement> | RefObject<null>;
}

const httpErrorMessage = {
    username: 'User Not Found',
    password: 'Incorrect Password'
}

export {
    schema,
    initialFormData,
    httpErrorMessage,
    type FormData,
    type InputRef
}