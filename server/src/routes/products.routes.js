import { Router } from 'express';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const { active } = req.query;
  let rows;
  if (active === 'true') {
    rows = db.prepare('SELECT * FROM product WHERE is_active = 1 ORDER BY category, name').all();
  } else {
    rows = db.prepare('SELECT * FROM product ORDER BY product_id DESC').all();
  }
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM product WHERE product_id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });

  const recipe = db.prepare(`
    SELECT r.*, i.name AS ingredient_name, i.unit, i.cost_per_unit
    FROM recipe r JOIN ingredient i ON i.ingredient_id = r.ingredient_id
    WHERE r.product_id = ?
  `).all(req.params.id);

  res.json({ ...product, recipe });
});

router.post('/', authRequired, (req, res) => {
  const { name, category, price, is_active = 1 } = req.body;
  if (!name || !category || !price || price <= 0) {
    return res.status(400).json({ error: 'Valid name, category, and price > 0 required' });
  }
  const result = db.prepare('INSERT INTO product (name, category, price, is_active) VALUES (?, ?, ?, ?)').run(name, category, price, is_active ? 1 : 0);
  res.status(201).json({ product_id: result.lastInsertRowid, name, category, price, is_active: is_active ? 1 : 0 });
});

router.put('/:id', authRequired, (req, res) => {
  const { name, category, price, is_active } = req.body;
  if (!name || !category || !price || price <= 0) {
    return res.status(400).json({ error: 'Valid name, category, and price > 0 required' });
  }
  const changes = db.prepare('UPDATE product SET name=?, category=?, price=?, is_active=? WHERE product_id=?').run(name, category, price, is_active ? 1 : 0, req.params.id);
  if (changes.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ product_id: Number(req.params.id), name, category, price, is_active: is_active ? 1 : 0 });
});

router.delete('/:id', authRequired, (req, res) => {
  const changes = db.prepare('DELETE FROM product WHERE product_id=?').run(req.params.id);
  if (changes.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ deleted: true });
});

export default router;
