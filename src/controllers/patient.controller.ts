import type { Request, Response } from 'express';
import pool from '../db.js';
import { createPatientSchema, updatePatientSchema } from '../schemas/patient.schema.js';

export async function createPatient(req: Request, res: Response) {
    const validation = createPatientSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.message });
    }

    const { first_name, last_name, phone, birth_date } = validation.data;
    const { rows } = await pool.query(
        `insert into patient (first_name, last_name, phone, birth_date)
         values ($1,$2,$3,$4)
         returning *`,
        [first_name, last_name, phone, birth_date]
    );

    res.status(201).json(rows[0]);
}

export async function getPatients(req: Request, res: Response) {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''

    if (!search) {
        const { rows } = await pool.query(
            `select * from patient order by created_at desc`
        )
        return res.json(rows)
    }

    const pattern = `%${search}%`
    const { rows } = await pool.query(
        `select * from patient
         where first_name ilike $1
            or last_name  ilike $1
            or phone      ilike $1
         order by created_at desc`,
        [pattern]
    )
    res.json(rows)
}

export async function getPatientById(req: Request, res: Response) {
    const { rows } = await pool.query(`select * from patient where id = $1`, [req.params.id]);

    if (!rows[0]) return res.status(404).json({ message: 'Не найден' });
    res.json(rows[0]);
}

export async function deletePatient(req: Request, res: Response) {
    const { rowCount } = await pool.query(`delete from patient where id = $1`, [req.params.id]);

    if (!rowCount) return res.status(404).json({ message: 'Не найден' });
    res.json({ message: 'Удалено' });
}

export async function updatePatient(req: Request, res: Response) {
    const validation = updatePatientSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.message });
    }

    const { first_name, last_name, phone, birth_date } = validation.data;
    const { rows } = await pool.query(
        `update patient
         set first_name = coalesce($1, first_name),
             last_name  = coalesce($2, last_name),
             phone      = coalesce($3, phone),
             birth_date = coalesce($4, birth_date),
             updated_at = now()
         where id = $5
         returning *`,
        [first_name, last_name, phone, birth_date, req.params.id]
    );

    if (!rows[0]) return res.status(404).json({ message: 'Не найден' });
    res.json(rows[0]);
}
