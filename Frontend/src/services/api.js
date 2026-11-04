// Client-side API Service

const API_BASE = 'http://localhost:5000/api';

function getAuthHeader() {
  const token = localStorage.getItem('snt_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getCartSessionId() {
  let sessionId = localStorage.getItem('snt_cart_session');
  if (!sessionId) {
    sessionId = 'pos-session-' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('snt_cart_session', sessionId);
  }
  return sessionId;
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'x-cart-session': getCartSessionId(),
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  // Auth
  auth: {
    async login(email, password) {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.token) {
        localStorage.setItem('snt_auth_token', data.token);
        localStorage.setItem('snt_user', JSON.stringify(data.user));
      }
      return data;
    },
    async me() {
      return await request('/auth/me');
    },
    logout() {
      localStorage.removeItem('snt_auth_token');
      localStorage.removeItem('snt_user');
    },
    getUser() {
      const u = localStorage.getItem('snt_user');
      return u ? JSON.parse(u) : null;
    },
    getToken() {
      return localStorage.getItem('snt_auth_token');
    }
  },

  // Products
  products: {
    async getPublic(params = {}) {
      const query = new URLSearchParams(params).toString();
      return await request(`/products?${query}`);
    },
    async getById(id) {
      return await request(`/products/${id}`);
    },
    async getAdmin(params = {}) {
      const query = new URLSearchParams(params).toString();
      return await request(`/products/admin/all?${query}`);
    },
    async getDashboard() {
      return await request('/products/admin/dashboard');
    },
    async create(productData) {
      return await request('/products/admin/create', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    },
    async update(id, productData) {
      return await request(`/products/admin/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    },
    async delete(id) {
      return await request(`/products/admin/${id}`, {
        method: 'DELETE',
      });
    },
    async toggleVisibility(id) {
      return await request(`/products/admin/${id}/visibility`, {
        method: 'PATCH',
      });
    },
    async addUnit(productId, unitData) {
      return await request(`/products/admin/${productId}/units`, {
        method: 'POST',
        body: JSON.stringify(unitData),
      });
    },
    async deleteUnit(unitId) {
      return await request(`/products/admin/units/${unitId}`, {
        method: 'DELETE',
      });
    }
  },

  // POS Cart
  cart: {
    async get() {
      return await request('/cart');
    },
    async add(item) {
      return await request('/cart/add', {
        method: 'POST',
        body: JSON.stringify(item),
      });
    },
    async updateItem(itemId, data) {
      return await request(`/cart/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    async removeItem(itemId) {
      return await request(`/cart/items/${itemId}`, {
        method: 'DELETE',
      });
    },
    async clear() {
      return await request('/cart/clear', {
        method: 'DELETE',
      });
    }
  },

  // Bills & Invoices
  bills: {
    async getNextInvoiceNo() {
      return await request('/bills/next-number');
    },
    async getAll(params = {}) {
      const query = new URLSearchParams(params).toString();
      return await request(`/bills?${query}`);
    },
    async getById(id) {
      return await request(`/bills/${id}`);
    },
    async getByInvoiceNo(invoiceNo) {
      return await request(`/bills/invoice/${invoiceNo}`);
    },
    async generate(billData) {
      return await request('/bills/generate', {
        method: 'POST',
        body: JSON.stringify(billData),
      });
    }
  },

  // Customers
  customers: {
    async search(q) {
      return await request(`/customers/search?q=${encodeURIComponent(q)}`);
    }
  },

  // Shop Settings
  shop: {
    async getSettings() {
      return await request('/shop/settings');
    },
    async updateSettings(data) {
      return await request('/shop/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  }
};
