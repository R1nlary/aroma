import { useFetch } from '../hooks/useFetch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const fmt = (n) => Math.round(n).toLocaleString() + ' KZT';

export default function DashboardPage() {
  const { data: kpis, loading: kLoading } = useFetch('/dashboard/kpis');
  const { data: revenue } = useFetch('/dashboard/revenue');
  const { data: topProducts } = useFetch('/dashboard/top-products');

  if (kLoading) return <div className="container py-5 text-center">Loading...</div>;

  const pieData = kpis ? [
    { name: 'OK', value: kpis.stockDetails.ok, color: '#28a745' },
    { name: 'Warning', value: kpis.stockDetails.warning, color: '#ffc107' },
    { name: 'Critical', value: kpis.stockDetails.critical, color: '#dc3545' },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4" style={{ color: 'var(--primary)' }}>📊 Management Dashboard</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <div style={{ fontSize: 32 }}>🍔</div>
              <h2 className={`fw-bold ${kpis?.foodCostPct > 30 ? 'text-danger' : 'text-success'}`}>
                {kpis?.foodCostPct || 0}%
              </h2>
              <div className="fw-semibold">Food Cost</div>
              <small className="text-muted">Target: &lt; 30%</small>
              <div className="progress mt-2" style={{ height: 8 }}>
                <div className={`progress-bar ${kpis?.foodCostPct > 30 ? 'bg-danger' : 'bg-success'}`}
                  style={{ width: `${Math.min(kpis?.foodCostPct || 0, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <div style={{ fontSize: 32 }}>💳</div>
              <h2 className="fw-bold" style={{ color: 'var(--primary)' }}>
                {fmt(kpis?.avgTransaction || 0)}
              </h2>
              <div className="fw-semibold">Avg Transaction</div>
              <small className="text-muted">Target: &gt; 2,000 KZT</small>
              <div className="progress mt-2" style={{ height: 8 }}>
                <div className="progress-bar" style={{
                  width: `${Math.min(((kpis?.avgTransaction || 0) / 3000) * 100, 100)}%`,
                  background: 'var(--primary)'
                }} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <div style={{ fontSize: 32 }}>📦</div>
              <h2 className={`fw-bold ${kpis?.stockHealthPct < 90 ? 'text-warning' : 'text-success'}`}>
                {kpis?.stockHealthPct || 0}%
              </h2>
              <div className="fw-semibold">Stock Health</div>
              <small className="text-muted">Target: &gt; 90%</small>
              {pieData.length > 0 && (
                <div style={{ width: '100%', height: 120 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header fw-bold">Daily Revenue</div>
            <div className="card-body">
              {revenue?.length > 0 ? (
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={revenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => fmt(v)} />
                      <Bar dataKey="revenue" fill="#1f4e79" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center text-muted py-5">No revenue data yet</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-header fw-bold">Top Products</div>
            <div className="card-body p-0">
              <table className="table table-sm mb-0">
                <thead className="table-light">
                  <tr><th>#</th><th>Product</th><th>Sold</th><th>Revenue</th></tr>
                </thead>
                <tbody>
                  {topProducts?.map((p, i) => (
                    <tr key={p.product_id}>
                      <td className="fw-bold">{i + 1}</td>
                      <td>{p.name}</td>
                      <td>{p.total_sold}</td>
                      <td className="fw-semibold">{fmt(p.total_revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
