export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ApiProduct {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  rating: number;
  image_url: string;
  is_active: boolean;
  category: Category | null;
}

export interface ProductListResponse {
  page: number;
  size: number;
  total: number;
  items: ApiProduct[];
}

export interface ApiUser {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: ApiUser;
}

export interface ApiCartItem {
  product_id: number;
  product_name: string;
  slug: string;
  image_url: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  stock: number;
}

export interface ApiCart {
  items: ApiCartItem[];
  subtotal: number;
}

export interface ApiAddress {
  id: number;
  title: string;
  city: string;
  district: string;
  line1: string;
  postal_code: string | null;
}

export interface CreateAddressRequest {
  title: string;
  city: string;
  district: string;
  line1: string;
  postal_code?: string;
}

export interface ApiOrderItem {
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface ApiOrder {
  id: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  payment_status: 'simulated' | 'failed';
  total_amount: number;
  shipping_address: string;
  created_at: string;
  items: ApiOrderItem[];
}

export interface ApiProblemDetails {
  detail?: string;
  title?: string;
  status?: number;
}
