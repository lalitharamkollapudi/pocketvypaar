import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../mockApi';

export default function RegisterOwner() {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', gst: '', password: '', confirmPassword: '' });
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValid = formData.name && formData.email && formData.mobile.length === 10 && formData.gst && formData.password && formData.password === formData.confirmPassword && terms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      await api.registerShopOwner(formData);
      navigate('/otp-verification', { state: { mobile: formData.mobile, email: formData.email, type: 'shop_owner' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{minHeight: '100vh', padding: '20px'}}>
      <div className="surface fade-in" style={{width: '100%', maxWidth: '400px'}}>
        <h2 style={{marginTop: 0, textAlign: 'center'}}>Shop Owner Registration</h2>
        {error && <div style={{color: 'var(--danger-color)', marginBottom: '16px', fontSize: '14px', textAlign: 'center'}}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name (As per docs)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="tel" placeholder="Mobile Number (10 digits)" value={formData.mobile} onChange={e => { const val = e.target.value.replace(/\\D/g, ''); if (val.length <= 10) setFormData({...formData, mobile: val}); }} required />
          <div style={{textAlign: 'left'}}>
            <label style={{fontSize: '12px', color: 'var(--text-muted)'}}>Upload GST Certificate</label>
            <input type="file" onChange={e => setFormData({...formData, gst: e.target.files[0]})} required accept=".pdf,image/*" />
          </div>
          <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
          
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px'}}>
            <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} style={{width:'auto'}} />
            I agree to the Terms and Conditions
          </label>

          {!isValid && formData.mobile && formData.mobile.length > 0 && formData.mobile.length < 10 && (
            <div style={{color: 'var(--warning-color)', fontSize: '12px'}}>Mobile number must be exactly 10 digits.</div>
          )}
          {!isValid && formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <div style={{color: 'var(--warning-color)', fontSize: '12px'}}>Passwords do not match.</div>
          )}
          
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
