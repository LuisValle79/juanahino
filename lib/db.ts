import { Pool } from 'pg'

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
}