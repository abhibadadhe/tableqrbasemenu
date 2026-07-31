export type RoleMode = 'landing' | 'superadmin' | 'restaurant' | 'customer';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'one-time' | 'per year' | 'monthly';
  commissionRate: number; // e.g. 50% for Starter, 0% for White Label
  isWhiteLabel: boolean;
  ownDomain: boolean;
  ownServer: boolean;
  features: string[];
  badge?: string;
  onboardingFee?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string;
  bannerImage: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  password?: string;
  currency: string;
  themeColor: string;
  planId: 'starter' | 'pro' | 'business';
  status: 'active' | 'pending' | 'suspended';
  tablesCount: number;
  totalOrdersCount: number;
  totalRevenue: number;
  createdAt: string;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  icon?: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string[]; // e.g., ["Chaap", "Tandoor"], ["Paneer"], ["Bestseller"]
  isVeg: boolean;
  isAvailable: boolean;
  spicyLevel?: number; // 0 to 3
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  customNotes?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  tableNumber: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'placed' | 'preparing' | 'served' | 'completed';
  paymentStatus: 'pending' | 'paid';
  customerName?: string;
  createdAt: string;
}

export interface OfferBanner {
  id: string;
  restaurantId: string;
  title: string;
  code: string;
  discount: string;
  bgColor: string;
  active: boolean;
}
