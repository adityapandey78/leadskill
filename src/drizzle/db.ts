import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Create a global pool instance for serverless functions
const globalForDB = globalThis as unknown as {
  pool: Pool | undefined;
};

export const pool = globalForDB.pool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

if (process.env.NODE_ENV !== 'production') globalForDB.pool = pool;

export const db = drizzle(pool, { schema });
