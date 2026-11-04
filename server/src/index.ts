import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  getAllArticles,
  getSingleArticle,
  createArticle,
} from './dal/articles.js';
import { Article, NewUser } from './db/types.js';
import { createUser, getUserById, getUserByUsername } from './dal/users.js';
import { migrateToLatest } from './db/migrator.js';

export const app = express();

const SECRET = process.env.JWT_SECRET || 'thisisasecret';

app.use(express.json());

app.get('/health', function (_, res) {
  res.json({ status: 'ok' });
});

app.use('/articles', async function (req, res, next) {
  try {
    const authHeader = req.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.sendStatus(401);
    }
    // Bearer <jwt>
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, SECRET);
    res.locals.userId = payload.sub;
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
});

app.get('/articles', async function (req, res) {
  const titleContains = req.query.title_contains;
  const articles = await getAllArticles(res.locals.userId, {
    titleContains: titleContains ? '' + titleContains : undefined,
  });
  return res.json(articles);
});

app.get('/articles/:articleId', async function (req, res) {
  const { articleId } = req.params;
  const articleIdNum = +articleId;
  if (Number.isNaN(articleIdNum)) {
    return res.status(400).json({ error: 'articleId must be a number' });
  }
  const article = await getSingleArticle(articleIdNum);
  if (!article) {
    return res.status(404).json({ error: 'article not found' });
  }
  if (article.userId !== res.locals.userId) {
    return res.sendStatus(403);
  }
  return res.json(article);
});

app.post('/articles', async function (req, res) {
  const article = req.body as Partial<Omit<Article, 'articleId'>>;
  if (!article.contents || !article.title) {
    return res.sendStatus(400);
  }
  const { contents, title } = article;
  const newArticle = await createArticle({
    title,
    contents,
    userId: res.locals.userId,
  });
  res.status(201).json(newArticle);
});

app.post('/signup', async function (req, res) {
  const { username, password } = req.body as NewUser;
  if (
    !username ||
    !password ||
    username.length > 255 ||
    password.length > 255
  ) {
    return res.sendStatus(400);
  }
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ error: 'username already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const createdUser = await createUser({ username, password: hashedPassword });
  return res.json({
    userId: createdUser.userId,
    username: createdUser.username,
  });
});

app.post('/login', async function (req, res) {
  const { username, password } = req.body as NewUser;
  if (
    !username ||
    !password ||
    username.length > 255 ||
    password.length > 255
  ) {
    return res.sendStatus(401);
  }
  const existingUser = await getUserByUsername(username);
  if (!existingUser) {
    return res.sendStatus(401);
  }
  const doesMatch = await bcrypt.compare(password, existingUser.password);
  if (!doesMatch) return res.sendStatus(401);
  const token = jwt.sign({ sub: existingUser.userId }, SECRET, {
    expiresIn: '24h',
    algorithm: 'HS256',
  });
  return res.json({ jwt: token });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  },
);

if (process.env.NODE_ENV !== 'test') {
  await migrateToLatest();
  app.listen(8080, () => console.log('Service started on 8080'));
}
