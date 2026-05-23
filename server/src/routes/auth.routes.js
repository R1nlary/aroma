import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { signToken, authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken({ userId: user.user_id, username: user.username, role: user.role });
  res.json({ token, user: { userId: user.user_id, username: user.username, role: user.role } });
});

router.post('/register', (req, res) => {
  const { username, password, role = 'admin' } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const hash = bcrypt.hashSync(password, 10);
  try {
    const result = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username, hash, role);
    const token = signToken({ userId: result.lastInsertRowid, username, role });
    res.status(201).json({ token, user: { userId: result.lastInsertRowid, username, role } });
  } catch {
    res.status(409).json({ error: 'Username already exists' });
  }
});

router.get('/me', authRequired, (req, res) => {
  res.json(req.user);
});

export default router;
