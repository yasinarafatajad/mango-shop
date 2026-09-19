import { Mango, Order, UserType } from "./type";

const API_URL = (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001') + "/api/v1";

interface ServerProduct {
  _id: string;
  title: string;
  description?: string;
  price: number;
  status: string;
  tags?: string[];
  images?: { url?: string }[];
  category?: { name?: string };
}

interface ServerOrderItem {
  product: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface ServerOrder {
  _id: string;
  createdAt: string;
  totalPrice: number;
  orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: ServerOrderItem[];
  [key: string]: unknown;
}

interface ServerCustomer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  address?: {
    street?: string;
    city?: string;
  };
  createdAt: string;
}

interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  url?: string;
  secure_url?: string;
  token?: string;
  user?: UserType;
  customer?: UserType;
  customers?: T;
  discount?: number;
}

// Mapper to convert server product to client Mango type
const mapProductToMango = (product: ServerProduct): Mango => ({
  id: product._id,
  name: product.title,
  nameBn: product.tags?.find((tag: string) => tag.startsWith('bn:'))?.replace('bn:', '') || product.title,
  price: product.price,
  unit: product.tags?.find((tag: string) => tag.startsWith('unit:'))?.replace('unit:', '') || 'কেজি',
  image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&h=400&auto=format&fit=crop',
  descriptionBn: product.description || '',
  category: product.category?.name || 'General',  
  isActive: product.status === 'active',
  sku: '',
  stock: 0,
  color: [],
  size: [],
  status: product.status === 'active' ? 'active' : 'draft',
  createdAt: new Date(),
  updatedAt: new Date()
});

export const fetchProducts = async (): Promise<Mango[]> => {
  const response = await fetch(`${API_URL}/AllProducts`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data: ServerProduct[] = await response.json();
  return data
    .filter((product: ServerProduct) => product.status === 'active')
    .map(mapProductToMango);
};

export const fetchProductById = async (id: string): Promise<Mango> => {
  const response = await fetch(`${API_URL}/Product/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  const data: ServerProduct = await response.json();
  return mapProductToMango(data);
};

export const fetchOrders = async (email?: string, phone?: string): Promise<Order[]> => {
  let url = `${API_URL}/getAllOrder`;
  const params = new URLSearchParams();
  if (email) params.append('email', email);
  if (phone) params.append('phone', phone);
  if (params.toString()) url += `?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    return [];
  }
  const data: ServerOrder[] = await response.json();
  return data.map((order: ServerOrder) => ({
    id: order._id,
    date: new Date(order.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
    total: order.totalPrice,
    status: order.orderStatus,
    items: order.items.map((item: ServerOrderItem) => ({
      id: item.product,
      _id: item.product,
      title: item.name,
      sku: '',
      category: '',
      images: [{ url: item.image || '' }],
      color: [],
      size: [],
      price: item.price,
      stock: item.quantity,
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  }));
};

export const fetchOrderById = async (id: string): Promise<ServerOrder> => {
  const response = await fetch(`${API_URL}/getOrder/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }
  const order: ServerOrder = await response.json();
  return {
    ...order,
    id: order._id,
    date: new Date(order.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
    total: order.totalPrice,
    status: order.orderStatus,
    items: order.items.map((item: ServerOrderItem) => ({
      ...item,
      id: item.product,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity
    }))
  };
};

export const fetchCustomerById = async (id: string): Promise<UserType> => {
  const response = await fetch(`${API_URL}/getCustomer/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch customer');
  }
  const customer: ServerCustomer = await response.json();
  return {
    id: customer._id,
    name: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    role: customer.role,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
    address: `${customer.address?.street || ''}, ${customer.address?.city || ''}`,
    joinDate: new Date(customer.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })
  };
};

export const fetchAllCustomers = async (): Promise<UserType[]> => {
  const response = await fetch(`${API_URL}/getAllCustomer`);
  if (!response.ok) {
    return [];
  }
  const data: ServerCustomer[] = await response.json();
  return data.map((customer: ServerCustomer) => ({
    id: customer._id,
    name: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    role: customer.role,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
    address: `${customer.address?.street || ''}, ${customer.address?.city || ''}`,
    joinDate: new Date(customer.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })
  }));
};

export const updateCustomer = async (id: string, customerData: Record<string, unknown>): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/updateCustomer/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(customerData),
  });
  const data: ApiResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update customer');
  }
  return data;
};

export const createOrder = async (orderData: Record<string, unknown>): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/addOrder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error('Failed to create order');
  }
  return await response.json();
};

export const applyCoupon = async (code: string, orderAmount: number): Promise<{ success: boolean; discount: number; message?: string }> => {
  const response = await fetch(`${API_URL}/coupon/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ code, orderAmount }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to apply coupon');
  }
  return data;
};

export const fetchActiveDeliveryCharges = async (): Promise<{ _id: string; name: string; charge: number }[]> => {
  const response = await fetch(`${API_URL}/deliveryCharges/active`);
  if (!response.ok) {
    throw new Error('Failed to fetch delivery charges');
  }
  return await response.json();
};

export const uploadImage = async (file: File, folder: string = 'orders'): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/upload?folder=${folder}`, {
    method: 'POST',
    body: formData,
  });

  const data: ApiResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Image upload failed');
  }
  return data;
};

// --- Authentication Endpoints ---

export const authSignup = async (userData: Record<string, unknown>): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  const data: ApiResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }
  return data;
};

export const authLogin = async (credentials: Record<string, unknown>): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  const data: ApiResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

export const authSearchCustomer = async (query: string): Promise<ApiResponse<Array<{ id: string; fullName: string; email?: string; phone?: string; image?: string; hasEmail?: boolean; hasPhone?: boolean }>>> => {
  const response = await fetch(`${API_URL}/auth/search-customer?query=${encodeURIComponent(query)}`);
  const data: ApiResponse<Array<{ id: string; fullName: string; email?: string; phone?: string; image?: string; hasEmail?: boolean; hasPhone?: boolean }>> = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Search failed');
  }
  return data;
};

export const authForgotPassword = async (customerId: string, method: 'email' | 'whatsapp'): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ customerId, method }),
  });
  const data: ApiResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Forgot password failed');
  }
  return data;
};

export const authChangePassword = async (passwordData: Record<string, unknown>): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(passwordData),
  });
  const data: ApiResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Change password failed');
  }
  return data;
};

export const authVerifyOtp = async (verifyData: { customerId: string, otp: string }): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(verifyData),
  });
  const data: ApiResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'OTP verification failed');
  }
  return data;
};

export const authResetPassword = async (resetData: { customerId: string, otp: string, newPassword: string }): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(resetData),
  });
  const data: ApiResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Reset password failed');
  }
  return data;
};
