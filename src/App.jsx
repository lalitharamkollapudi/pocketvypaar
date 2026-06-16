import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Auth/Login';
import RegisterOwner from './components/Auth/RegisterOwner';
import RegisterCustomer from './components/Auth/RegisterCustomer';
import OtpVerification from './components/Auth/OtpVerification';
import ForgotPassword from './components/Auth/ForgotPassword';
import Terms from './components/Terms';
import OwnerDashboard from './components/Owner/OwnerDashboard';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import Splash from './components/Splash';

function App() {
  const [user, setUser] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
  };

  return (
    <BrowserRouter>
      {showSplash && <Splash onComplete={() => setShowSplash(false)} />}
      <div className="app-container" style={{maxWidth: '100vw', minHeight: '100vh'}}>
        <Routes>
          <Route path="/" element={<Navigate to={user ? (user.role === 'shop_owner' ? '/owner/dashboard' : '/customer/dashboard') : '/login'} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register-owner" element={<RegisterOwner />} />
          <Route path="/register-customer" element={<RegisterCustomer />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms" element={<Terms />} />
          
          <Route path="/owner/dashboard/*" element={
            <ProtectedRoute role="shop_owner">
              <OwnerDashboard user={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/customer/dashboard/*" element={
            <ProtectedRoute role="customer">
              <CustomerDashboard user={user} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
