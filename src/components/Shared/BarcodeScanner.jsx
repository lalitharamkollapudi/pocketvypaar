// src/components/Shared/BarcodeScanner.jsx
import React, { useState } from 'react';
import BarcodeReader from 'react-barcode-reader';

/**
 * Simple wrapper around react-barcode-reader.
 * Props:
 *   onScan: (code:string) => void   // called with the scanned barcode
 *   onError?: (err:Error) => void   // optional error handler
 */
export default function BarcodeScanner({ onScan, onError }) {
  const [scanning, setScanning] = useState(true);

  const handleScan = (code) => {
    setScanning(false);
    if (onScan) onScan(code);
  };

  const handleError = (err) => {
    console.error('Barcode scan error', err);
    if (onError) onError(err);
  };

  return (
    <div style={{ position: 'relative', width: '100%', paddingTop: '75%', background: '#000' }}>
      {scanning && (
        <BarcodeReader
          onError={handleError}
          onScan={handleScan}
          width={'100%'}
          height={'100%'}
        />
      )}
      {!scanning && (
        <button className="btn btn-primary" onClick={() => setScanning(true)} style={{ marginTop: '1rem' }}>
          Scan Again
        </button>
      )}
    </div>
  );
}
