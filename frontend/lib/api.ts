import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import Cookie from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add token
apiClient.interceptors.request.use((config: any) => {
  const token = Cookie.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookie.remove('accessToken');
      Cookie.remove('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export const cartAPI = {
  getCart: async () => {
    const response = await apiClient.get('/cart');
    return response.data;
  },
  addToCart: async (productId: string, quantity: number) => {
    const response = await apiClient.post('/cart/add', { productId, quantity });
    return response.data;
  },
  removeFromCart: async (itemId: string) => {
    const response = await apiClient.delete(`/cart/items/${itemId}`);
    return response.data;
  },
  updateQuantity: async (itemId: string, quantity: number) => {
    const response = await apiClient.patch(`/cart/items/${itemId}`, { quantity });
    return response.data;
  }
};
