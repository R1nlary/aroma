import { Router } from 'express';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/kpis', authRequired, (req, res) => {
  const branchId = req.query.branch_id || null;

  let foodCostSql = `SELECT ROUND(AVG(food_cost_pct), 1) AS food_cost_pct FROM v_food_cost`;
  let avgTxnSql = `SELECT ROUND(AVG(avg_transaction_value), 0) AS avg_txn FROM v_avg_transaction`;
  const fcParams = [];
  const atParams = [];

  if (branchId) {
    foodCostSql += ' WHERE branch_id = ?';
    avgTxnSql += ' WHERE branch_id = ?';
    fcParams.push(branchId);
    atParams.push(branchId);
  }

  const foodCost = db.prepare(foodCostSql).get(...fcParams);
  const avgTxn = db.prepare(avgTxnSql).get(...atParams);

  let stockSql = 'SELECT * FROM v_stock_alerts';
  const stockParams = [];
  if (branchId) {
    const branch = db.prepare('SELECT name FROM branch WHERE branch_id = ?').get(branchId);
    if (branch) {
      stockSql += ' WHERE branch_name = ?';
      stockParams.push(branch.name);
    }
  }
  const stockAlerts = db.prepare(stockSql).all(...stockParams);
  const total = stockAlerts.length;
  const ok = stockAlerts.filter(r => r.alert_level === 'OK').length;
  const stockHealth = total > 0 ? Math.round((ok / total) * 100) : 100;

  res.json({
    foodCostPct: foodCost.food_cost_pct || 0,
    avgTransaction: avgTxn.avg_txn || 0,
    stockHealthPct: stockHealth,
    stockDetails: {
      ok,
      warning: stockAlerts.filter(r => r.alert_level === 'WARNING').length,
      critical: stockAlerts.filter(r => r.alert_level === 'CRITICAL').length
    }
  });
});

router.get('/revenue', authRequired, (req, res) => {
  const rows = db.prepare(`
    SELECT DATE(sale_time) AS date,
      SUM(total_amount) AS revenue,
      COUNT(*) AS transactions
    FROM sale
    GROUP BY DATE(sale_time)
    ORDER BY date DESC
    LIMIT 30
  `).all();
  res.json(rows.reverse());
});

router.get('/top-products', authRequired, (req, res) => {
  const rows = db.prepare(`SELECT * FROM v_top_products LIMIT 10`).all();
  res.json(rows);
});

export default router;
