import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../mockApi';

export default function OtpVerification() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile;
  const email = location.state?.email;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  if (!mobile) {
    navigate('/login');
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.verifyOtp(mobile, otp);
      if (res.success) {
         // OTP verified, let them login
         navigate('/login');
      } else {
         setError('Invalid OTP. Please check your email.');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setLoading(true);
    setError('');
    try {
      await api.resendOtp(mobile, email);
      setTimer(60);
      setError('A new OTP has been sent to your email.');
    } catch (err) {
      setError('Failed to resend OTP. Make sure the backend server.js is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{minHeight: '100vh', padding: '20px'}}>
      <div className="surface fade-in" style={{width: '100%', maxWidth: '400px'}}>
        <h2 style={{marginTop: 0, textAlign: 'center'}}>Verify OTP</h2>
        <p style={{color: 'var(--text-muted)', textAlign: 'center', fontSize: '14px'}}>
          Sent to {mobile}. <br />
          <span style={{color: 'var(--primary-color)'}}>Please check your inbox at {email || 'your email'}</span>
        </p>
        {error && <div style={{color: 'var(--danger-color)', marginBottom: '16px', fontSize: '14px', textAlign: 'center'}}>{error}</div>}
        
        <form onSubmit={handleVerify} className="space-y-4">
          <input type="text" placeholder="Enter OTP from Email" value={otp} onChange={e => setOtp(e.target.value)} maxLength={4} required style={{textAlign: 'center', letterSpacing: '4px', fontSize: '24px'}} />
          
          <button type="submit" className="primary" style={{width: '100%'}} disabled={otp.length !== 4 || loading}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div style={{marginTop: '24px', textAlign: 'center', fontSize: '14px'}}>
          <p style={{color: 'var(--text-muted)'}}>Didn't receive the email?</p>
          <button 
            onClick={handleResend} 
            disabled={timer > 0 || loading}
            style={{
              background: 'transparent', 
              border: 'none', 
              color: timer > 0 ? 'var(--text-muted)' : 'var(--primary-color)', 
              textDecoration: timer > 0 ? 'none' : 'underline',
              padding: 0,
              fontSize: '14px'
            }}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
