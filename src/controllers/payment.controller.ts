import type { Request, Response } from 'express';
import pool from '../db.js';
import { createPaymentSchema, updatePaymentSchema } from '../schemas/payment.schema.js';

export async function createPayment(req: Request, res: Response) {
    const validation = createPaymentSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ errors: validation.error.message });

    const { visit_id, amount, payment_method, status } = validation.data;
    const { rows } = await pool.query(
        `insert into payment (visit_id, amount, payment_method, status)
         values ($1,$2,$3,$4)
         returning *`,
        [visit_id, amount, payment_method, status]
    );
    res.status(201).json(rows[0]);
}

export async function getPayments(req: Request, res: Response) {
    const visitId = typeof req.query.visit_id === 'string' ? req.query.visit_id : null;
    if (visitId) {
        const { rows } = await pool.query(
            `select * from payment where visit_id = $1 order by created_at desc`,
            [visitId]
        );
        return res.json(rows);
    }
    const { rows } = await pool.query(`select * from payment order by created_at desc`);
    res.json(rows);
}

export async function getPaymentById(req: Request, res: Response) {
    const { rows } = await pool.query(`select * from payment where id = $1`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Не найден' });
    res.json(rows[0]);
}

export async function deletePayment(req: Request, res: Response) {
    const { rowCount } = await pool.query(`delete from payment where id = $1`, [req.params.id]);
    if (!rowCount) return res.status(404).json({ message: 'Не найден' });
    res.json({ message: 'Удалено' });
}

export async function updatePayment(req: Request, res: Response) {
    const validation = updatePaymentSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ errors: validation.error.message });

    const { visit_id, amount, payment_method, status } = validation.data;
    const { rows } = await pool.query(
        `update payment set
            visit_id = coalesce($1, visit_id),
            amount = coalesce($2, amount),
            payment_method = coalesce($3, payment_method),
            status = coalesce($4, status),
            updated_at = now()
         where id = $5
         returning *`,
        [visit_id, amount, payment_method, status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Не найден' });
    res.json(rows[0]);
}
