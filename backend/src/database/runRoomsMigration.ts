import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.resolve(__dirname, '../../../supabase/migrations/20260617120000_add_rooms_system.sql');

async function run() {
  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log('Running rooms system migration...');
  await pool.query(sql);
  console.log('✓ Migration complete');
  await pool.end();
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
