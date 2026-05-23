import bcrypt from 'bcryptjs';
import db from './db.js';

const hash = bcrypt.hashSync('1234', 10);
try {
  db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', hash, 'admin');
  console.log('Admin user created (admin / 1234)');
} catch {
  console.log('Admin user already exists');
}
