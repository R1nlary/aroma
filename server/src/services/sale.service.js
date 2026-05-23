import db from '../db.js';

const insertSale = db.prepare(`
  INSERT INTO sale (branch_id, employee_id, payment_method) VALUES (?, ?, ?)
`);

const insertSaleItem = db.prepare(`
  INSERT INTO sale_item (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)
`);

const getSaleTotal = db.prepare(`SELECT total_amount FROM sale WHERE sale_id = ?`);

const getInvoice = db.prepare(`SELECT * FROM invoice WHERE sale_id = ?`);

const getStockChanges = db.prepare(`
  SELECT i.name AS ingredient, i.unit, r.quantity * ? AS deducted
  FROM recipe r JOIN ingredient i ON i.ingredient_id = r.ingredient_id
  WHERE r.product_id = ?
`);

export function createSale({ branchId = 1, employeeId = 1, paymentMethod, items, discount = 0 }) {
  const txn = db.transaction(() => {
    const saleResult = insertSale.run(branchId, employeeId, paymentMethod);
    const saleId = saleResult.lastInsertRowid;

    const stockUpdates = [];
    for (const item of items) {
      insertSaleItem.run(saleId, item.productId, item.quantity, item.unitPrice);
      const changes = getStockChanges.all(item.quantity, item.productId);
      stockUpdates.push(...changes);
    }

    const sale = db.prepare(`
      SELECT s.*,
        (SELECT json_group_array(json_object(
          'sale_item_id', si.sale_item_id, 'product_id', si.product_id,
          'quantity', si.quantity, 'unit_price', si.unit_price,
          'name', p.name, 'category', p.category
        )) FROM sale_item si JOIN product p ON p.product_id = si.product_id WHERE si.sale_id = s.sale_id) AS items
      FROM sale s WHERE s.sale_id = ?
    `).get(saleId);

    const invoice = getInvoice.get(saleId);

    return {
      ...sale,
      items: JSON.parse(sale.items),
      invoice,
      stockUpdates
    };
  });

  return txn();
}
