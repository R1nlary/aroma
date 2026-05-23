import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import api from '../api/client';

export default function SalesPage() {
  const { data: sales, loading } = useFetch('/sales');
  const [detail, setDetail] = useState(null);

  const viewDetail = async (id) => {
    const { data } = await api.get(`/sales/${id}`);
    setDetail(data);
  };

  const fmt = (n) => Number(n).toLocaleString() + ' KZT';

  if (loading) return <div className="container py-5 text-center">Loading...</div>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4" style={{ color: 'var(--primary)' }}>🧾 Sales History</h2>

      <div className="row g-4">
        <div className={detail ? 'col-lg-7' : 'col-12'}>
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Sale #</th>
                    <th>Date/Time</th>
                    <th>Branch</th>
                    <th>Employee</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {sales?.map(s => (
                    <tr key={s.sale_id} onClick={() => viewDetail(s.sale_id)}
                      style={{ cursor: 'pointer' }}
                      className={detail?.sale_id === s.sale_id ? 'table-active' : ''}>
                      <td className="fw-semibold">#{s.sale_id}</td>
                      <td>{s.sale_time}</td>
                      <td>{s.branch_name}</td>
                      <td>{s.employee_name}</td>
                      <td>{s.item_count}</td>
                      <td className="fw-bold">{fmt(s.total_amount)}</td>
                      <td>
                        <span className={`badge bg-${s.payment_method === 'card' ? 'primary' : s.payment_method === 'kaspi' ? 'success' : 'secondary'}`}>
                          {s.payment_method}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {detail && (
          <div className="col-lg-5">
            <div className="card shadow-sm sticky-top" style={{ top: 80 }}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <span className="fw-bold">Sale #{detail.sale_id}</span>
                <button className="btn-close" onClick={() => setDetail(null)} />
              </div>
              <div className="card-body">
                <div className="mb-2"><strong>Branch:</strong> {detail.branch_name}</div>
                <div className="mb-2"><strong>Employee:</strong> {detail.employee_name}</div>
                <div className="mb-2"><strong>Time:</strong> {detail.sale_time}</div>
                <div className="mb-3"><strong>Payment:</strong> {detail.payment_method}</div>

                <h6 className="fw-bold text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: 1 }}>Items</h6>
                <table className="table table-sm">
                  <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
                  <tbody>
                    {detail.items?.map(item => (
                      <tr key={item.sale_item_id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{fmt(item.unit_price)}</td>
                        <td className="fw-bold">{fmt(item.unit_price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="d-flex justify-content-between fs-5 fw-bold mt-2" style={{ color: 'var(--primary)' }}>
                  <span>Total</span><span>{fmt(detail.total_amount)}</span>
                </div>

                {detail.invoice && (
                  <div className="mt-3 p-3 rounded" style={{ background: '#f0f6fb' }}>
                    <div className="fw-bold mb-1" style={{ fontSize: 11, color: '#888', textTransform: 'uppercase' }}>Invoice</div>
                    <div><strong>Fiscal #:</strong> {detail.invoice.fiscal_number}</div>
                    <div><strong>VAT:</strong> {fmt(detail.invoice.vat_amount)}</div>
                    <div><strong>Issued:</strong> {detail.invoice.issued_at}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
