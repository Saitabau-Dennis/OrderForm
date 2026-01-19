export interface IUser {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  stock: number;
  category?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  storeId: string;
  isAvailable?: boolean;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: Array<{
    productId: string | IProduct;
    productName: string;
    quantity: number;
    price: number;
    variant?: string;
  }>;
  createdAt: string;
  storeId: string;
}

export interface IStore {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  userId: string;
  currency: string;
  whatsappNumber: string;
  theme?: string;
  createdAt: string;
  configured: boolean;
}

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
};
