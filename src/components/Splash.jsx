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
      <div style={{ position: 'relative', width: '180px', height: '180px' }}>
        
        {/* SVG Rings with Razor Sharp Edges */}
        <svg viewBox="0 0 100 100" style={{position: 'absolute', width: '100%', height: '100%', overflow: 'visible'}}>
          <defs>
            <mask id="blueMask">
              <circle cx="45" cy="55" r="45" fill="white" />
              <circle cx="55" cy="45" r="41" fill="black" />
            </mask>
            <mask id="greyMask">
              <circle cx="55" cy="45" r="45" fill="white" />
              <circle cx="45" cy="55" r="41" fill="black" />
            </mask>
          </defs>

          {/* Dark Blue Crescent (Spins Clockwise) */}
          <g style={{ transformOrigin: '50% 50%', animation: 'spinIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, spinContinuous 3s linear infinite 1s' }}>
            <circle cx="45" cy="55" r="45" fill="#025274" mask="url(#blueMask)" />
            {/* Small circle at the thickest part of the blue crescent */}
            <circle cx="12" cy="80" r="4" fill="var(--bg-color)" stroke="#025274" strokeWidth="2.5" />
          </g>

          {/* Grey Crescent (Spins Counter-Clockwise) */}
          <g style={{ transformOrigin: '50% 50%', animation: 'spinReverseIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, spinReverseContinuous 3s linear infinite 1s' }}>
            <circle cx="55" cy="45" r="45" fill="#8a8a8a" mask="url(#greyMask)" />
            {/* Small circle at the thickest part of the grey crescent */}
            <circle cx="88" cy="20" r="4" fill="var(--bg-color)" stroke="#8a8a8a" strokeWidth="2.5" />
          </g>
        </svg>
        
        {/* Rupee Symbol */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '72px', fontWeight: 'bold', color: '#025274',
          opacity: showRupee ? 1 : 0,
          transform: showRupee ? 'scale(1)' : 'scale(0.3)',
          transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.5)'
        }}>
          ₹
        </div>
      </div>
      
      {/* Title sliding from borders */}
      <div style={{ 
        display: 'flex', marginTop: '32px', width: '100%', justifyContent: 'center', overflow: 'hidden' 
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
