import { useState, useEffect } from 'react';
import api from '../api/client';
import './POSPage.css';

const EMOJIS = {
  Coffee: '☕', Drinks: '🍫', Pastry: '🥐', Food: '🥪', Dessert: '🍰',
};

const fmt = (n) => Math.round(n).toLocaleString('en') + ' KZT';

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [discount, setDiscount] = useState(0);
  const [cashGiven, setCashGiven] = useState(0);
  const [receipt, setReceipt] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    api.get('/products?active=true').then(r => setProducts(r.data));
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    if (category !== 'All' && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const cartItems = Object.entries(cart);
  const totalQty = cartItems.reduce((s, [, q]) => s + q, 0);

  const calcTotals = () => {
    const gross = cartItems.reduce((s, [id, qty]) => {
      const p = products.find(x => x.product_id === Number(id));
      return s + (p?.price || 0) * qty;
    }, 0);
    const discPct = Math.max(0, Math.min(100, discount));
    const discAmt = Math.round(gross * discPct / 100);
    const grand = gross - discAmt;
    const vat = Math.round(grand * 12 / 112);
    return { gross, discPct, discAmt, grand, vat, subtotal: grand - vat };
  };

  const t = calcTotals();

  const addToCart = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const changeQty = (id, delta) => setCart(c => {
    const next = (c[id] || 0) + delta;
    if (next <= 0) { const { [id]: _, ...rest } = c; return rest; }
    return { ...c, [id]: next };
  });
  const removeItem = (id) => setCart(c => { const { [id]: _, ...rest } = c; return rest; });
  const clearCart = () => { if (confirm('Clear all items?')) setCart({}); };

  const checkout = async () => {
    if (paymentMethod === 'cash' && cashGiven < t.grand) return;
    const items = cartItems.map(([id, qty]) => {
      const p = products.find(x => x.product_id === Number(id));
      return { productId: p.product_id, quantity: qty, unitPrice: p.price };
    });
    try {
      const { data } = await api.post('/sales', { paymentMethod, items, discount });
      setReceipt(data);
    } catch (err) {
      alert(err.response?.data?.error || 'Checkout failed');
    }
  };

  const closeReceipt = () => {
    setReceipt(null);
    setCart({});
    setDiscount(0);
    setCashGiven(0);
    setCartOpen(false);
  };

  return (
    <div className="pos-layout">
      <header className="pos-header">
        <div className="pos-logo">AROMA<span> LAB</span> POS</div>
        <div className="pos-header-info">
          <div>Store: <b>Dostyk 89</b></div>
          <div>Barista: <b>Aliya Zhumabayeva</b></div>
        </div>
        <div className="pos-header-actions">
          <button className="pos-header-btn cart-toggle-btn" onClick={() => setCartOpen(!cartOpen)}>
            🛒 {totalQty}
          </button>
        </div>
      </header>

      <div className="pos-main">
        <div className="pos-products-panel">
          <div className="pos-toolbar">
            <div className="pos-search-box">
              <input type="text" placeholder="Search products..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="pos-categories">
            {categories.map(c => (
              <button key={c} className={`pos-cat-btn ${c === category ? 'active' : ''}`}
                onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div className="pos-products-grid">
            {filtered.map(p => (
              <div key={p.product_id} className={`pos-product-card ${cart[p.product_id] ? 'in-cart' : ''}`}
                onClick={() => addToCart(p.product_id)}>
                {cart[p.product_id] && <div className="pos-qty-badge">{cart[p.product_id]}</div>}
                <div className="pos-product-emoji">{EMOJIS[p.category] || '🍽️'}</div>
                <div className="pos-product-name">{p.name}</div>
                <div className="pos-product-cat">{p.category}</div>
                <div className="pos-product-price">{Number(p.price).toLocaleString()} KZT</div>
              </div>
            ))}
            {filtered.length === 0 && <div className="pos-empty-state">No products match your search.</div>}
          </div>
        </div>

        {cartOpen && <div className="pos-backdrop" onClick={() => setCartOpen(false)} />}

        <div className={`pos-cart-panel ${cartOpen ? 'open' : ''}`}>
          <div className="pos-cart-header">
            <div className="pos-cart-title-wrap">
              <div className="pos-cart-title">Current Order</div>
              <div className="pos-cart-count">{totalQty}</div>
            </div>
            <button className="pos-icon-btn danger" onClick={clearCart} disabled={totalQty === 0}>✕ Clear</button>
          </div>

          <div className="pos-cart-items">
            {totalQty === 0 ? (
              <div className="pos-cart-empty">
                <div style={{ fontSize: 56, opacity: .4, marginBottom: 12 }}>🛒</div>
                Cart is empty.<br /><small>Pick products on the left.</small>
              </div>
            ) : (
              cartItems.map(([id, qty]) => {
                const p = products.find(x => x.product_id === Number(id));
                if (!p) return null;
                return (
                  <div key={id} className="pos-cart-item">
                    <div className="pos-ci-emoji">{EMOJIS[p.category] || '🍽️'}</div>
                    <div className="pos-ci-info">
                      <div className="pos-ci-name">{p.name}</div>
                      <div className="pos-ci-price">{Number(p.price).toLocaleString()} KZT/pc</div>
                    </div>
                    <div className="pos-ci-qty">
                      <button className="pos-qty-btn" onClick={() => changeQty(id, -1)}>−</button>
                      <span className="pos-ci-count">{qty}</span>
                      <button className="pos-qty-btn" onClick={() => changeQty(id, 1)}>+</button>
                    </div>
                    <div className="pos-ci-total">{(p.price * qty).toLocaleString()}</div>
                    <button className="pos-ci-remove" onClick={() => removeItem(id)}>×</button>
                  </div>
                );
              })
            )}
          </div>

          <div className="pos-discount-row">
            <label>Discount %</label>
            <input type="number" min="0" max="100" value={discount}
              onChange={e => setDiscount(Number(e.target.value) || 0)} className="pos-discount-input" />
          </div>

          <div className="pos-cart-totals">
            <div className="pos-total-row"><span>Subtotal (excl. VAT)</span><span>{fmt(t.subtotal)}</span></div>
            <div className="pos-total-row"><span>VAT 12%</span><span>{fmt(t.vat)}</span></div>
            {t.discAmt > 0 && <div className="pos-total-row discount"><span>Discount</span><span>− {fmt(t.discAmt)}</span></div>}
            <div className="pos-total-row grand"><span>Total</span><span>{fmt(t.grand)}</span></div>
          </div>

          <div className="pos-payment">
            <div className="pos-payment-label">Payment method</div>
            <div className="pos-payment-methods">
              {[['card', '💳 Card'], ['kaspi', '📱 Kaspi QR'], ['cash', '💵 Cash']].map(([m, l]) => (
                <button key={m} className={`pos-pay-btn ${paymentMethod === m ? 'active' : ''}`}
                  onClick={() => setPaymentMethod(m)}>{l}</button>
              ))}
            </div>
            {paymentMethod === 'cash' && (
              <div className="pos-cash-row">
                <label>Cash given:</label>
                <input type="number" min="0" value={cashGiven || ''}
                  onChange={e => setCashGiven(Number(e.target.value) || 0)} />
                <span>Change: <span className={cashGiven - t.grand < 0 ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                  {fmt(cashGiven - t.grand)}
                </span></span>
              </div>
            )}
            <button className="pos-checkout-btn" disabled={totalQty === 0} onClick={checkout}>
              Complete Sale
            </button>
          </div>
        </div>
      </div>

      {receipt && (
        <div className="pos-modal-bg show" onClick={closeReceipt}>
          <div className="pos-receipt" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', fontSize: 44, marginBottom: 12 }}>✅</div>
            <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#28a745', marginBottom: 6 }}>
              Sale Completed
            </div>
            {receipt.invoice && (
              <div style={{
                textAlign: 'center', fontSize: 12, color: '#888', marginBottom: 20,
                fontFamily: 'Courier New, monospace', background: '#f5f5f5', padding: 4, borderRadius: 4
              }}>
                {receipt.invoice.fiscal_number}
              </div>
            )}
            <hr style={{ borderTop: '1px dashed #ccc' }} />
            <div className="pos-receipt-line"><span>Store:</span><span>Aroma Lab Dostyk 89</span></div>
            <div className="pos-receipt-line"><span>Payment:</span><span className="fw-bold">{receipt.payment_method}</span></div>

            <div style={{ fontWeight: 700, fontSize: 11, color: '#888', textTransform: 'uppercase', margin: '16px 0 8px', letterSpacing: 1 }}>Items</div>
            {receipt.items?.map((item, i) => (
              <div key={i} className="pos-receipt-line">
                <span>{item.name} × {item.quantity}</span>
                <span>{(item.unit_price * item.quantity).toLocaleString()} KZT</span>
              </div>
            ))}
            <hr style={{ borderTop: '1px dashed #ccc' }} />
            <div className="pos-receipt-line" style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>
              <span>TOTAL</span><span>{fmt(receipt.total_amount)}</span>
            </div>
            {receipt.invoice && (
              <div className="pos-receipt-line"><span>VAT 12%</span><span>{fmt(receipt.invoice.vat_amount)}</span></div>
            )}

            {receipt.stockUpdates?.length > 0 && (
              <div style={{
                background: '#fffdf5', borderLeft: '4px solid #ffc107',
                padding: '12px 16px', margin: '16px 0', borderRadius: 8, fontSize: 12
              }}>
                <b style={{ display: 'block', marginBottom: 6, color: '#b38600' }}>📦 Auto-deducted from stock:</b>
                {receipt.stockUpdates.map((s, i) => (
                  <div key={i}>− {s.ingredient} ({s.unit}): {s.deducted}</div>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => window.print()}>🖨 Print</button>
              <button className="btn text-white" style={{ background: 'var(--primary)' }} onClick={closeReceipt}>New Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
