// src/components/Owner/ProductDashboard.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../../mockApi';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts(); // wrapper in mockApi
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, color: 'var(--text-main)' }}>Product Catalog</h2>
        <Link to="/owner/dashboard/product/add" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center' }}>
          <Plus size={16} style={{ marginRight: '4px' }} /> Add Product
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No products found.</div>
      ) : (
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {products.map(p => (
            <div key={p.id} className="card" style={{ position: 'relative' }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>{p.name}</h3>
              <p style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)' }}>{p.category}</p>
              <p style={{ margin: '0 0 0.5rem' }}><strong>₹{p.price}</strong></p>
              <p style={{ margin: 0, color: p.stock <= 5 ? 'var(--danger-color)' : 'var(--text-muted)' }}>
                Stock: {p.stock}
              </p>
              <Link to={`/owner/dashboard/product/${p.id}`} style={{ position: 'absolute', inset: 0 }} aria-label={`View details of ${p.name}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
