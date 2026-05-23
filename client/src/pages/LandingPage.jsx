import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function LandingPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [flash, setFlash] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/contact', form);
      setFlash({ type: 'success', msg: data.message });
      setForm({ name: '', email: '', message: '' });
    } catch {
      setFlash({ type: 'danger', msg: 'Failed to send message.' });
    }
  };

  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-6 text-center text-lg-start">
              <span className="badge-soft">UNIVERSITY ERP MVP</span>
              <h1 className="mt-3" style={{ fontWeight: 800, fontSize: 'clamp(1.9rem, 5.5vw, 3rem)', lineHeight: 1.15 }}>
                Run your coffee chain like a Lab.
              </h1>
              <p className="lead mt-3" style={{ opacity: .9 }}>
                Aroma Lab unifies POS, inventory and accounting into one beautiful workspace — built for modern coffee shops.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 mt-4 justify-content-center justify-content-lg-start">
                <Link to="/pos" className="btn btn-lg px-4" style={{ background: 'var(--accent)', border: 0, color: 'var(--primary)', fontWeight: 700 }}>
                  Open POS
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-4 fw-semibold">
                  Admin Login
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{
                background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)',
                borderRadius: 20, padding: 'clamp(18px, 3vw, 28px)', backdropFilter: 'blur(8px)'
              }}>
                <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
                  <strong>Today</strong><span className="small">Branch: Dostyk</span>
                </div>
                <div className="row text-center g-2 g-md-3">
                  {[['128', 'Orders'], ['$1,842', 'Revenue'], ['94%', 'Stock OK']].map(([num, label]) => (
                    <div className="col-4" key={label}>
                      <div style={{ padding: 'clamp(12px, 2.5vw, 18px) 8px', background: 'rgba(255,255,255,.1)', borderRadius: 14 }}>
                        <div style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)', fontWeight: 800 }}>{num}</div>
                        <small>{label}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="features" style={{ padding: 'clamp(48px, 8vw, 80px) 0' }}>
        <div className="container">
          <div className="text-center">
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2rem)' }}>Everything you need, in one place</h2>
            <p style={{ color: '#6b7280', maxWidth: 640, margin: '0 auto 32px' }}>
              From the espresso machine to the balance sheet — Aroma Lab handles it.
            </p>
          </div>
          <div className="row g-3 g-md-4">
            {[
              ['☕', 'Point of Sale', 'Lightning-fast checkout, category browsing, multi-payment support and instant fiscal receipts.'],
              ['📦', 'Inventory', 'Recipes auto-deduct ingredients per sale. Suppliers, purchase orders and low-stock alerts built-in.'],
              ['📊', 'Accounting', 'Track shifts, payroll, invoices and branch profitability with a clean reporting dashboard.'],
            ].map(([icon, title, desc]) => (
              <div className="col-md-6 col-lg-4" key={title}>
                <div className="feature-card">
                  <div className="feature-icon">{icon}</div>
                  <h5 className="fw-bold">{title}</h5>
                  <p className="text-muted mb-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" style={{ background: '#f8fafc', padding: 'clamp(48px, 8vw, 80px) 0' }}>
        <div className="container">
          <div className="text-center">
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2rem)' }}>Get in touch</h2>
            <p style={{ color: '#6b7280', maxWidth: 640, margin: '0 auto 32px' }}>
              Have questions about Aroma Lab? Send us a note.
            </p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-7">
              {flash && (
                <div className={`alert alert-${flash.type} alert-dismissible fade show`}>
                  {flash.msg}
                  <button type="button" className="btn-close" onClick={() => setFlash(null)} />
                </div>
              )}
              <form onSubmit={handleSubmit} className="bg-white p-3 p-md-4 p-lg-5 rounded-4 shadow-sm">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Name</label>
                    <input type="text" className="form-control form-control-lg" required
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email</label>
                    <input type="email" className="form-control form-control-lg" required
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Message</label>
                    <textarea rows="4" className="form-control form-control-lg" required
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <div className="col-12 d-grid">
                    <button className="btn btn-lg text-white" style={{ background: 'var(--primary)', border: 0 }}>
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center" style={{ background: '#0f2335', color: '#cbd5e1', padding: '28px 0' }}>
        <div className="container">
          <div className="fw-bold text-white mb-1">Aroma Lab</div>
          <small>&copy; 2025 Aroma Lab — University ERP MVP. All rights reserved.</small>
        </div>
      </footer>
    </>
  );
}
