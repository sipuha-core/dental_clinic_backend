import { z } from 'zod';

const requiredName = z.string().trim().min(1, 'Поле обязательно');

export const patientSchema = z.object({
    id: z.string().uuid(),
    first_name: requiredName,
    last_name: requiredName,
    phone: z.string().trim()
        .regex(/^\+?[0-9]{10,15}$/, 'Некорректный формат телефона')
        .nullable()
        .or(z.literal(''))
        .transform(v => v === '' ? null : v),
    birth_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ожидается дд.мм.гггг')
        .refine(val => !isNaN(Date.parse(val)), 'Невалидная дата')
        .nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const createPatientSchema = patientSchema.pick({
    first_name: true,
    last_name: true,
    phone: true,
    birth_date: true,
});

export const updatePatientSchema = createPatientSchema.partial();
