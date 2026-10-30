import type { NextFunction, Request, Response } from 'express'

interface PgError extends Error {
    code?: string
    constraint?: string
    type?: string
    statusCode?: number
    status?: number
}

export function errorHandler(
    err: PgError,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    if (res.headersSent) {
        return _next(err)
    }

    if (err.code === '22P02') {
        return res.status(400).json({ message: 'Некорректный ID' })
    }

    if (err.code === '23503') {
        if (req.method === 'DELETE') {
            return res.status(409).json({ message: 'Нельзя удалить: есть связанные записи' })
        }
        let message = 'Связанная запись не найдена'
        switch (err.constraint) {
            case 'visit_patient_id_fkey':
                message = 'Пациент не найден'
                break
            case 'visit_doctor_id_fkey':
                message = 'Врач не найден'
                break
            case 'payment_visit_id_fkey':
            case 'visit_service_visit_id_fkey':
                message = 'Визит не найден'
                break
            case 'visit_service_service_id_fkey':
                message = 'Услуга не найдена'
                break
        }
        return res.status(400).json({ message })
    }

    if (err.code === '23505') {
        const message =
            err.constraint === 'service_code_key'
                ? 'Услуга с таким кодом уже существует'
                : 'Запись с такими данными уже существует'
        return res.status(409).json({ message })
    }

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Неверный формат JSON в теле запроса' })
    }

    const statusCode = err.statusCode || err.status
    if (statusCode && statusCode >= 400 && statusCode < 500) {
        return res.status(statusCode).json({ message: err.message || 'Неверный запрос' })
    }

    console.error('UNHANDLED ERROR:', err)
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
}