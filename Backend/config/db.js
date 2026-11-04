// import { PGlite } from '@electric-sql/pglite';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const DATA_DIR = path.resolve(__dirname, '../../data/pgdata');

// let pgliteInstance = null;

// export async function getDb() {
//   if (!pgliteInstance) {
//     if (!fs.existsSync(DATA_DIR)) {
//       fs.mkdirSync(DATA_DIR, { recursive: true });
//     }
//     pgliteInstance = new PGlite(DATA_DIR);
//     await initSchemaAndSeeds(pgliteInstance);
//   }
//   return pgliteInstance;
// }

// export async function query(sqlText, params = []) {
//   const db = await getDb();
//   const res = await db.query(sqlText, params);
//   return {
//     rows: res.rows || [],
//     rowCount: res.affectedRows || (res.rows ? res.rows.length : 0),
//     fields: res.fields || [],
//   };
// }

// async function initSchemaAndSeeds(db) {
//   try {
//     const schemaPath = path.resolve(__dirname, '../db/schema.sql');
//     const seedsPath = path.resolve(__dirname, '../db/seeds.sql');

//     if (fs.existsSync(schemaPath)) {
//       const schemaSql = fs.readFileSync(schemaPath, 'utf8');
//       await db.exec(schemaSql);
//       console.log('PostgreSQL schema applied successfully.');
//     }

//     // Check if products exist before running seeds
//     const checkRes = await db.query('SELECT COUNT(*) as count FROM products');
//     const count = parseInt(checkRes.rows[0]?.count || 0, 10);

//     if (count === 0 && fs.existsSync(seedsPath)) {
//       const seedsSql = fs.readFileSync(seedsPath, 'utf8');
//       await db.exec(seedsSql);
//       console.log('PostgreSQL initial seed data inserted successfully.');
//     }
//   } catch (err) {
//     console.error('Error initializing database schema/seeds:', err);
//   }
// }




import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool, types } = pg;

// pg returns BIGINT / NUMERIC as strings by default - convert to numbers
types.setTypeParser(20, (v) => parseInt(v, 10));    // BIGINT / COUNT()
types.setTypeParser(1700, (v) => parseFloat(v));    // NUMERIC

export const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT) || 5432,
      }
);

export const query = (text, params) => pool.query(text, params);

/** Runs fn(client) inside BEGIN/COMMIT; rolls back on any error. */
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}