import type { SubscriptionPlan, Restaurant, Category, MenuItem, OfferBanner, Order } from '../types';

export const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 0,
    onboardingFee: 1999,
    currency: '₹',
    billingCycle: 'one-time',
    commissionRate: 50,
    isWhiteLabel: false,
    ownDomain: false,
    ownServer: false,
    features: [
      'Our Branding on Menus',
      'Hosted on Our Subdomain',
      '50% Commission on Each Restaurant Order/Fee',
      'Basic Digital QR Menu Builder',
      'Up to 10 Tables',
      'Standard Support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 6999,
    currency: '₹',
    billingCycle: 'per year',
    commissionRate: 0,
    isWhiteLabel: true,
    ownDomain: true,
    ownServer: true,
    badge: 'MOST POPULAR',
    features: [
      '100% Your Own Branding',
      'Hosted On Your Own Domain & Server',
      '0% Commission (100% Profit is Yours)',
      'Unlimited Menu Items & Categories',
      'Unlimited Tables & QR Stands',
      'Custom Offers & Banners Engine',
      'Live Order Tracking Dashboard',
      'WhatsApp Order Notifications'
    ]
  },
  {
    id: 'business',
    name: 'Business Plan',
    price: 24999,
    currency: '₹',
    billingCycle: 'one-time',
    commissionRate: 0,
    isWhiteLabel: true,
    ownDomain: true,
    ownServer: true,
    badge: 'FULL CODEBASE',
    features: [
      'Everything in Pro Plan',
      'Complete Source Code Included',
      'Self-Hosted Infrastructure',
      'Custom Payment Gateway Integration',
      '100% White Label Reseller Rights',
      'VIP Priority 24/7 Support',
      'Free Lifetime Core Updates'
    ]
  }
];

export const INITIAL_RESTAURANTS: Restaurant[] = [];
export const INITIAL_CATEGORIES: Category[] = [];
export const INITIAL_MENU_ITEMS: MenuItem[] = [];
export const INITIAL_OFFERS: OfferBanner[] = [];
export const INITIAL_ORDERS: Order[] = [];
