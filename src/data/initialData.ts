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

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-bistro-1',
    name: 'The Bistro',
    slug: 'the-bistro',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Authentic Tandoori & Fine Dining Delights',
    address: '45 Culinary Street, Food District, New Delhi',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    currency: '₹',
    themeColor: '#ff5722',
    planId: 'pro',
    status: 'active',
    tablesCount: 25,
    totalOrdersCount: 342,
    totalRevenue: 184500,
    createdAt: '2026-01-15'
  },
  {
    id: 'rest-tandoor-2',
    name: 'Spice & Flame Kitchen',
    slug: 'spice-and-flame',
    logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Authentic Indian Curry & Kebabs',
    address: '12 Connaught Place, New Delhi',
    phone: '+91 99887 76655',
    whatsapp: '+91 99887 76655',
    currency: '₹',
    themeColor: '#e91e63',
    planId: 'starter',
    status: 'active',
    tablesCount: 15,
    totalOrdersCount: 128,
    totalRevenue: 64200,
    createdAt: '2026-03-01'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-all', restaurantId: 'rest-bistro-1', name: 'All Menu' },
  { id: 'cat-tandoor', restaurantId: 'rest-bistro-1', name: 'Tandoor' },
  { id: 'cat-kurkure', restaurantId: 'rest-bistro-1', name: 'Kurkure Buck' },
  { id: 'cat-starters', restaurantId: 'rest-bistro-1', name: 'Starters' },
  { id: 'cat-drinks', restaurantId: 'rest-bistro-1', name: 'Beverages' }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    restaurantId: 'rest-bistro-1',
    categoryId: 'cat-tandoor',
    name: 'Malai Chaap Tikka Tandoori',
    price: 299,
    description: 'Soya chaap, served with a delicious mixture of cream and spices. Cooked to perfection in tandoor with onion and capsicum.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
    tags: ['Chaap', 'Tandoor'],
    isVeg: true,
    isAvailable: true,
    spicyLevel: 1
  },
  {
    id: 'item-2',
    restaurantId: 'rest-bistro-1',
    categoryId: 'cat-tandoor',
    name: 'Kasturi Paneer Tikka Tandoori',
    price: 249,
    description: 'Cottage cheese cubes, marinated with handpicked Indian spices and cooked to perfection in a tandoor with onion and capsicum.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
    tags: ['Paneer', 'Tandoor'],
    isVeg: true,
    isAvailable: true,
    spicyLevel: 2
  },
  {
    id: 'item-3',
    restaurantId: 'rest-bistro-1',
    categoryId: 'cat-kurkure',
    name: 'Crispy Kurkure Mushroom Bucket',
    price: 279,
    description: 'Fresh juicy mushrooms double coated with crunch crisps and deep fried. Served with mint chutney & garlic dip.',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80',
    tags: ['Kurkure', 'Chef Special'],
    isVeg: true,
    isAvailable: true,
    spicyLevel: 1
  },
  {
    id: 'item-4',
    restaurantId: 'rest-bistro-1',
    categoryId: 'cat-tandoor',
    name: 'Smoky Tandoori Chicken Wings',
    price: 349,
    description: 'Juicy chicken wings marinated in traditional yogurt & red chili tandoori spices, char-grilled over hot coals.',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80',
    tags: ['Chicken', 'Tandoor', 'Bestseller'],
    isVeg: false,
    isAvailable: true,
    spicyLevel: 3
  },
  {
    id: 'item-5',
    restaurantId: 'rest-bistro-1',
    categoryId: 'cat-starters',
    name: 'Dahi Ke Sholay Rolls',
    price: 219,
    description: 'Crispy fried bread rolls stuffed with spiced hung curd, bell peppers, green chilies, and fresh coriander.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    tags: ['Starters', 'Crispy'],
    isVeg: true,
    isAvailable: true,
    spicyLevel: 1
  },
  {
    id: 'item-6',
    restaurantId: 'rest-bistro-1',
    categoryId: 'cat-drinks',
    name: 'Masala Mint Kulhad Lassi',
    price: 99,
    description: 'Traditional thick churned sweet yogurt topped with malai, roasted cumin, fresh mint, and chopped pistachios in an earthen cup.',
    image: 'https://images.unsplash.com/photo-1571006682858-a458b8a69288?auto=format&fit=crop&w=600&q=80',
    tags: ['Beverages', 'Refreshing'],
    isVeg: true,
    isAvailable: true,
    spicyLevel: 0
  }
];

export const INITIAL_OFFERS: OfferBanner[] = [
  {
    id: 'offer-1',
    restaurantId: 'rest-bistro-1',
    title: '20% OFF on Starters',
    code: 'Start20',
    discount: '20% OFF',
    bgColor: 'linear-gradient(135deg, #ff5722 0%, #f44336 100%)',
    active: true
  },
  {
    id: 'offer-2',
    restaurantId: 'rest-bistro-1',
    title: 'Free Kulhad Lassi on Orders above ₹500',
    code: 'FREEDRINK',
    discount: 'FREE ITEM',
    bgColor: 'linear-gradient(135deg, #ff9800 0%, #ed6c02 100%)',
    active: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1092',
    restaurantId: 'rest-bistro-1',
    tableNumber: 12,
    items: [
      { menuItem: INITIAL_MENU_ITEMS[0], quantity: 1, customNotes: 'Make it extra spicy' },
      { menuItem: INITIAL_MENU_ITEMS[1], quantity: 1 }
    ],
    totalAmount: 548,
    status: 'preparing',
    paymentStatus: 'pending',
    customerName: 'Rahul M.',
    createdAt: '10 mins ago'
  },
  {
    id: 'ORD-1091',
    restaurantId: 'rest-bistro-1',
    tableNumber: 5,
    items: [
      { menuItem: INITIAL_MENU_ITEMS[3], quantity: 1 },
      { menuItem: INITIAL_MENU_ITEMS[5], quantity: 2 }
    ],
    totalAmount: 547,
    status: 'served',
    paymentStatus: 'paid',
    customerName: 'Priya S.',
    createdAt: '25 mins ago'
  }
];
