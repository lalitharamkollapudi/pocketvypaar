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
