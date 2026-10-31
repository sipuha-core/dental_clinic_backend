import express from 'express'
import patientRoutes from './routes/patient.js'
import userRoutes from './routes/user.js'
import visitRouter from './routes/visit.js'
import serviceRouter from './routes/service.js'
import paymentRouter from './routes/payment.js'
import visit_serviceRouter from './routes/visit_service.js'
import authRoutes from './routes/auth.js'
import { authMiddleware } from './middleware/auth.js'
import * as helmet from 'helmet'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(helmet.default())
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)

app.use('/api/patients', authMiddleware, patientRoutes)
app.use('/api/users', authMiddleware, userRoutes)
app.use('/api/visits', authMiddleware, visitRouter)
app.use('/api/services', authMiddleware, serviceRouter)
app.use('/api/payments', authMiddleware, paymentRouter)
app.use('/api/visit_service', authMiddleware, visit_serviceRouter)

app.use(errorHandler)
app.use((_req, res) => res.status(404).json({ message: 'Не найдено' }))
export default app