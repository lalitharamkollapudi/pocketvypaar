import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '../../mockApi';

export default function RegisterOwner() {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', gst: null, password: '', confirmPassword: '', location: null });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGetLocation = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setFormData(prev => ({...prev, location: { lat: pos.coords.latitude, lng: pos.coords.longitude }}));
        setLocationLoading(false);
      },
      err => {
        alert("Failed to get location: " + err.message);
        setLocationLoading(false);
      }
    );
  };

  const isValid = formData.name && formData.email && formData.mobile.length === 10 && formData.gst && formData.password && formData.password === formData.confirmPassword && terms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      await api.registerShopOwner(formData);
      navigate('/otp-verification', { state: { mobile: formData.mobile, email: formData.email, type: 'owner' } });
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
          <img src="/logo.png" alt="Pocket Vyapaar Logo" style={{width: '100px', height: '100px', objectFit: 'contain', borderRadius: '50%'}} />
        </div>
        <h2 style={{marginTop: 0, textAlign: 'center'}}>Register Shop</h2>
        {error && <div style={{color: 'var(--danger-color)', marginBottom: '16px', fontSize: '14px', textAlign: 'center'}}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name (As per docs)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="tel" placeholder="Mobile Number (10 digits)" value={formData.mobile} onChange={e => { const val = e.target.value.replace(/\D/g, ''); if (val.length <= 10) setFormData({...formData, mobile: val}); }} required />
          <div style={{textAlign: 'left'}}>
            <label style={{fontSize: '12px', color: 'var(--text-muted)'}}>Upload GST Certificate</label>
            <input type="file" onChange={e => setFormData({...formData, gst: e.target.files[0]})} required accept=".pdf,image/*" />
          </div>
          
          <div style={{textAlign: 'left'}}>
            <label style={{fontSize: '12px', color: 'var(--text-muted)'}}>Shop Location</label>
            {formData.location ? (
              <div style={{color: 'var(--success-color)', fontSize: '14px', marginTop: '4px'}}>Location captured successfully!</div>
            ) : (
              <button type="button" onClick={handleGetLocation} disabled={locationLoading} style={{width: '100%', marginTop: '4px', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)'}}>
                {locationLoading ? 'Getting Location...' : 'Get Current Location (Required)'}
              </button>
            )}
          </div>
          
          <div style={{position: 'relative'}}>
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={{paddingRight: '40px'}} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex'}}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div style={{position: 'relative'}}>
            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required style={{paddingRight: '40px'}} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex'}}>
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
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
          
          <div style={{fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center'}}>
            By registering, you agree to our <Link to="/terms" style={{color: 'var(--primary-color)'}}>Terms & Conditions</Link>
          </div>
          <button type="submit" className="primary" style={{width: '100%'}} disabled={!isValid || loading}>
            {loading ? 'Sending OTP...' : 'Register as Shop Owner'}
          </button>
        </form>
        <div style={{marginTop: '16px', textAlign: 'center', fontSize: '14px'}}>
          <Link to="/login" style={{color: 'var(--primary-color)', textDecoration: 'none'}}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
