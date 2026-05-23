import { Router } from 'express';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { createSale } from '../services/sale.service.js';

const router = Router();

router.get('/', authRequired, (req, res) => {
  const { branch_id, date_from, date_to } = req.query;
  let sql = `
    SELECT s.*, b.name AS branch_name, e.full_name AS employee_name,
      (SELECT COUNT(*) FROM sale_item si WHERE si.sale_id = s.sale_id) AS item_count
    FROM sale s
    JOIN branch b ON b.branch_id = s.branch_id
    JOIN employee e ON e.employee_id = s.employee_id
    WHERE 1=1
  `;
  const params = [];
  if (branch_id) { sql += ' AND s.branch_id = ?'; params.push(branch_id); }
  if (date_from) { sql += ' AND s.sale_time >= ?'; params.push(date_from); }
  if (date_to) { sql += ' AND s.sale_time <= ?'; params.push(date_to + ' 23:59:59'); }
  sql += ' ORDER BY s.sale_time DESC LIMIT 100';

  res.json(db.prepare(sql).all(...params));
});

router.get('/:id', authRequired, (req, res) => {
  const sale = db.prepare(`
    SELECT s.*, b.name AS branch_name, e.full_name AS employee_name
    FROM sale s
    JOIN branch b ON b.branch_id = s.branch_id
    JOIN employee e ON e.employee_id = s.employee_id
    WHERE s.sale_id = ?
  `).get(req.params.id);
  if (!sale) return res.status(404).json({ error: 'Not found' });

  const items = db.prepare(`
    SELECT si.*, p.name, p.category
    FROM sale_item si JOIN product p ON p.product_id = si.product_id
    WHERE si.sale_id = ?
  `).all(req.params.id);

  const invoice = db.prepare('SELECT * FROM invoice WHERE sale_id = ?').get(req.params.id);

  res.json({ ...sale, items, invoice });
});

router.post('/', authRequired, (req, res) => {
  const { branchId = 1, employeeId = 1, paymentMethod, items, discount = 0 } = req.body;
  if (!paymentMethod || !items?.length) {
    return res.status(400).json({ error: 'paymentMethod and items required' });
  }
  try {
    const result = createSale({ branchId, employeeId, paymentMethod, items, discount });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
