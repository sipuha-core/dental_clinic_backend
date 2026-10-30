import { z } from 'zod';

export const userRoleSchema = z.enum(['admin', 'doctor', 'assistant']);

export const userSchema = z.object({
    id: z.string().uuid(),
    first_name: z.string().trim().min(1, 'Имя обязательно'),
    last_name: z.string().trim().min(1, 'Фамилия обязательна'),
    email: z.string().email('Некорректный email'),
    phone: z.string().trim().min(1).nullable(),
    password_hash: z.string().min(1),
    role: userRoleSchema,
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const createUserSchema = z.object({
    first_name: userSchema.shape.first_name,
    last_name: userSchema.shape.last_name,
    email: userSchema.shape.email,
    phone: userSchema.shape.phone,
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
    role: userSchema.shape.role,
});

export const updateUserSchema = z
    .object({
        first_name: userSchema.shape.first_name,
        last_name: userSchema.shape.last_name,
        email: userSchema.shape.email,
        phone: userSchema.shape.phone,
        password: z.preprocess(
            item => (item === '' || item === null ? undefined : item),
            z.string().min(6, 'Минимум 6 символов').optional()
        ),
        role: userSchema.shape.role,
        is_active: userSchema.shape.is_active,
    })
    .partial();
