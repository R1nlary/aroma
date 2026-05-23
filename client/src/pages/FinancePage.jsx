import { useFetch } from '../hooks/useFetch';

export default function FinancePage() {
  const { data: invoices, loading } = useFetch('/invoices');

  const fmt = (n) => Number(n).toLocaleString() + ' KZT';

  if (loading) return <div className="container py-5 text-center">Loading...</div>;

  const totalRevenue = invoices?.reduce((s, inv) => s + inv.total_amount, 0) || 0;
  const totalVAT = invoices?.reduce((s, inv) => s + inv.vat_amount, 0) || 0;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4" style={{ color: 'var(--primary)' }}>💰 Finance &amp; Accounting</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <div style={{ fontSize: 28 }}>🧾</div>
              <h3 className="fw-bold" style={{ color: 'var(--primary)' }}>{invoices?.length || 0}</h3>
              <small className="text-muted">Total Invoices</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <div style={{ fontSize: 28 }}>💵</div>
              <h3 className="fw-bold text-success">{fmt(totalRevenue)}</h3>
              <small className="text-muted">Total Revenue</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <div style={{ fontSize: 28 }}>🏛️</div>
              <h3 className="fw-bold text-warning">{fmt(totalVAT)}</h3>
              <small className="text-muted">Total VAT (12%)</small>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header fw-bold">Auto-Generated Invoices</div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Invoice #</th>
                <th>Fiscal Number</th>
                <th>Sale #</th>
                <th>Branch</th>
                <th>Employee</th>
                <th>Amount</th>
                <th>VAT</th>
                <th>Payment</th>
                <th>Issued</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map(inv => (
                <tr key={inv.invoice_id}>
                  <td className="fw-semibold">INV-{String(inv.invoice_id).padStart(4, '0')}</td>
                  <td><code>{inv.fiscal_number}</code></td>
                  <td>#{inv.sale_id}</td>
                  <td>{inv.branch_name}</td>
                  <td>{inv.employee_name}</td>
                  <td className="fw-bold">{fmt(inv.total_amount)}</td>
                  <td className="text-warning">{fmt(inv.vat_amount)}</td>
                  <td>
                    <span className={`badge bg-${inv.payment_method === 'card' ? 'primary' : inv.payment_method === 'kaspi' ? 'success' : 'secondary'}`}>
                      {inv.payment_method}
                    </span>
                  </td>
                  <td>{inv.issued_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-header fw-bold">Accounting Journal (Sample GL Entries)</div>
        <div className="card-body">
          <p className="text-muted mb-3">Each sale auto-generates the following general ledger entries:</p>
          <table className="table table-sm">
            <thead className="table-light">
              <tr><th>Account</th><th>Description</th><th>Debit</th><th>Credit</th></tr>
            </thead>
            <tbody>
              <tr><td><code>1010</code></td><td>Cash / Bank</td><td className="fw-bold">{fmt(totalRevenue)}</td><td>—</td></tr>
              <tr><td><code>6010</code></td><td>Sales Revenue</td><td>—</td><td className="fw-bold">{fmt(totalRevenue - totalVAT)}</td></tr>
              <tr><td><code>3130</code></td><td>VAT Payable</td><td>—</td><td className="fw-bold">{fmt(totalVAT)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
