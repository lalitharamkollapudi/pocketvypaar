import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '../../mockApi';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.requestPasswordReset(identifier);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.verifyOtp(otp);
      if (res.success) {
        setStep(3);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await api.resetPassword(identifier, password);
      // Automatically login after reset
      const user = await api.login(identifier, password);
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
        <h2 style={{marginTop: 0, textAlign: 'center'}}>Reset Password</h2>
        
        {error && <div style={{color: 'var(--danger-color)', marginBottom: '16px', fontSize: '14px', textAlign: 'center'}}>{error}</div>}
        
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4 fade-in">
            <p style={{color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center'}}>Enter your registered email or mobile number to receive an OTP.</p>
            <div>
              <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} required placeholder="Email or Mobile Number" />
            </div>
            <button type="submit" className="primary" style={{width: '100%'}} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 fade-in">
            <p style={{color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center'}}>Enter the 4-digit OTP sent to your email.</p>
            <div>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} maxLength={4} required placeholder="4 Digit OTP" style={{textAlign: 'center', letterSpacing: otp ? '12px' : 'normal', fontSize: '24px'}} />
            </div>
            <button type="submit" className="primary" style={{width: '100%'}} disabled={loading || otp.length !== 4}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4 fade-in">
            <p style={{color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center'}}>Create a new password for your account.</p>
            
            <div style={{position: 'relative'}}>
              <input type={showPassword ? "text" : "password"} placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} required style={{paddingRight: '40px'}} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex'}}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div style={{position: 'relative'}}>
              <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{paddingRight: '40px'}} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex'}}>
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <button type="submit" className="primary" style={{width: '100%'}} disabled={loading || !password || password !== confirmPassword}>
              {loading ? 'Resetting...' : 'Reset & Login'}
            </button>
          </form>
        )}
        
        <div style={{marginTop: '24px', textAlign: 'center', fontSize: '14px'}}>
          <Link to="/login" style={{color: 'var(--primary-color)', textDecoration: 'none'}}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
