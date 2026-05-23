import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'aroma-lab-dev-secret';

export function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token required' });
  }
  try {
    req.user = jwt.verify(header.slice(7), SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '24h' });
}
