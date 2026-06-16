import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Store, User } from 'lucide-react';
import { api } from '../../mockApi';

export default function Login({ setUser }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="surface fade-in" style={{width: '100%', maxWidth: '450px'}}>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '16px'}}>
          <img src="/logo.png" alt="Pocket Vyapaar Logo" style={{width: '120px', height: '120px', objectFit: 'contain', borderRadius: '50%'}} />
        </div>
        <p style={{color: 'var(--text-muted)', textAlign: 'center'}}>Login to your account</p>
        
        {error && <div style={{color: 'var(--danger-color)', marginBottom: '16px', fontSize: '14px', textAlign: 'center'}}>{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label style={{fontSize: '14px', marginBottom: '8px', display: 'block'}}>Email or Mobile Number</label>
            <input type="text" value={mobile} onChange={e => setMobile(e.target.value)} required placeholder="Email or 10 digit mobile" />
          </div>
          <div>
            <label style={{fontSize: '14px', marginBottom: '8px', display: 'block'}}>Password</label>
            <div style={{position: 'relative'}}>
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={{paddingRight: '40px'}} />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex'}}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div style={{textAlign: 'right'}}>
            <Link to="/forgot-password" style={{color: 'var(--primary-color)', fontSize: '14px', textDecoration: 'none'}}>Forgot Password?</Link>
          </div>
          <button type="submit" className="primary" style={{width: '100%'}} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={{marginTop: '32px'}}>
          <p style={{color: 'var(--text-muted)', textAlign: 'center', fontSize: '14px', marginBottom: '16px'}}>Don't have an account? Register below</p>
          <div style={{display: 'flex', gap: '16px'}}>
            <div onClick={() => navigate('/register-customer')} style={{flex: 1, padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'}} className="hover-lift">
              <User size={32} color="var(--primary-color)" style={{marginBottom: '8px'}} />
              <div style={{fontWeight: 'bold', fontSize: '14px'}}>Customer</div>
            </div>
            <div onClick={() => navigate('/register-owner')} style={{flex: 1, padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'}} className="hover-lift">
              <Store size={32} color="var(--success-color)" style={{marginBottom: '8px'}} />
              <div style={{fontWeight: 'bold', fontSize: '14px'}}>Shop Owner</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
