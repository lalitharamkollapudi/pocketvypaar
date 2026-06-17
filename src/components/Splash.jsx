import { useEffect, useState } from 'react';

export default function Splash({ onComplete }) {
  const [showRupee, setShowRupee] = useState(false);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowRupee(true), 1200);
    const t2 = setTimeout(() => setShowName(true), 2000);
    const timer = setTimeout(() => onComplete(), 4000);
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
      zIndex: 9999
    }}>
      <div style={{ position: 'relative', width: '250px', height: '250px' }}>
        
        {/* Rings: Mask out the center rupee and the bottom text, then spin */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'url(/logo.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transformOrigin: '50% 45%', // Approximate center of the rings
          clipPath: 'polygon(0 0, 100% 0, 100% 78%, 0 78%)', // Hide text
          maskImage: 'radial-gradient(circle at 50% 45%, transparent 18%, black 19%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 45%, transparent 18%, black 19%)',
          animation: 'spinIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, spinContinuous 3s linear infinite 1s'
        }} />
        
        {/* Rupee Symbol: Isolate the center */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'url(/logo.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          clipPath: 'circle(18% at 50% 45%)',
          opacity: showRupee ? 1 : 0,
          transform: showRupee ? 'scale(1)' : 'scale(0)',
          transformOrigin: '50% 45%',
          transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }} />
        
        {/* Text: Isolate the bottom */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'url(/logo.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          clipPath: 'polygon(0 78%, 100% 78%, 100% 100%, 0 100%)',
          opacity: showName ? 1 : 0,
          transform: showName ? 'translateY(0)' : 'translateY(-15px)',
          transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }} />
      </div>
      
      <div style={{
        fontSize: '14px', letterSpacing: '1.5px', textTransform: 'lowercase',
        color: 'var(--text-main)',
        opacity: showName ? 0.7 : 0,
        transform: showName ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s',
        marginTop: '-10px'
      }}>
        Syncing Every Daily Deal
      </div>
    </div>
  );
}
