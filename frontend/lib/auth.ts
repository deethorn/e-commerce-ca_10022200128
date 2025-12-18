import apiClient from './api';
import Cookie from 'js-cookie';

export const authAPI = {
  register: async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      firstName,
      lastName
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password
    });
    
    // Store tokens
    Cookie.set('accessToken', response.data.accessToken);
    Cookie.set('refreshToken', response.data.refreshToken);
    
    return response.data;
  },

  logout: () => {
    Cookie.remove('accessToken');
    Cookie.remove('refreshToken');
  },

  refresh: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    Cookie.set('accessToken', response.data.accessToken);
    return response.data;
  }
};

export const productAPI = {
  getProducts: async (params?: any) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  }
};

export const cartAPI = {
  getCart: async () => {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  addToCart: async (productId: string, quantity: number) => {
    const response = await apiClient.post('/cart/items', {
      productId,
      quantity
    });
    return response.data;
  },

  removeFromCart: async (itemId: string) => {
    await apiClient.delete(`/cart/items/${itemId}`);
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const response = await apiClient.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  }
};

export const orderAPI = {
  createOrder: async (items: any[], shippingAddress: string) => {
    const response = await apiClient.post('/orders', {
      items,
      shippingAddress
    });
    return response.data;
  },

  getOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },
   uploadPaymentProof: async (orderId: string, paymentProof: string, paymentMethod: string) => {
    const response = await apiClient.post(`/orders/${orderId}/payment`, {
      paymentProof,
      paymentMethod
    });
    return response.data;
  }
};
