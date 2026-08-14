import { z } from 'zod';

const addTaskSchema = z.object({
    task_name: z.string().trim()
        .min(1, 'Please give task name')
        .max(128, 'Task Name cannot exceed 128 characters'),
    task_details: z.string().trim()
        .max(65536)
        .optional()
});

type FormData = z.infer<typeof addTaskSchema>;

export {
    addTaskSchema,
    type FormData
}