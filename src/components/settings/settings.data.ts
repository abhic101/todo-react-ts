import { z } from 'zod';

const profileUpdateSchema = z.object({
    firstname: z.string().trim()
        .min(2, 'Firstname too short')
        .max(64, 'Firstname too long'),
    lastname: z.string().trim()
        .max(64, 'Lastname too long')
        .optional()
});

const passwordUpdateSchema = z.object({
    currentPassword: z.string()
        .min(1, 'Enter password')
        .max(128, 'Password too long'),
    newPassword: z.string()
        .min(8, "Password too short")
        .max(128, "Password too long")
        .regex(/[a-z]/, 'Add a lowercase alphabet')
        .regex(/[A-Z]/, 'Add an uppercase alphabet')
        .regex(/[0-9]/, 'Add a number')
        .regex(/[^a-zA-Z0-9]/, 'Add special character'),
    confirmNewPassword: z.string()
}).refine((data) => !data.newPassword || data.newPassword === '' || data.newPassword === data.confirmNewPassword, {
        message: `Passwords don't match`,
        path: ['confirmNewPassword']
});

const usernameUpdateSchema = z.object({
    newUsername: z.string().trim()
        .min(3, 'Username too short')
        .max(64, 'Username too long')
        .regex(/^[a-zA-Z0-9]+$/, 'Only alphanumeric username allowed'),
    password: z.string()
        .min(1, 'Please provide password')
        .max(128, 'Password too long')
});

type ProfileFormType = z.infer<typeof profileUpdateSchema>;
type PasswordFormType = z.infer<typeof passwordUpdateSchema>;
type UsernameFormType = z.infer<typeof usernameUpdateSchema>;

export {
    profileUpdateSchema,
    passwordUpdateSchema,
    usernameUpdateSchema
}

export type {
    ProfileFormType,
    PasswordFormType,
    UsernameFormType
}