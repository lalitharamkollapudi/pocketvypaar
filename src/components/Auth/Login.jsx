import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../mockApi';

export default function Login({ setUser }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await api.login(mobile, password);
      setUser(user);
      if(user.role === 'shop_owner') navigate('/owner/dashboard');
      else navigate('/customer/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{minHeight: '100vh', padding: '20px'}}>
      <div className="surface fade-in" style={{width: '100%', maxWidth: '400px'}}>
        <h2 style={{marginTop: 0, textAlign: 'center'}}>Kirana Khata IoT</h2>
        <p style={{color: 'var(--text-muted)', textAlign: 'center'}}>Login to your account</p>
        
        {error && <div style={{color: 'var(--danger-color)', marginBottom: '16px', fontSize: '14px', textAlign: 'center'}}>{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label style={{fontSize: '14px', marginBottom: '8px', display: 'block'}}>Mobile Number</label>
            <input type="tel" value={mobile} onChange={e => { const val = e.target.value.replace(/\\D/g, ''); if (val.length <= 10) setMobile(val); }} required placeholder="10 digit mobile" />
          </div>
          <div>
            <label style={{fontSize: '14px', marginBottom: '8px', display: 'block'}}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <div style={{textAlign: 'right'}}>
            <Link to="#" style={{color: 'var(--primary-color)', fontSize: '14px', textDecoration: 'none'}}>Forgot Password?</Link>
          </div>
          <button type="submit" className="primary" style={{width: '100%'}} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={{marginTop: '24px', textAlign: 'center', fontSize: '14px'}}>
          <p style={{color: 'var(--text-muted)'}}>Don't have an account?</p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px'}}>
            <Link to="/register-owner" style={{color: 'var(--primary-color)', textDecoration: 'none'}}>Register as Shop</Link>
            <Link to="/register-customer" style={{color: 'var(--primary-color)', textDecoration: 'none'}}>Register as Customer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
