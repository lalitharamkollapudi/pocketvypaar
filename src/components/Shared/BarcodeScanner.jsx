import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function BarcodeScanner({ onScanSuccess, onScanError }) {
  const [scannerId] = useState(`qr-reader-${Math.random().toString(36).substring(2, 9)}`);
  const callbacksRef = React.useRef({ onScanSuccess, onScanError });

  useEffect(() => {
    callbacksRef.current = { onScanSuccess, onScanError };
  }, [onScanSuccess, onScanError]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(scannerId, {
      qrbox: { width: 250, height: 150 },
      fps: 10,
    }, false);

    const successCallback = (decodedText, decodedResult) => {
      scanner.pause(true);
      if (callbacksRef.current.onScanSuccess) {
        callbacksRef.current.onScanSuccess(decodedText, () => scanner.resume());
      }
    };

    scanner.render(successCallback, (err) => {
      if (callbacksRef.current.onScanError) callbacksRef.current.onScanError(err);
    });

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [scannerId]);

  return (
    <div className="barcode-scanner-container" style={{width: '100%', maxWidth: '500px', margin: '0 auto'}}>
      <div id={scannerId} style={{ width: '100%' }}></div>
    </div>
  );
}
