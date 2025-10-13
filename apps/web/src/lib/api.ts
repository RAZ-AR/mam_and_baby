import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  age?: string;
  size?: string;
  district: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: { id: string; name: string };
  photos: Photo[];
}

export interface ISO {
  id: string;
  title: string;
  description?: string;
  budget?: number;
  age?: string;
  size?: string;
  district?: string;
  daysValid: number;
  daysLeft?: number;
  expiresAt: string;
  createdAt: string;
  userId: string;
  user: { id: string; name: string };
}

export interface Photo {
  id: string;
  url: string;
  createdAt: string;
  listingId: string;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'IN_DELIVERY' | 'COMPLETED' | 'CANCELLED';
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  deliveryAddress?: string;
  deliveryDistrict?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  buyer: { id: string; name: string; email: string; phone?: string };
  seller: { id: string; name: string; email: string; phone?: string };
  listing: Listing;
  payment?: Payment;
}

export interface Payment {
  id: string;
  amount: number;
  method: 'CARD' | 'CASH' | 'BANK_TRANSFER';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  cardLastFour?: string;
  cardNumber?: string;
  transactionId?: string;
  createdAt: string;
  paidAt?: string;
  orderId: string;
}

// Auth API
export const authApi = {
  register: async (data: { email: string; password: string; name: string; phone?: string }) => {
    const response = await api.post<{ user: User; token: string }>('/auth/register', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post<{ user: User; token: string }>('/auth/login', data);
    return response.data;
  },
  me: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// Listings API
export const listingsApi = {
  getAll: async (filters?: {
    search?: string;
    district?: string;
    minPrice?: number;
    maxPrice?: number;
    age?: string;
    size?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.district) params.append('district', filters.district);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.age) params.append('age', filters.age);
    if (filters?.size) params.append('size', filters.size);

    const response = await api.get<Listing[]>(`/listings?${params.toString()}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Listing>(`/listings/${id}`);
    return response.data;
  },
  create: async (data: {
    title: string;
    description?: string;
    price: number;
    age?: string;
    size?: string;
    district: string;
  }) => {
    const response = await api.post<Listing>('/listings', data);
    return response.data;
  },
  getMyListings: async () => {
    const response = await api.get<Listing[]>('/listings/user/me');
    return response.data;
  },
};

// ISO API
export const isoApi = {
  getFeed: async () => {
    const response = await api.get<ISO[]>('/iso/feed');
    return response.data;
  },
  create: async (data: {
    title: string;
    description?: string;
    budget?: number;
    age?: string;
    size?: string;
    district?: string;
    daysValid?: number;
  }) => {
    const response = await api.post<ISO>('/iso', data);
    return response.data;
  },
  getMyISOs: async () => {
    const response = await api.get<ISO[]>('/iso/user/me');
    return response.data;
  },
};

// Upload API
export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post<{ url: string; filename: string }>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  uploadListingPhotos: async (listingId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('photos', file));
    const response = await api.post<Photo[]>(`/upload/listing/${listingId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Orders API
export const ordersApi = {
  create: async (data: {
    listingId: string;
    buyerName: string;
    buyerPhone: string;
    buyerEmail?: string;
    deliveryAddress?: string;
    deliveryDistrict?: string;
    notes?: string;
    payment: {
      method: 'CARD' | 'CASH' | 'BANK_TRANSFER';
      cardNumber?: string;
    };
  }) => {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },
  getMyPurchases: async () => {
    const response = await api.get<Order[]>('/orders/my-purchases');
    return response.data;
  },
  getMySales: async () => {
    const response = await api.get<Order[]>('/orders/my-sales');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },
  updateStatus: async (id: string, status: Order['status']) => {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },
};
