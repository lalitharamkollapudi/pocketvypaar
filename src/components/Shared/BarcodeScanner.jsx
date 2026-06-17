import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function BarcodeScanner({ onScanSuccess, onScanError }) {
  const [scannerId] = useState(`qr-reader-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(scannerId, {
      qrbox: { width: 250, height: 150 },
      fps: 10,
    });

    const successCallback = (decodedText, decodedResult) => {
      // Avoid rapid continuous scanning
      scanner.pause(true);
      onScanSuccess(decodedText, () => scanner.resume());
    };

    scanner.render(successCallback, onScanError);

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [scannerId, onScanSuccess, onScanError]);

  return (
    <div className="barcode-scanner-container" style={{width: '100%', maxWidth: '500px', margin: '0 auto'}}>
      <div id={scannerId} style={{ width: '100%' }}></div>
    </div>
  );
}
