require('dotenv').config();
const { Pool } = require('pg');

// Reads connection info from DATABASE_URL if set, otherwise falls back to
// individual PG* env vars / defaults (matches node-postgres conventions).
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT || 5432,
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'taskmanager',
      }
);

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      due_date TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  // Safe to run on every startup: adds the column for anyone upgrading a
  // database created before due_date existed. No-op if it's already there.
  await pool.query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;`);
}

module.exports = { pool, initDb };