import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './types.js';

function createDatabase(): Kysely<Database> {
  const url =
    process.env.DB_CONNECTION_STRING ||
    'postgres://postgres:postgres@localhost:5432/module06demo';
  const pool = new Pool({ connectionString: url });
  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
  });
}

export const db = createDatabase();
