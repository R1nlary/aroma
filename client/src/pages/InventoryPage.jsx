import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

export default function InventoryPage() {
  const [branchId, setBranchId] = useState(1);
  const { data: stock, loading, refetch } = useFetch(`/inventory?branch_id=${branchId}`, [branchId]);
  const { data: branches } = useFetch('/branches');
  const { data: alerts } = useFetch('/inventory/alerts');
  const { data: orders } = useFetch('/inventory/purchase-orders');

  const alertColor = (level) => {
    if (level === 'CRITICAL') return 'danger';
    if (level === 'WARNING') return 'warning';
    return 'success';
  };

  if (loading) return <div className="container py-5 text-center">Loading...</div>;

  const summary = {
    ok: stock?.filter(s => s.alert_level === 'OK').length || 0,
    warning: stock?.filter(s => s.alert_level === 'WARNING').length || 0,
    critical: stock?.filter(s => s.alert_level === 'CRITICAL').length || 0,
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold mb-0" style={{ color: 'var(--primary)' }}>📦 Inventory Management</h2>
        <select className="form-select" style={{ maxWidth: 250 }} value={branchId}
          onChange={e => setBranchId(Number(e.target.value))}>
          {branches?.map(b => <option key={b.branch_id} value={b.branch_id}>{b.name}</option>)}
        </select>
      </div>

      <div className="row g-3 mb-4">
        {[
          ['OK', summary.ok, 'success', '✅'],
          ['Warning', summary.warning, 'warning', '⚠️'],
          ['Critical', summary.critical, 'danger', '🚨'],
        ].map(([label, count, color, icon]) => (
          <div className="col-md-4" key={label}>
            <div className={`card border-${color} shadow-sm`}>
              <div className="card-body text-center">
                <div style={{ fontSize: 32 }}>{icon}</div>
                <h3 className={`fw-bold text-${color}`}>{count}</h3>
                <small className="text-muted">{label}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Stock Levels</div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Status</th>
                <th>Ingredient</th>
                <th>Current Stock</th>
                <th>Min Stock</th>
                <th>Unit</th>
                <th>Cost/Unit</th>
              </tr>
            </thead>
            <tbody>
              {stock?.map(s => (
                <tr key={s.stock_id}>
                  <td><span className={`badge bg-${alertColor(s.alert_level)}`}>{s.alert_level}</span></td>
                  <td className="fw-semibold">{s.name}</td>
                  <td className={s.alert_level === 'CRITICAL' ? 'text-danger fw-bold' : ''}>
                    {Number(s.quantity).toLocaleString()}
                  </td>
                  <td>{Number(s.min_stock).toLocaleString()}</td>
                  <td>{s.unit}</td>
                  <td>{s.cost_per_unit} KZT</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {alerts?.length > 0 && (
        <div className="card shadow-sm mb-4 border-warning">
          <div className="card-header fw-bold bg-warning bg-opacity-10">⚠️ Global Alerts (All Branches)</div>
          <div className="table-responsive">
            <table className="table table-sm mb-0">
              <thead className="table-light">
                <tr><th>Branch</th><th>Ingredient</th><th>Current</th><th>Min</th><th>Status</th></tr>
              </thead>
              <tbody>
                {alerts.map((a, i) => (
                  <tr key={i}>
                    <td>{a.branch_name}</td>
                    <td className="fw-semibold">{a.ingredient}</td>
                    <td className="text-danger fw-bold">{Number(a.current_stock).toLocaleString()}</td>
                    <td>{Number(a.min_stock).toLocaleString()}</td>
                    <td><span className={`badge bg-${alertColor(a.alert_level)}`}>{a.alert_level}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header fw-bold">Purchase Orders</div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr><th>PO #</th><th>Supplier</th><th>Branch</th><th>Date</th><th>Status</th><th>Total</th></tr>
            </thead>
            <tbody>
              {orders?.map(o => (
                <tr key={o.po_id}>
                  <td className="fw-semibold">PO-{String(o.po_id).padStart(4, '0')}</td>
                  <td>{o.supplier_name}</td>
                  <td>{o.branch_name}</td>
                  <td>{o.order_date}</td>
                  <td>
                    <span className={`badge bg-${o.status === 'received' ? 'success' : o.status === 'sent' ? 'primary' : 'secondary'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>{Number(o.total_amount).toLocaleString()} KZT</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
