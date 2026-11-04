import { db } from './db.js';
import { FileMigrationProvider, Migrator } from 'kysely/migration';
import path from 'node:path';
import fs from 'node:fs/promises';

export async function migrateToLatest() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(import.meta.dirname, 'migrations'),
    }),
  });
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }
}

// Only auto-run when this file is executed directly (npm run migrate)
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  await migrateToLatest();
  await db.destroy();
}
