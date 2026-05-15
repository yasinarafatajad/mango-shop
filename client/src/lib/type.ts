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
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: Mango[];
}

export interface UserType {
  id: string;
  _id?: string;
  name?: string;
  fullName?: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  image: string;
  address?: string | {
    street?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    country?: string;
  };
  joinDate?: string;
  createdAt?: string;
}
