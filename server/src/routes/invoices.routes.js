import { Router } from 'express';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, (req, res) => {
  const { date_from, date_to } = req.query;
  let sql = `
    SELECT inv.*, s.total_amount, s.payment_method, s.sale_time,
      b.name AS branch_name, e.full_name AS employee_name
    FROM invoice inv
    JOIN sale s ON s.sale_id = inv.sale_id
    JOIN branch b ON b.branch_id = s.branch_id
    JOIN employee e ON e.employee_id = s.employee_id
    WHERE 1=1
  `;
  const params = [];
  if (date_from) { sql += ' AND inv.issued_at >= ?'; params.push(date_from); }
  if (date_to) { sql += ' AND inv.issued_at <= ?'; params.push(date_to + ' 23:59:59'); }
  sql += ' ORDER BY inv.issued_at DESC LIMIT 100';

  res.json(db.prepare(sql).all(...params));
});

router.get('/:id', authRequired, (req, res) => {
  const invoice = db.prepare(`
    SELECT inv.*, s.total_amount, s.payment_method, s.sale_time,
      b.name AS branch_name, e.full_name AS employee_name
    FROM invoice inv
    JOIN sale s ON s.sale_id = inv.sale_id
    JOIN branch b ON b.branch_id = s.branch_id
    JOIN employee e ON e.employee_id = s.employee_id
    WHERE inv.invoice_id = ?
  `).get(req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Not found' });

  const items = db.prepare(`
    SELECT si.*, p.name, p.category
    FROM sale_item si JOIN product p ON p.product_id = si.product_id
    WHERE si.sale_id = ?
  `).all(invoice.sale_id);

  res.json({ ...invoice, items });
});

export default router;
