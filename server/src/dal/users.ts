import { db } from '../db/db.js';
import { NewUser, User } from '../db/types.js';

export async function getUserById(userId: number): Promise<User | null> {
  const user = await db
    .selectFrom('user')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirst();
  if (!user) return null;
  return user;
}

export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  const user = await db
    .selectFrom('user')
    .selectAll()
    .where('username', '=', username)
    .executeTakeFirst();
  if (!user) return null;
  return user;
}

export async function createUser(newUser: NewUser): Promise<User> {
  const createdUser = await db
    .insertInto('user')
    .values(newUser)
    .returningAll()
    .executeTakeFirstOrThrow();
  return createdUser;
}
