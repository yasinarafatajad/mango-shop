import { Mango, Order, UserType } from "./type";

const API_URL = process.env.NEXT_PUBLIC_API_URL+"/api/v1" || 'http://localhost:3001/api/v1';

// Mapper to convert server product to client Mango type
const mapProductToMango = (product: any): Mango => ({
  id: product._id,
  name: product.title,
  nameBn: product.tags?.find((tag: string) => tag.startsWith('bn:'))?.replace('bn:', '') || product.title,
  price: product.price,
  unit: product.tags?.find((tag: string) => tag.startsWith('unit:'))?.replace('unit:', '') || 'কেজি',
  image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&h=400&auto=format&fit=crop',
  descriptionBn: product.description || '',
  category: product.category?.name || 'General',
  isPopular: product.isActive || false,
});

export const fetchProducts = async (): Promise<Mango[]> => {
  const response = await fetch(`${API_URL}/AllProducts`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  return data.map(mapProductToMango);
};

export const fetchProductById = async (id: string): Promise<Mango> => {
  const response = await fetch(`${API_URL}/Product/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  const data = await response.json();
  return mapProductToMango(data);
};

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/getAllOrder`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  // Server returns a list of orders directly for getAllOrder
  return data.map((order: any) => ({
    id: order._id,
    date: new Date(order.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
    total: order.totalPrice,
    status: order.orderStatus,
    items: order.items.map((item: any) => ({
      id: item.product,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity
    }))
  }));
};

export const fetchOrderById = async (id: string): Promise<any> => {
  const response = await fetch(`${API_URL}/getOrder/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }
  const order = await response.json();
  return {
    ...order,
    id: order._id,
    date: new Date(order.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
    total: order.totalPrice,
    status: order.orderStatus,
    items: order.items.map((item: any) => ({
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
  const customer = await response.json();
  return {
    id: customer._id,
    name: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    role: customer.role as 'admin' | 'customer',
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
  const data = await response.json();
  return data.map((customer: any) => ({
    id: customer._id,
    name: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    role: customer.role as 'admin' | 'customer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
    address: `${customer.address?.street || ''}, ${customer.address?.city || ''}`,
    joinDate: new Date(customer.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })
  }));
};

export const createOrder = async (orderData: any): Promise<any> => {
  const response = await fetch(`${API_URL}/addOrder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error('Failed to create order');
  }
  return await response.json();
};

export const applyCoupon = async (code: string, orderAmount: number): Promise<any> => {
  const response = await fetch(`${API_URL}/coupon/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, orderAmount }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to apply coupon');
  }
  return data;
};

export const fetchActiveDeliveryCharges = async (): Promise<any[]> => {
  const response = await fetch(`${API_URL}/deliveryCharges/active`);
  if (!response.ok) {
    throw new Error('Failed to fetch delivery charges');
  }
  return await response.json();
};

export const uploadImage = async (file: File, folder: string = 'orders'): Promise<any> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/upload?folder=${folder}`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Image upload failed');
  }
  return data;
};

// --- Authentication Endpoints ---

export const authSignup = async (userData: any): Promise<any> => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }
  return data;
};

export const authLogin = async (credentials: any): Promise<any> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

export const authForgotPassword = async (email: string, newPassword?: string): Promise<any> => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // The server expects email and newPassword
    body: JSON.stringify({ email, newPassword }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Forgot password failed');
  }
  return data;
};

export const authChangePassword = async (passwordData: any): Promise<any> => {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // The server expects email, oldPassword, newPassword
    body: JSON.stringify(passwordData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Change password failed');
  }
  return data;
};

