import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Bell, ChevronRight, Plus, Camera, ScanLine, X } from 'lucide-react';
import { api } from '../../mockApi';
import OwnerCustomerDetail from './OwnerCustomerDetail';

export default function OwnerDashboard({ user }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, [user]);

  const loadCustomers = async () => {
    try {
      // In a real app we would get the shop's ID, for now using user ID assumption
      const data = await api.getCustomersForShop(user.id);
      setCustomers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '800px', margin: '0 auto', background: 'var(--bg-color)'}}>
      {/* Header */}
      <header style={{padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10}}>
        <div>
          <h1 style={{margin: 0, fontSize: '20px'}}>Kirana App</h1>
          <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>{user.name}'s Dashboard</div>
        </div>
        <Link to="/owner/dashboard/notifications" style={{color: 'var(--text-main)', padding: '8px'}}>
          <Bell size={24} />
        </Link>
      </header>

      {/* Main Content Area */}
      <div style={{flex: 1, overflowY: 'auto', padding: '16px'}}>
        <Routes>
          <Route path="/" element={
            <div className="fade-in">
              <h2 style={{fontSize: '16px', color: 'var(--text-muted)', marginBottom: '16px'}}>Your Customers</h2>
              {loading ? (
                <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>Loading...</div>
              ) : customers.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>No customers yet.</div>
              ) : (
                <div className="space-y-4">
                  {customers.map(c => (
                    <div key={c.id} className="list-item" onClick={() => navigate(`/owner/dashboard/customer/${c.id}`)}>
                      <div>
                        <div style={{fontWeight: 600, fontSize: '16px'}}>{c.name}</div>
                        <div style={{fontSize: '14px', color: 'var(--text-muted)'}}>{c.mobile}</div>
                      </div>
                      <ChevronRight size={20} color="var(--primary-color)" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          } />
          
          <Route path="/customer/:customerId" element={<OwnerCustomerDetail />} />
          <Route path="/notifications" element={<div className="fade-in" style={{padding: '24px', textAlign: 'center'}}>No new notifications.</div>} />
        </Routes>
      </div>
    </div>
  );
}
