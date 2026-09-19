// export interface Mango {
//   id: string;
//   name: string;
//   nameBn: string;
//   price: number;
//   unit: string;
//   image: string;
//   descriptionBn: string;
//   category: string;
//   isActive?: boolean;
// }

export interface mangoImage {
  url: string;
  alt?: string;
}

export interface Mango {
  _id: string;
  title: string;
  name?: string;
  description?: string;
  sku: string;
  category: string; // References Category document
  images: mangoImage[];
  color: string[];
  size: string[];
  price: number;
  compareAtPrice?: number;
  stock: number;
  brand?: string;
  tags?: string[];
  rating?: number;
  featured?: boolean;
  features?: string[];
  status: "draft" | "active";
  createdAt: Date;
  updatedAt: Date;
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
