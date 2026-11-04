/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user')
    .addColumn('userId', 'serial', (col) => col.primaryKey())
    .addColumn('username', 'varchar(255)', (col) => col.notNull())
    .addColumn('password', 'varchar(255)', (col) => col.notNull())
    .addUniqueConstraint('unique_username', ['username'])
    .execute();
  await db.schema
    .alterTable('article')
    .addColumn('userId', 'integer', (col) =>
      col.references('user.userId').notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('article').dropColumn('userId').execute();
  await db.schema.dropTable('user').execute();
}
