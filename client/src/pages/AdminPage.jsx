import { useState } from 'react';
import api from '../api/client';
import { useFetch } from '../hooks/useFetch';

export default function AdminPage() {
  const { data: products, loading, refetch } = useFetch('/products');
  const [form, setForm] = useState({ name: '', category: 'Coffee', price: '', is_active: true });
  const [editing, setEditing] = useState(null);
  const [flash, setFlash] = useState(null);

  const categories = ['Coffee', 'Drinks', 'Pastry', 'Food', 'Dessert'];

  const showFlash = (type, msg) => {
    setFlash({ type, msg });
    setTimeout(() => setFlash(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/products/${editing}`, form);
        showFlash('success', 'Product updated.');
        setEditing(null);
      } else {
        await api.post('/products', form);
        showFlash('success', `Product "${form.name}" created.`);
      }
      setForm({ name: '', category: 'Coffee', price: '', is_active: true });
      refetch();
    } catch (err) {
      showFlash('danger', err.response?.data?.error || 'Error');
    }
  };

  const handleEdit = (p) => {
    setEditing(p.product_id);
    setForm({ name: p.name, category: p.category, price: p.price, is_active: !!p.is_active });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    showFlash('info', 'Product deleted.');
    refetch();
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: '', category: 'Coffee', price: '', is_active: true });
  };

  if (loading) return <div className="container py-5 text-center">Loading...</div>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4" style={{ color: 'var(--primary)' }}>Product Management</h2>

      {flash && (
        <div className={`alert alert-${flash.type} alert-dismissible fade show`}>
          {flash.msg}
          <button type="button" className="btn-close" onClick={() => setFlash(null)} />
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold">{editing ? 'Edit Product' : 'Add Product'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input type="text" className="form-control" required
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Category</label>
                  <select className="form-select" value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Price (KZT)</label>
                  <input type="number" className="form-control" required min="1"
                    value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" id="active"
                    checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                  <label className="form-check-label" htmlFor="active">Active</label>
                </div>
                <button type="submit" className="btn text-white w-100" style={{ background: 'var(--primary)' }}>
                  {editing ? 'Update' : 'Create'}
                </button>
                {editing && (
                  <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={cancelEdit}>
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map(p => (
                    <tr key={p.product_id}>
                      <td>{p.product_id}</td>
                      <td className="fw-semibold">{p.name}</td>
                      <td><span className="badge bg-secondary">{p.category}</span></td>
                      <td>{Number(p.price).toLocaleString()} KZT</td>
                      <td>{p.is_active ? '✅' : '❌'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.product_id)}>Delete</button>
                      </td>
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
