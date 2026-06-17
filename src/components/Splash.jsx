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
      <div style={{ position: 'relative', width: '160px', height: '160px' }}>
        
        {/* Dark Blue Ring */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          border: '12px solid transparent',
          borderTopColor: '#025274',
          borderLeftColor: '#025274',
          borderRadius: '50%',
          animation: 'spinIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, spinContinuous 3s linear infinite 1s'
        }}>
          {/* Small circle at tip */}
          <div style={{
            position: 'absolute', bottom: '15px', left: '15px', width: '14px', height: '14px',
            borderRadius: '50%', border: '3px solid #025274', background: 'var(--bg-color)'
          }} />
        </div>
        
        {/* Grey Ring */}
        <div style={{
          position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px',
          border: '12px solid transparent',
          borderBottomColor: '#8a8a8a',
          borderRightColor: '#8a8a8a',
          borderRadius: '50%',
          animation: 'spinReverseIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, spinReverseContinuous 3s linear infinite 1s'
        }}>
          {/* Small circle at tip */}
          <div style={{
            position: 'absolute', top: '10px', right: '10px', width: '14px', height: '14px',
            borderRadius: '50%', border: '3px solid #8a8a8a', background: 'var(--bg-color)'
          }} />
        </div>
        
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
