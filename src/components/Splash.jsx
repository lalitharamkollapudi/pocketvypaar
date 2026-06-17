import { useEffect, useState } from 'react';

export default function Splash({ onComplete }) {
  const [showRupee, setShowRupee] = useState(false);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowRupee(true), 800);
    const t2 = setTimeout(() => setShowName(true), 1600);
    const timer = setTimeout(() => onComplete(), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'var(--bg-color)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-main)', zIndex: 9999
    }}>
      <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '32px' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          border: '8px solid transparent',
          borderTopColor: '#025274',
          borderRightColor: '#025274',
          borderRadius: '50%',
          animation: 'spinIn 0.8s ease-out forwards, spinContinuous 2s linear infinite 0.8s'
        }} />
        
        <div style={{
          position: 'absolute', top: '16px', left: '16px', right: '16px', bottom: '16px',
          border: '8px solid transparent',
          borderBottomColor: '#8a8a8a',
          borderLeftColor: '#8a8a8a',
          borderRadius: '50%',
          animation: 'spinReverseIn 0.8s ease-out forwards, spinReverseContinuous 2s linear infinite 0.8s'
        }} />
        
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '48px', fontWeight: 'bold', color: '#025274',
          opacity: showRupee ? 1 : 0,
          transform: showRupee ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          ₹
        </div>
      </div>
      
      <div style={{
        fontSize: '28px', fontWeight: 'bold', color: 'var(--text-main)',
        opacity: showName ? 1 : 0,
        transform: showName ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        Pocket Vyapaar
      </div>
      <div style={{
        fontSize: '14px', letterSpacing: '1.5px', textTransform: 'lowercase',
        opacity: showName ? 0.7 : 0,
        transform: showName ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s',
        marginTop: '8px'
      }}>
        Syncing Every Daily Deal
      </div>
    </div>
  );
}
