// Mock Database Schema and API

let users = [];
let shops = [];
let transactions = [];

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
        
        // Create an implicit shop for this owner
        shops.push({
          id: 'store_' + generateId(),
          ownerId: newUser.id,
          name: `${newUser.name}'s Shop`,
          location: { lat: 19.0760, lng: 72.8777, address: 'Mock Address, Mumbai' }
        });
        
        // Generate random 4 digit OTP
        nextOtp = Math.floor(1000 + Math.random() * 9000).toString();
        try {
            await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: data.mobile, email: data.email, otp: nextOtp })
            });
        } catch(e) { console.error('Local OTP email server not running?', e); }
        
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
        
        nextOtp = Math.floor(1000 + Math.random() * 9000).toString();
        try {
            await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: data.mobile, email: data.email, otp: nextOtp })
            });
        } catch(e) { console.error('Local OTP email server not running?', e); }
        
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
            const res = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, email, otp: nextOtp })
            });
            if (!res.ok) throw new Error('Email server failed');
            resolve({ success: true });
        } catch(e) { 
            console.error('Local OTP email server not running?', e); 
            reject(new Error('Failed to send OTP'));
        }
      }, 500);
    });
  },

  login: async (mobile, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.mobile === mobile && u.password === password);
        if (user) resolve(user);
        else reject(new Error('Invalid credentials'));
      }, 500);
    });
  },

  // Shop Owner Dashboard
  getCustomersForShop: async (shopOwnerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock linked customers
        const linkedCustomers = users.filter(u => u.role === 'customer');
        resolve(linkedCustomers);
      }, 500);
    });
  },

  // Customer Dashboard
  getShopsForCustomer: async (customerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const linkedShops = shops;
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
  }
};
