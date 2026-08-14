import { z } from 'zod';

const schema = z.object({
    username: z.string().trim()
        .min(3, 'Username too short')
        .max(64, 'Username too long')
        .regex(/^[a-zA-Z0-9]+$/, 'Only alphanumeric username allowed'),
    password: z.string()
        .min(8, "Password too short")
        .max(128, "Password too long")
        .regex(/[a-z]/, 'Add a lowercase alphabet')
        .regex(/[A-Z]/, 'Add an uppercase alphabet')
        .regex(/[0-9]/, 'Add a number')
        .regex(/[^a-zA-Z0-9]/, 'Add special character'),
    firstname: z.string().trim()
        .min(1, 'Please provide firstname')
        .min(2, 'Firstname too short')
        .max(64, 'Firstname too long'),
    lastname: z.string().trim()
        .max(64, 'Lastname too long')
        .optional(),
    confirmPassword: z.string()
}).refine((data) => !data.password || data.password === '' || data.password === data.confirmPassword, {
        message: `Passwords don't match`,
        path: ['confirmPassword']
});

type FormData = z.infer<typeof schema>

const httpErrorMessage = {
    username: 'Username Already Taken',
}

export {
    schema,
    httpErrorMessage,
    type FormData
}