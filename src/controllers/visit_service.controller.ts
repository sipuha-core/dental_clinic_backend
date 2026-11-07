import type { Request, Response } from 'express';
import pool from '../db.js';
import { createVisitServiceSchema, updateVisitServiceSchema } from '../schemas/visit_service.schema.js';

export async function createVisitService(req: Request, res: Response) {
    const validation = createVisitServiceSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ errors: validation.error.message });

    const { visit_id, service_id, quantity, price_at_time } = validation.data;
    const { rows } = await pool.query(
        `insert into visit_service (visit_id, service_id, quantity, price_at_time)
         values ($1,$2,$3,$4)
         returning *`,
        [visit_id, service_id, quantity, price_at_time]
    );
    res.status(201).json(rows[0]);
}

export async function getVisitServices(_req: Request, res: Response) {
    const { rows } = await pool.query(`select * from visit_service`);
    res.json(rows);
}

export async function getVisitServiceById(req: Request, res: Response) {
    const { rows } = await pool.query(`select * from visit_service where id = $1`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Не найден' });
    res.json(rows[0]);
}

export async function deleteVisitService(req: Request, res: Response) {
    const { rowCount } = await pool.query(`delete from visit_service where id = $1`, [req.params.id]);
    if (!rowCount) return res.status(404).json({ message: 'Не найден' });
    res.json({ message: 'Удалено' });
}

export async function updateVisitService(req: Request, res: Response) {
    const validation = updateVisitServiceSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ errors: validation.error.message });

    const { visit_id, service_id, quantity, price_at_time } = validation.data;
    const { rows } = await pool.query(
        `update visit_service set
            visit_id = coalesce($1, visit_id),
            service_id = coalesce($2, service_id),
            quantity = coalesce($3, quantity),
            price_at_time = coalesce($4, price_at_time)
            updated_at = now()
         where id = $5
         returning *`,
        [visit_id, service_id, quantity, price_at_time, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Не найден' });
    res.json(rows[0]);
}

export async function getVisitServicesByVisit(req: Request, res: Response) {
    const { rows } = await pool.query(
        `select * from visit_service where visit_id = $1`,
        [req.params.id]
    );
    res.json(rows);
}