// Mock Database Schema and API

// Mock Database Schema and API

const loadData = (key, defaultVal) => {
  try {
    const val = localStorage.getItem('pocketvyapaar_' + key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const saveData = () => {
  localStorage.setItem('pocketvyapaar_users', JSON.stringify(users));
  localStorage.setItem('pocketvyapaar_shops', JSON.stringify(shops));
  localStorage.setItem('pocketvyapaar_transactions', JSON.stringify(transactions));
  localStorage.setItem('pocketvyapaar_linkRequests', JSON.stringify(linkRequests));
  localStorage.setItem('pocketvyapaar_billingSessions', JSON.stringify(billingSessions));
};

let users = loadData('users', []);
let shops = loadData('shops', []);
let transactions = loadData('transactions', []);
let linkRequests = loadData('linkRequests', []);
let billingSessions = loadData('billingSessions', []);
let mockProducts = [
  { barcode: '123456789', name: 'Parle-G Biscuits', price: 10, category: 'Snacks' },
  { barcode: '987654321', name: 'Amul Butter 100g', price: 54, category: 'Dairy' },
  { barcode: '111111111', name: 'Tata Salt 1kg', price: 25, category: 'Groceries' },
  { barcode: '222222222', name: 'Maggi Noodles', price: 14, category: 'Snacks' },
  { barcode: '333333333', name: 'Aashirvaad Atta 5kg', price: 250, category: 'Groceries' }
];

const generateId = () => Math.random().toString(36).substr(2, 9);

let nextOtp = '1234'; // Default fallback

export const api = {
  // Authentication & Registration
  registerShopOwner: async (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const existing = users.find(u => u.mobile === data.mobile);
        if (existing) return reject(new Error('Mobile number already exists'));
        
        const newUser = {
          id: 'shop_' + generateId(),
          role: 'shop_owner',
          ...data
        };
        users.push(newUser);
        saveData();
        
        // Create an implicit shop for this owner
        shops.push({
          id: 'store_' + generateId(),
          ownerId: newUser.id,
          name: `${newUser.name}'s Shop`,
          location: { lat: 19.0760, lng: 72.8777, address: 'Mock Address, Mumbai' }
        });
        saveData();
        
        // Generate random 4 digit OTP
        nextOtp = Math.floor(1000 + Math.random() * 9000).toString();
        try {
            const apiUrl = import.meta.env.PROD ? '/api/send-otp' : 'http://localhost:3001/api/send-otp';
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: data.mobile, email: data.email, otp: nextOtp })
            });
        } catch(e) { console.error('OTP email server not running?', e); }
        
        resolve({ success: true, user: newUser });
      }, 800);
    });
  },

  registerCustomer: async (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const existing = users.find(u => u.mobile === data.mobile);
        if (existing) return reject(new Error('Mobile number already exists'));
        
        const newUser = {
          id: 'cust_' + generateId(),
          role: 'customer',
          ...data
        };
        users.push(newUser);
        saveData();
        
        nextOtp = Math.floor(1000 + Math.random() * 9000).toString();
        try {
            const apiUrl = import.meta.env.PROD ? '/api/send-otp' : 'http://localhost:3001/api/send-otp';
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: data.mobile, email: data.email, otp: nextOtp })
            });
        } catch(e) { console.error('OTP email server not running?', e); }
        
        resolve({ success: true, user: newUser });
      }, 800);
    });
  },

  verifyOtp: async (mobile, otp) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: otp === nextOtp || otp === '1234' }), 500);
    });
  },

  resendOtp: async (mobile, email) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        nextOtp = Math.floor(1000 + Math.random() * 9000).toString();
        try {
            const apiUrl = import.meta.env.PROD ? '/api/send-otp' : 'http://localhost:3001/api/send-otp';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, email, otp: nextOtp })
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Email server failed');
            }
            resolve({ success: true });
        } catch(e) { 
            console.error('OTP email server not running?', e); 
            reject(new Error(e.message || 'Failed to send OTP'));
        }
      }, 500);
    });
  },

  login: async (identifier, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const id = identifier.trim().toLowerCase();
        const pwd = password.trim();
        const user = users.find(u => 
          ((u.mobile && u.mobile.trim() === id) || (u.email && u.email.trim().toLowerCase() === id)) && 
          u.password === pwd
        );
        if (user) resolve(user);
        else reject(new Error('Invalid credentials'));
      }, 500);
    });
  },

  requestPasswordReset: async (identifier) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const user = users.find(u => u.mobile === identifier || u.email === identifier);
        if (!user) return reject(new Error('No account found with that email or mobile number'));
        
        nextOtp = Math.floor(1000 + Math.random() * 9000).toString();
        try {
            const apiUrl = import.meta.env.PROD ? '/api/send-otp' : 'http://localhost:3001/api/send-otp';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: user.mobile, email: user.email, otp: nextOtp })
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Email server failed');
            }
            resolve({ success: true, email: user.email, mobile: user.mobile });
        } catch(e) { 
            reject(new Error(e.message || 'Failed to send OTP'));
        }
      }, 500);
    });
  },

  resetPassword: async (identifier, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = users.findIndex(u => u.mobile === identifier || u.email === identifier);
        if (userIndex !== -1) {
          users[userIndex].password = newPassword;
          saveData();
          resolve({ success: true });
        } else {
          reject(new Error('User not found'));
        }
      }, 500);
    });
  },

  // Shop Owner Dashboard
  getCustomersForShop: async (shopOwnerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const acceptedLinks = linkRequests.filter(lr => lr.shopOwnerId === shopOwnerId && lr.status === 'accepted');
        const customerIds = acceptedLinks.map(lr => lr.customerId);
        const linkedCustomers = users.filter(u => customerIds.includes(u.id));
        resolve(linkedCustomers);
      }, 500);
    });
  },

  // Customer Dashboard
  getShopsForCustomer: async (customerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const acceptedLinks = linkRequests.filter(lr => lr.customerId === customerId && lr.status === 'accepted');
        const ownerIds = acceptedLinks.map(lr => lr.shopOwnerId);
        const linkedShops = shops.filter(shop => ownerIds.includes(shop.ownerId));
        
        const shopsWithOwnerDetails = linkedShops.map(shop => {
          const owner = users.find(u => u.id === shop.ownerId);
          return {
             ...shop,
             ownerName: owner?.name || 'Unknown',
             ownerMobile: owner?.mobile || 'N/A'
          };
        });
        resolve(shopsWithOwnerDetails);
      }, 500);
    });
  },

  // Notifications & Linking
  sendLinkRequest: async (shopOwnerId, customerName, customerMobile) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const customer = users.find(u => u.mobile === customerMobile && u.role === 'customer');
        if (!customer) return reject(new Error('Customer has no account. Please ask them to register first.'));
        
        const existing = linkRequests.find(lr => lr.shopOwnerId === shopOwnerId && lr.customerId === customer.id);
        if (existing) {
            if (existing.status === 'pending') return reject(new Error('A pending request already exists for this customer.'));
            if (existing.status === 'accepted') return reject(new Error('This customer is already in your ledger.'));
        }

        linkRequests.push({
            id: 'req_' + generateId(),
            shopOwnerId,
            customerId: customer.id,
            status: 'pending'
        });
        saveData();
        resolve({ success: true });
      }, 500);
    });
  },

  getPendingRequests: async (customerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pending = linkRequests.filter(lr => lr.customerId === customerId && lr.status === 'pending');
        const enriched = pending.map(req => {
            const owner = users.find(u => u.id === req.shopOwnerId);
            const shop = shops.find(s => s.ownerId === req.shopOwnerId);
            return {
                ...req,
                shopName: shop?.name || 'A Shop',
                ownerName: owner?.name || 'Shop Owner'
            };
        });
        resolve(enriched);
      }, 500);
    });
  },

  acceptLinkRequest: async (requestId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const req = linkRequests.find(lr => lr.id === requestId);
        if (!req) return reject(new Error('Request not found'));
        req.status = 'accepted';
        saveData();
        resolve({ success: true });
      }, 500);
    });
  },

  // Transactions Ledger
  addTransaction: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTransaction = {
          id: 'txn_' + generateId(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          ...data
        };
        transactions.push(newTransaction);
        saveData();
        resolve(newTransaction);
      }, 500);
    });
  },

  getLedger: async (shopId, customerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ledger = transactions.filter(t => t.shopId === shopId && t.customerId === customerId);
        resolve(ledger);
      }, 500);
    });
  },

  // Secure Barcode Billing Workflow
  requestBillingSession: async (shopOwnerId, customerId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if an active/pending session already exists
        const existing = billingSessions.find(s => s.shopOwnerId === shopOwnerId && s.customerId === customerId && (s.status === 'pending' || s.status === 'accepted'));
        if (existing) {
          if (existing.status === 'pending') return reject(new Error('A pending bill request already exists. Waiting for customer approval.'));
          if (existing.status === 'accepted') return reject(new Error('A billing session is already active.'));
        }

        const newSession = {
          id: 'session_' + generateId(),
          shopOwnerId,
          customerId,
          status: 'pending',
          timestamp: new Date().toISOString()
        };
        billingSessions.push(newSession);
        saveData();
        resolve(newSession);
      }, 300);
    });
  },

  getPendingBillingSessions: async (customerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pending = billingSessions.filter(s => s.customerId === customerId && s.status === 'pending');
        const enriched = pending.map(session => {
          const owner = users.find(u => u.id === session.shopOwnerId);
          const shop = shops.find(s => s.ownerId === session.shopOwnerId);
          return {
            ...session,
            shopName: shop?.name || 'A Shop',
            ownerName: owner?.name || 'Shop Owner',
            ownerMobile: owner?.mobile || 'Unknown'
          };
        });
        resolve(enriched);
      }, 300);
    });
  },

  acceptBillingSession: async (sessionId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const session = billingSessions.find(s => s.id === sessionId);
        if (!session) return reject(new Error('Session not found'));
        session.status = 'accepted';
        saveData();
        resolve({ success: true });
      }, 300);
    });
  },

  getBillingSessionStatus: async (shopOwnerId, customerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const session = billingSessions.find(s => s.shopOwnerId === shopOwnerId && s.customerId === customerId && (s.status === 'pending' || s.status === 'accepted'));
        resolve(session ? session.status : null);
      }, 300);
    });
  },

  addScannedProductToLedger: async (shopOwnerId, customerId, barcode) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verify active session
        const session = billingSessions.find(s => s.shopOwnerId === shopOwnerId && s.customerId === customerId && s.status === 'accepted');
        if (!session) return reject(new Error('No active approved billing session with this customer.'));

        // Lookup product
        const product = mockProducts.find(p => p.barcode === barcode);
        if (!product) return reject(new Error(`Unrecognized barcode: ${barcode}`));

        // Add transaction
        const newTransaction = {
          id: 'txn_' + generateId(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          shopId: shops.find(s => s.ownerId === shopOwnerId)?.id,
          customerId,
          amount: product.price,
          type: 'purchase',
          description: `Scanned: ${product.name}`,
          barcode: product.barcode
        };
        transactions.push(newTransaction);
        saveData();
        resolve(newTransaction);
      }, 300);
    });
  }
};
