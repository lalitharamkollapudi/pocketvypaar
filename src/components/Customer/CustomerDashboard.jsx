import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, MapPin, Store } from 'lucide-react';
import { api } from '../../mockApi';

export default function CustomerDashboard({ user }) {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadShops();
  }, [user]);

  const loadShops = async () => {
    try {
      const data = await api.getShopsForCustomer(user.id);
      setShops(data);
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
          <h1 style={{margin: 0, fontSize: '20px'}}>Kirana Khata</h1>
          <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>{user.name}'s Accounts</div>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{flex: 1, overflowY: 'auto', padding: '16px'}}>
        <Routes>
          <Route path="/" element={
            <div className="fade-in">
              <h2 style={{fontSize: '16px', color: 'var(--text-muted)', marginBottom: '16px'}}>Your Shops</h2>
              {loading ? (
                <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>Loading...</div>
              ) : shops.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>No active accounts found.</div>
              ) : (
                <div className="space-y-4">
                  {shops.map(s => (
                    <div key={s.id} className="list-item" onClick={() => navigate(`/customer/dashboard/shop/${s.id}`)}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <div style={{background: 'rgba(59,130,246,0.1)', padding: '12px', borderRadius: '50%'}}>
                          <Store size={20} color="var(--primary-color)" />
                        </div>
                        <div>
                          <div style={{fontWeight: 600, fontSize: '16px'}}>{s.name}</div>
                          <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>{s.location.address}</div>
                        </div>
                      </div>
                      <ChevronRight size={20} color="var(--primary-color)" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          } />
          
          <Route path="/shop/:shopId" element={<CustomerShopDetail shops={shops} user={user} />} />
        </Routes>
      </div>
    </div>
  );
}

function CustomerShopDetail({ shops, user }) {
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [ledger, setLedger] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        const sId = pathParts[pathParts.length - 1];
        const currentShop = shops.find(s => s.id === sId);
        if(currentShop) {
            setShop(currentShop);
            loadLedger(currentShop.id);
        }
    }, [window.location.pathname, shops]);

    const loadLedger = async (shopId) => {
        try {
            const data = await api.getLedger(shopId, user.id);
            setLedger(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const destLat = shop.location.lat;
            const destLng = shop.location.lng;
            const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destLat},${destLng}`;
            window.open(mapUrl, '_blank');
        }, () => {
            alert('Unable to retrieve your location');
        });
    };

    if (!shop) return <div style={{padding: '24px'}}>Loading...</div>;

    const today = new Date().toISOString().split('T')[0];
    const dailyPurchaseHistory = ledger.filter(l => l.date === today);
    const monthlyPurchaseHistory = ledger.filter(l => l.date !== today);

    return (
        <div className="fade-in" style={{paddingBottom: '24px'}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '16px'}}>
                <button className="icon-btn" onClick={() => navigate(-1)} style={{padding: '8px', background: 'transparent', color: 'var(--text-main)'}}><ArrowLeft /></button>
                <h2 style={{margin: 0}}>Shop Ledger</h2>
            </div>
            
            {/* Shop Details Context */}
            <div className="surface" style={{marginBottom: '24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), transparent)', borderLeft: '4px solid var(--primary-color)'}}>
                <h3 style={{margin: '0 0 8px 0', fontSize: '18px'}}>{shop.name}</h3>
                <div style={{fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px'}}>Owner: {shop.ownerName} ({shop.ownerMobile})</div>
                <div style={{fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px'}}>{shop.location.address}</div>
                
                <button className="primary" style={{display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center'}} onClick={handleNavigation}>
                    <MapPin size={18} />
                    Navigate via Google Maps
                </button>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '24px'}}>
                {/* Daily History */}
                <div className="surface">
                <h3 style={{marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px'}}>Today's Purchases</h3>
                {dailyPurchaseHistory.length === 0 ? (
                    <div style={{padding: '16px 0', color: 'var(--text-muted)', fontSize: '14px'}}>No purchases today.</div>
                ) : (
                    dailyPurchaseHistory.map(item => (
                    <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)'}}>
                        <div>
                        <div style={{fontWeight: 500}}>{item.product_details}</div>
                        <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>{item.time} • {item.entry_type}</div>
                        </div>
                        <div style={{fontWeight: 600, color: 'var(--danger-color)'}}>₹{item.amount}</div>
                    </div>
                    ))
                )}
                </div>

                {/* Monthly History */}
                <div className="surface">
                <h3 style={{marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px'}}>Historical Records</h3>
                {monthlyPurchaseHistory.length === 0 ? (
                    <div style={{padding: '16px 0', color: 'var(--text-muted)', fontSize: '14px'}}>No past records.</div>
                ) : (
                    monthlyPurchaseHistory.map(item => (
                    <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)'}}>
                        <div>
                        <div style={{fontWeight: 500}}>{item.product_details}</div>
                        <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>{item.date} • {item.entry_type}</div>
                        </div>
                        <div style={{fontWeight: 600, color: 'var(--danger-color)'}}>₹{item.amount}</div>
                    </div>
                    ))
                )}
                </div>
            </div>
        </div>
    );
}
