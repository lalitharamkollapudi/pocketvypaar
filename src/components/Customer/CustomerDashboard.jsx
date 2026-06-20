import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, MapPin, Store, Bell, Check, X, Moon, Sun, Settings, LogOut } from 'lucide-react';
import { api } from '../../mockApi';

export default function CustomerDashboard({ user }) {
  const [shops, setShops] = useState([]);
  const [requests, setRequests] = useState([]);
  const [billingRequests, setBillingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('pocketvyapaar_currentUser');
    window.location.href = '/';
  };

  useEffect(() => {
    loadShops();
  }, [user]);

  const loadShops = async () => {
    try {
      const data = await api.getShopsForCustomer(user.id);
      setShops(data);
      const pendingReqs = await api.getPendingRequests(user.id);
      setRequests(pendingReqs);
      const pendingBilling = await api.getPendingBillingSessions(user.id);
      setBillingRequests(pendingBilling);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (reqId) => {
    try {
      await api.acceptLinkRequest(reqId);
      loadShops(); // Refresh shops and requests
    } catch(e) {
      console.error(e);
    }
  };

  const handleAcceptBillingSession = async (sessionId) => {
    try {
      await api.acceptBillingSession(sessionId);
      loadShops(); // Refresh requests
    } catch(e) {
      console.error(e);
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
        <div style={{display: 'flex', gap: '8px', alignItems: 'center', position: 'relative'}}>
          <button onClick={() => setShowNotifications(true)} className="icon-btn" style={{background: 'transparent', border: 'none', position: 'relative', color: 'var(--text-main)', padding: '8px', display: 'flex'}}>
            <Bell size={24} />
            {(requests.length > 0 || billingRequests.length > 0) && (
              <span style={{position: 'absolute', top: 4, right: 4, width: '10px', height: '10px', background: 'var(--danger-color)', borderRadius: '50%'}}></span>
            )}
          </button>
          
          <button onClick={toggleTheme} className="icon-btn" style={{background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '8px', display: 'flex'}}>
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
          
          <button onClick={() => setShowSettings(!showSettings)} className="icon-btn" style={{background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '8px', display: 'flex'}}>
            <Settings size={24} />
          </button>

          {showSettings && (
            <div className="surface fade-in" style={{position: 'absolute', top: '50px', right: '0', width: '200px', padding: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 20}}>
              <h4 style={{margin: '0 0 16px 0'}}>Settings</h4>
              <button onClick={handleLogout} style={{width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--danger-color)', padding: '8px 0', cursor: 'pointer', fontSize: '16px'}}>
                <LogOut size={20} />
                Sign Out / Log Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="modal-overlay" onClick={() => setShowNotifications(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h3 style={{margin: 0}}>Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="icon-btn"><X size={20}/></button>
            </div>
            
            {(requests.length === 0 && billingRequests.length === 0) ? (
              <div style={{textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0'}}>No new notifications.</div>
            ) : (
              <div className="space-y-4">
                {/* Connection Requests */}
                {requests.map(req => (
                  <div key={req.id} style={{padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <div style={{fontWeight: 600, fontSize: '14px'}}>{req.shopName}</div>
                      <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>{req.ownerName} wants to connect.</div>
                    </div>
                    <button onClick={() => handleAcceptRequest(req.id)} className="primary" style={{padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px'}}>
                      <Check size={14} /> Accept
                    </button>
                  </div>
                ))}
                
                {/* Billing Session Requests */}
                {billingRequests.map(req => (
                  <div key={req.id} style={{padding: '12px', border: '1px solid var(--primary-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(59,130,246,0.05)'}}>
                    <div>
                      <div style={{fontWeight: 600, fontSize: '14px', color: 'var(--primary-color)'}}>Bill Generating...</div>
                      <div style={{fontSize: '13px', color: 'var(--text-main)', marginTop: '4px'}}>
                        The bill is generating by <strong>{req.ownerName}</strong> - {req.ownerMobile}
                      </div>
                    </div>
                    <button onClick={() => handleAcceptBillingSession(req.id)} className="primary" style={{width: '100%', padding: '8px', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'}}>
                      <Check size={16} /> Accept
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
