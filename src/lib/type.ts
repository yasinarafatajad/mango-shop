export interface Mango {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  unit: string;
  image: string;
  descriptionBn: string;
  category: string;
  isPopular?: boolean;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'delivered';
  items: Mango[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  image: string;
  address?: string;
  joinDate: string;
}