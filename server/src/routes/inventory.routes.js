import { Router } from 'express';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, (req, res) => {
  const branchId = req.query.branch_id || 1;
  const rows = db.prepare(`
    SELECT s.stock_id, s.branch_id, s.ingredient_id, s.quantity, s.last_updated,
      i.name, i.unit, i.cost_per_unit, i.min_stock,
      CASE
        WHEN s.quantity < i.min_stock THEN 'CRITICAL'
        WHEN s.quantity < i.min_stock * 1.3 THEN 'WARNING'
        ELSE 'OK'
      END AS alert_level
    FROM stock s
    JOIN ingredient i ON i.ingredient_id = s.ingredient_id
    WHERE s.branch_id = ?
    ORDER BY
      CASE WHEN s.quantity < i.min_stock THEN 0
           WHEN s.quantity < i.min_stock * 1.3 THEN 1
           ELSE 2 END,
      i.name
  `).all(branchId);
  res.json(rows);
});

router.get('/alerts', authRequired, (req, res) => {
  const rows = db.prepare(`
    SELECT b.name AS branch_name, i.name AS ingredient, i.unit,
      s.quantity AS current_stock, i.min_stock,
      CASE
        WHEN s.quantity < i.min_stock THEN 'CRITICAL'
        WHEN s.quantity < i.min_stock * 1.3 THEN 'WARNING'
      END AS alert_level
    FROM stock s
    JOIN branch b ON b.branch_id = s.branch_id
    JOIN ingredient i ON i.ingredient_id = s.ingredient_id
    WHERE s.quantity < i.min_stock * 1.3
    ORDER BY s.quantity / i.min_stock
  `).all();
  res.json(rows);
});

router.get('/purchase-orders', authRequired, (req, res) => {
  const rows = db.prepare(`
    SELECT po.*, sup.name AS supplier_name, b.name AS branch_name,
      (SELECT COUNT(*) FROM purchase_item pi WHERE pi.po_id = po.po_id) AS item_count
    FROM purchase_order po
    JOIN supplier sup ON sup.supplier_id = po.supplier_id
    JOIN branch b ON b.branch_id = po.branch_id
    ORDER BY po.order_date DESC
  `).all();
  res.json(rows);
});

router.post('/purchase-orders', authRequired, (req, res) => {
  const { supplierId, branchId, items } = req.body;
  if (!supplierId || !branchId || !items?.length) {
    return res.status(400).json({ error: 'supplierId, branchId, and items required' });
  }

  const txn = db.transaction(() => {
    const po = db.prepare('INSERT INTO purchase_order (supplier_id, branch_id) VALUES (?, ?)').run(supplierId, branchId);
    const poId = po.lastInsertRowid;
    let total = 0;

    for (const item of items) {
      db.prepare('INSERT INTO purchase_item (po_id, ingredient_id, quantity, unit_price) VALUES (?, ?, ?, ?)').run(poId, item.ingredientId, item.quantity, item.unitPrice);
      total += item.quantity * item.unitPrice;
    }

    db.prepare('UPDATE purchase_order SET total_amount = ? WHERE po_id = ?').run(total, poId);
    return db.prepare('SELECT * FROM purchase_order WHERE po_id = ?').get(poId);
  });

  res.status(201).json(txn());
});

router.put('/purchase-orders/:id/receive', authRequired, (req, res) => {
  const po = db.prepare('SELECT * FROM purchase_order WHERE po_id = ?').get(req.params.id);
  if (!po) return res.status(404).json({ error: 'Not found' });
  if (po.status === 'received') return res.status(400).json({ error: 'Already received' });

  db.prepare("UPDATE purchase_order SET status = 'received' WHERE po_id = ?").run(req.params.id);
  const updated = db.prepare('SELECT * FROM purchase_order WHERE po_id = ?').get(req.params.id);
  res.json(updated);
});

export default router;
