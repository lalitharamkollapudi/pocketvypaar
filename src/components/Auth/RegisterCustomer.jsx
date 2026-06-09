import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../mockApi';

export default function RegisterCustomer() {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', govId: '', password: '', confirmPassword: '' });
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValid = formData.name && formData.email && formData.mobile.length === 10 && formData.govId && formData.password && formData.password === formData.confirmPassword && terms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      await api.registerCustomer(formData);
      navigate('/otp-verification', { state: { mobile: formData.mobile, email: formData.email, type: 'customer' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{minHeight: '100vh', padding: '20px'}}>
      <div className="surface fade-in" style={{width: '100%', maxWidth: '400px'}}>
        <h2 style={{marginTop: 0, textAlign: 'center'}}>Customer Registration</h2>
        {error && <div style={{color: 'var(--danger-color)', marginBottom: '16px', fontSize: '14px', textAlign: 'center'}}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="tel" placeholder="Mobile Number (10 digits)" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} pattern="[0-9]{10}" required />
          <input type="text" placeholder="Gov ID Number (Masked logic in backend)" value={formData.govId} onChange={e => setFormData({...formData, govId: e.target.value})} required />
          <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
          
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px'}}>
            <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} style={{width:'auto'}} />
            I agree to the Terms and Conditions
          </label>
          
          <button type="submit" className="primary" style={{width: '100%'}} disabled={!isValid || loading}>
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>
        <div style={{marginTop: '16px', textAlign: 'center', fontSize: '14px'}}>
          <Link to="/login" style={{color: 'var(--primary-color)', textDecoration: 'none'}}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
