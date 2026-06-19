import { useEffect, useState } from 'react';

export default function Splash({ onComplete }) {
  const [showRupee, setShowRupee] = useState(false);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    // Rings spin immediately
    // Rupee symbol pops in after 1.2s
    const t1 = setTimeout(() => setShowRupee(true), 1200);
    // Text slides in after 2.0s
    const t2 = setTimeout(() => setShowName(true), 2000);
    // Splash screen completes after 4.5s
    const timer = setTimeout(() => onComplete(), 4500);
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
      zIndex: 9999, overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', width: '250px', height: '250px' }}>
        
        <svg viewBox="0 0 200 200" width="100%" height="100%" style={{position: 'absolute', top: 0, left: 0}}>
          <defs>
            <linearGradient id="blueGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#026388" />
              <stop offset="100%" stopColor="#013f5a" />
            </linearGradient>
            <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b0b5b9" />
              <stop offset="100%" stopColor="#8c9296" />
            </linearGradient>

            <mask id="blueMask">
              <rect x="0" y="0" width="200" height="200" fill="white" />
              <circle cx="120" cy="100" r="85" fill="black" />
            </mask>
            
            <mask id="silverMask">
              <rect x="0" y="0" width="200" height="200" fill="white" />
              <circle cx="80" cy="100" r="85" fill="black" />
            </mask>
          </defs>

          {/* Blue Ring (Left) - Spins Clockwise */}
          <g style={{
            transformOrigin: '100px 100px',
            animation: 'spinIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, spinContinuous 3s linear infinite 1s'
          }}>
            <g transform="rotate(30 100 100)">
              <circle cx="100" cy="100" r="75" fill="url(#blueGrad)" mask="url(#blueMask)" />
              {/* Bottom tip circle (8 o'clock in logo) */}
              <circle cx="70" cy="168.7" r="7" fill="var(--bg-color)" stroke="url(#blueGrad)" strokeWidth="3.5" />
            </g>
          </g>

          {/* Silver Ring (Right) - Spins Anti-Clockwise */}
          <g style={{
            transformOrigin: '100px 100px',
            animation: 'spinReverseIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, spinReverseContinuous 3s linear infinite 1s'
          }}>
            <g transform="rotate(30 100 100)">
              <circle cx="100" cy="100" r="75" fill="url(#silverGrad)" mask="url(#silverMask)" />
              {/* Top tip circle (2 o'clock in logo) */}
              <circle cx="130" cy="31.3" r="7" fill="var(--bg-color)" stroke="url(#silverGrad)" strokeWidth="3.5" />
            </g>
          </g>
        </svg>

        {/* Exact Logo Rupee Symbol */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'url(/logo_transparent.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          clipPath: 'circle(18% at 50% 45%)',
          opacity: showRupee ? 1 : 0,
          transform: showRupee ? 'scale(1)' : 'scale(0.3)',
          transformOrigin: '50% 45%',
          transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.5)'
        }} />
      </div>
      
      {/* Title sliding from borders */}
      <div style={{ 
        display: 'flex', marginTop: '-15px', width: '100%', justifyContent: 'center', overflow: 'hidden' 
      }}>
        <span style={{
          color: '#025274', fontWeight: '800', fontSize: '28px', letterSpacing: '3px',
          transform: showName ? 'translateX(0)' : 'translateX(-100vw)',
          transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}>POCKET</span>
        <span style={{
          color: '#8a8a8a', fontWeight: '800', fontSize: '28px', letterSpacing: '3px',
          transform: showName ? 'translateX(0)' : 'translateX(100vw)',
          transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}>VYAPAAR</span>
      </div>

      {/* Footer Text */}
      <div style={{
        position: 'absolute', bottom: '40px',
        fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase',
        color: '#8a8a8a', fontWeight: '600',
        opacity: showName ? 1 : 0,
        transform: showName ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s'
      }}>
        presented by innovative bros
      </div>
    </div>
  );
}
