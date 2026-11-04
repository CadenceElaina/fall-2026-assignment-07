import { Generated, Insertable, Selectable } from 'kysely';

export type ArticleTable = {
  articleId: Generated<number>;
  title: string;
  contents: string;
  userId: number;
};

export type UserTable = {
  userId: Generated<number>;
  username: string;
  password: string;
};

export type Article = Selectable<ArticleTable>;
export type NewArticle = Insertable<ArticleTable>;

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;

export type Database = { article: ArticleTable; user: UserTable };
