import { useEffect } from 'react';

export default function Splash({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: 'white', zIndex: 9999
    }}>
      <div className="fire-animation" style={{ marginBottom: '20px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flame-icon">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
      </div>
      <div className="splash-logo" style={{fontSize: '40px', fontWeight: 'bold', marginBottom: '8px'}}>
        Pocket Vyapaar
      </div>
      <div className="splash-caption" style={{fontSize: '14px', letterSpacing: '1.5px', textTransform: 'lowercase', opacity: 0}}>
        Syncing Every Daily Deal
      </div>
      <div className="splash-footer" style={{position: 'absolute', bottom: '40px', fontSize: '12px', opacity: 0}}>
        presented by innovative bros
      </div>
    </div>
  );
}
