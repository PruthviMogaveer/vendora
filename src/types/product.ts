
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  old_price?: number;
  images: string[];
  category: string;
  badge?: string;
  featured?: boolean;
  in_stock: boolean;
  variants?: ProductVariant[];
  vendor_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
}

export interface User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_vendor?: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  variant?: string;
}
