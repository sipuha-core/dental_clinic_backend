import { Pool, types } from 'pg'

types.setTypeParser(1082, (item) => item)

const pool = new Pool({
    connectionString: process.env.DATABASE_URL_DEV,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
})

pool.on('error', (err) => {
    console.error('PG POOL ERROR:', err)
})

export default pool