import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: { id: string; role: string }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Токен не предоставлен' })
    }

    try {
        const secret = process.env.JWT_SECRET || 'your_default_secret_change_in_production'
        const decoded = jwt.verify(token, secret) as { id: string; role: string }
        req.user = decoded
        next()
    } catch {
        return res.status(401).json({ error: 'Невалидный токен' })
    }
}