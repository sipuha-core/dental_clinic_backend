import type { Request, Response } from 'express';
import pool from '../db.js';
import { createVisitSchema, updateVisitSchema } from '../schemas/visit.schema.js';

export async function createVisit(req: Request, res: Response) {
    const validation = createVisitSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ errors: validation.error.message });

    const { patient_id, doctor_id, start_time, end_time, status } = validation.data;
    const { rows } = await pool.query(
        `insert into visit (patient_id, doctor_id, start_time, end_time, status)
         values ($1,$2,$3,$4,$5)
         returning *`,
        [patient_id, doctor_id, start_time, end_time, status]
    );
    res.status(201).json(rows[0]);
};

const VISIT_QUERY = `
    SELECT 
        v.*, 
        p.first_name AS patient_first_name, 
        p.last_name AS patient_last_name, 
        u.first_name AS doctor_first_name, 
        u.last_name AS doctor_last_name 
    FROM visit v
    JOIN patient p ON v.patient_id = p.id
    LEFT JOIN "user" u ON v.doctor_id = u.id`;

export async function getVisits(_req: Request, res: Response) {
    const { rows } = await pool.query(`${VISIT_QUERY} ORDER BY v.start_time DESC`);
    res.json(rows);
};

export async function getVisitById(req: Request, res: Response) {
    const { rows } = await pool.query(`${VISIT_QUERY} WHERE v.id = $1`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Не найден' });
    res.json(rows[0]);
}

export async function deleteVisit(req: Request, res: Response) {
    const { rowCount } = await pool.query(`delete from visit where id = $1`, [req.params.id]);
    if (!rowCount) return res.status(404).json({ message: 'Не найден' });
    res.json({ message: 'Удалено' });
};

export async function updateVisit(req: Request, res: Response) {
    const validation = updateVisitSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ errors: validation.error.message });

    const { patient_id, doctor_id, start_time, end_time, status } = validation.data;
    const { rows } = await pool.query(
        `update visit set
            patient_id = coalesce($1, patient_id),
            doctor_id  = coalesce($2, doctor_id),
            start_time = coalesce($3, start_time),
            end_time   = coalesce($4, end_time),
            status     = coalesce($5, status),
            updated_at = now()
         where id = $6
         returning *`,
        [patient_id, doctor_id, start_time, end_time, status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Не найден' });
    res.json(rows[0]);
};
