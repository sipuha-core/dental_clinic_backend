import { z } from 'zod';

export const visitStatusSchema = z.enum(['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show']);

const dateTimeString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Некорректный формат даты/времени',
});

const visitBaseSchema = z.object({
    patient_id: z.string().min(1, 'Выберите пациента'),
    doctor_id: z.string().min(1, 'Выберите врача').nullable(),
    start_time: dateTimeString,
    end_time: dateTimeString,
    status: visitStatusSchema,
});

const hasValidDateOrder = (value: { start_time?: string | undefined; end_time?: string | undefined }) =>
    value.start_time && value.end_time ? new Date(value.start_time) <= new Date(value.end_time) : true;

export const visitSchema = z
    .object({
        id: z.string().uuid(),
        ...visitBaseSchema.shape,
        created_at: z.string(),
        updated_at: z.string(),
    })
    .refine(hasValidDateOrder, {
        message: 'end_time должен быть позже или равен start_time',
        path: ['end_time'],
    });

export const createVisitSchema = visitBaseSchema.refine(hasValidDateOrder, {
    message: 'end_time должен быть позже или равен start_time',
    path: ['end_time'],
});

export const updateVisitSchema = visitBaseSchema.partial().refine(hasValidDateOrder, {
    message: 'end_time должен быть позже или равен start_time',
    path: ['end_time'],
});
