import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ScanLine, Camera, X, Image as ImageIcon, CheckCircle, Clock } from 'lucide-react';
import { api } from '../../mockApi';
import BarcodeScanner from '../Shared/BarcodeScanner';

export default function OwnerCustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState(null); // 'barcode' or 'camera'

  const [amount, setAmount] = useState('');
  const [sessionStatus, setSessionStatus] = useState(null); // null, 'pending', 'accepted'
  const [scanMessage, setScanMessage] = useState('');

  useEffect(() => {
    loadLedger();
    checkSessionStatus();
  }, [customerId]);

  useEffect(() => {
    let interval;
    if (sessionStatus === 'pending') {
      interval = setInterval(checkSessionStatus, 3000);
    }
    return () => clearInterval(interval);
  }, [sessionStatus]);

  const checkSessionStatus = async () => {
    try {
      const status = await api.getBillingSessionStatus('mockShopId', customerId);
      setSessionStatus(status);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestBilling = async () => {
    try {
      await api.requestBillingSession('mockShopId', customerId);
      setSessionStatus('pending');
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    if (transactionType === 'barcode' && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [transactionType]);

  const loadLedger = async () => {
    try {
      // Assuming a generic shopId for the demo. In a real app we'd get it from context.
      const data = await api.getLedger('mockShopId', customerId);
      setLedger(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuccess = async (barcode, resumeScan) => {
    setScanMessage('Processing...');
    try {
      await api.addScannedProductToLedger('mockShopId', customerId, barcode);
      setScanMessage(`Success! Added product.`);
      loadLedger();
      setTimeout(() => {
        setScanMessage('');
        resumeScan();
      }, 2000);
    } catch (e) {
      setScanMessage(`Error: ${e.message}`);
      setTimeout(() => {
        setScanMessage('');
        resumeScan();
      }, 3000);
    }
  };

  const handleCameraSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;
    
    await saveTransaction({
      entry_type: 'Camera Bill',
      product_details: 'Bill Upload',
      amount: Number(amount),
      bill_image_url: 'https://via.placeholder.com/150' // Mock image URL
    });
  };

  const saveTransaction = async (data) => {
    try {
      await api.addTransaction({
         shopId: 'mockShopId',
         customerId,
         ...data
      });
      setIsModalOpen(false);
      setTransactionType(null);
      setAmount('');
      loadLedger();
    } catch (e) {
      console.error(e);
    }
  };

  // Group ledger
  const today = new Date().toISOString().split('T')[0];
  const dailyPurchaseHistory = ledger.filter(l => l.date === today);
  const monthlyPurchaseHistory = ledger.filter(l => l.date !== today);

  return (
    <div className="fade-in" style={{paddingBottom: '80px'}}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '16px'}}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{padding: '8px', background: 'transparent', color: 'var(--text-main)'}}><ArrowLeft /></button>
        <h2 style={{margin: 0}}>Customer Ledger</h2>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '24px'}}>
        {/* Daily History */}
        <div className="surface">
          <h3 style={{marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px'}}>Today's Purchases</h3>
          {dailyPurchaseHistory.length === 0 ? (
            <div style={{padding: '16px 0', color: 'var(--text-muted)', fontSize: '14px'}}>No purchases today.</div>
          ) : (
            dailyPurchaseHistory.map(item => (
              <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)'}}>
                <div>
                  <div style={{fontWeight: 500}}>{item.product_details}</div>
                  <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>{item.time} • {item.entry_type}</div>
                </div>
                <div style={{fontWeight: 600, color: 'var(--danger-color)'}}>₹{item.amount}</div>
              </div>
            ))
          )}
        </div>

        {/* Monthly History */}
        <div className="surface">
          <h3 style={{marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px'}}>Previous Month's Aggregate</h3>
          {monthlyPurchaseHistory.length === 0 ? (
            <div style={{padding: '16px 0', color: 'var(--text-muted)', fontSize: '14px'}}>No past records.</div>
          ) : (
             monthlyPurchaseHistory.map(item => (
              <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)'}}>
                <div>
                  <div style={{fontWeight: 500}}>{item.product_details}</div>
                  <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>{item.date} • {item.entry_type}</div>
                </div>
                <div style={{fontWeight: 600, color: 'var(--danger-color)'}}>₹{item.amount}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Speed Dial / FAB */}
      {sessionStatus === 'accepted' ? (
        <button 
          className="primary flex-center"
          style={{position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px', borderRadius: '50%', boxShadow: '0 8px 16px rgba(59,130,246,0.4)', zIndex: 50}}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={24} />
        </button>
      ) : (
        <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', background: 'var(--surface-color)', borderTop: '1px solid var(--border-color)', zIndex: 40}}>
          {sessionStatus === 'pending' ? (
            <button className="primary" style={{width: '100%', opacity: 0.7}} disabled>
              <Clock size={16} style={{marginRight: '8px'}} /> Waiting for Customer Approval...
            </button>
          ) : (
            <button className="primary" style={{width: '100%'}} onClick={handleRequestBilling}>
              Request Bill Generation
            </button>
          )}
        </div>
      )}

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => {if(e.target === e.currentTarget) setIsModalOpen(false)}}>
          <div className="modal-content fade-in" style={{position: 'relative'}}>
            <button onClick={() => {setIsModalOpen(false); setTransactionType(null);}} style={{position: 'absolute', top: '16px', right: '16px', background: 'transparent', padding: '4px', color: 'var(--text-muted)'}}>
              <X size={20} />
            </button>
            <h3 style={{marginTop: 0}}>Create New Entry</h3>
            
            {!transactionType ? (
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px'}}>
                <div 
                  className="surface flex-center" 
                  style={{flexDirection: 'column', cursor: 'pointer', border: '1px solid var(--primary-color)', padding: '24px'}}
                  onClick={() => setTransactionType('barcode')}
                >
                  <ScanLine size={32} color="var(--primary-color)" style={{marginBottom: '12px'}} />
                  <span style={{fontSize: '14px', fontWeight: 500, textAlign: 'center'}}>Auto Scanner</span>
                </div>
                <div 
                  className="surface flex-center" 
                  style={{flexDirection: 'column', cursor: 'pointer', border: '1px solid var(--success-color)', padding: '24px'}}
                  onClick={() => setTransactionType('camera')}
                >
                  <Camera size={32} color="var(--success-color)" style={{marginBottom: '12px'}} />
                  <span style={{fontSize: '14px', fontWeight: 500, textAlign: 'center'}}>Camera Bill</span>
                </div>
              </div>
            ) : transactionType === 'barcode' ? (
              <div className="fade-in" style={{marginTop: '24px'}}>
                <p style={{fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px'}}>Scan a product barcode to add it to the ledger.</p>
                <BarcodeScanner onScanSuccess={handleScanSuccess} onScanError={() => {}} />
                
                {scanMessage && (
                  <div style={{marginTop: '16px', padding: '12px', background: scanMessage.includes('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: scanMessage.includes('Error') ? 'var(--danger-color)' : 'var(--success-color)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: 500}}>
                    {scanMessage}
                  </div>
                )}
                
                <button type="button" onClick={() => setTransactionType(null)} style={{width: '100%', marginTop: '24px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)'}}>Back</button>
              </div>
            ) : (
              <form onSubmit={handleCameraSubmit} className="space-y-4 fade-in" style={{marginTop: '24px'}}>
                 <div className="surface flex-center" style={{padding: '40px', borderStyle: 'dashed', borderColor: 'var(--border-color)', cursor: 'pointer', flexDirection: 'column'}}>
                    <ImageIcon size={32} color="var(--text-muted)" style={{marginBottom: '8px'}}/>
                    <span style={{fontSize: '12px', color: 'var(--text-muted)'}}>Tap to open Camera</span>
                 </div>
                 <input 
                  type="number" 
                  placeholder="Enter total bill amount (₹)" 
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required 
                />
                <button type="submit" className="primary" style={{width: '100%', background: 'var(--success-color)'}}>Save Bill Entry</button>
                <button type="button" onClick={() => setTransactionType(null)} style={{width: '100%', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)'}}>Back</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
