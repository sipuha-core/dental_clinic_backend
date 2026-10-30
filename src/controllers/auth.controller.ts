import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../db.js'
import type { Request, Response } from 'express'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function login(req: Request, res: Response) {
    const validation = loginSchema.safeParse(req.body)
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.message })
    }

    const { email, password } = validation.data

    const { rows } = await pool.query(
        `select id, password_hash, role, is_active from "user" where email = $1`,
        [email]
    )

    if (!rows[0]) {
        return res.status(401).json({ error: 'Неверный email или пароль' })
    }

    const user = rows[0]
    if (!user.is_active) {
        return res.status(403).json({ error: 'Пользователь деактивирован' })
    }

    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
        return res.status(401).json({ error: 'Неверный email или пароль' })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
        return res.status(500).json({ error: 'Конфигурация сервера нарушена: отсутствует JWT_SECRET' })
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        secret,
        { expiresIn: '2h' }
    )

    const { rows: userRows } = await pool.query(
        `select id, first_name, last_name, email, role from "user" where id = $1`,
        [user.id]
    )
    const userData = userRows[0]
    res.json({
        token,
        user: {
            id: userData.id,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            role: userData.role
        }
    })
}