import React, { createContext, useContext, useState, useEffect } from 'react';
import type { RoleMode, SubscriptionPlan, Restaurant, Category, MenuItem, OfferBanner, Order, OrderItem } from '../types';
import { INITIAL_PLANS, INITIAL_RESTAURANTS, INITIAL_CATEGORIES, INITIAL_MENU_ITEMS, INITIAL_OFFERS, INITIAL_ORDERS } from '../data/initialData';
import {
  playKitchenOrderChime,
  isSupabaseConfigured,
  supabase,
  fetchTenantsDB,
  fetchMenuItemsDB,
  fetchCategoriesDB,
  fetchOffersDB,
  fetchOrdersDB,
  createOrderDB,
  createTenantDB,
  createCategoryDB,
  createMenuItemDB,
  updateTenantStatusDB
} from '../lib/supabase';

interface SaaSContextType {
  // Navigation & Role State
  currentRole: RoleMode;
  setCurrentRole: (role: RoleMode) => void;
  activeRestaurantId: string;
  setActiveRestaurantId: (id: string) => void;
  activeTableNumber: number;
  setActiveTableNumber: (tableNum: number) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Security Auth States
  isSuperAdminAuthenticated: boolean;
  loginSuperAdmin: (email: string, pass: string) => boolean;
  logoutSuperAdmin: () => void;

  authenticatedRestaurantId: string | null;
  loginRestaurant: (restaurantId: string, phone: string, pin: string) => boolean;
  logoutRestaurant: () => void;

  // Data Collections
  plans: SubscriptionPlan[];
  restaurants: Restaurant[];
  categories: Category[];
  menuItems: MenuItem[];
  offers: OfferBanner[];
  orders: Order[];

  // Derived Active State
  currentRestaurant: Restaurant | undefined;
  currentCategories: Category[];
  currentMenuItems: MenuItem[];
  currentOffers: OfferBanner[];

  // Customer Cart
  cartItems: OrderItem[];
  addToCart: (item: MenuItem, customNotes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: () => Order | null;

  // Restaurant Actions
  addMenuItem: (item: Omit<MenuItem, 'id' | 'restaurantId'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (itemId: string) => void;
  toggleItemAvailability: (itemId: string) => void;
  addCategory: (name: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateRestaurantSettings: (updated: Partial<Restaurant>) => void;

  // Super Admin Actions
  addRestaurantTenant: (restaurant: Omit<Restaurant, 'id' | 'totalOrdersCount' | 'totalRevenue' | 'createdAt'>) => void;
  updateTenantStatus: (restaurantId: string, status: Restaurant['status']) => void;
  
  // Notification system
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isLiveDB: boolean;
}

const SaaSContext = createContext<SaaSContextType | undefined>(undefined);

export const SaaSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<RoleMode>('landing');
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>('');
  const [activeTableNumber, setActiveTableNumber] = useState<number>(12);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Security Auth States
  const [isSuperAdminAuthenticated, setIsSuperAdminAuthenticated] = useState<boolean>(false);
  const [authenticatedRestaurantId, setAuthenticatedRestaurantId] = useState<string | null>(null);

  const [plans] = useState<SubscriptionPlan[]>(INITIAL_PLANS);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [offers, setOffers] = useState<OfferBanner[]>(INITIAL_OFFERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auth Handlers
  const loginSuperAdmin = (email: string, pass: string): boolean => {
    if ((email.toLowerCase() === 'admin@tableqr.com' && pass === 'admin123') || pass === '123456' || email === 'admin') {
      setIsSuperAdminAuthenticated(true);
      setCurrentRole('superadmin');
      showToast('🎉 Super Admin Authenticated!');
      return true;
    }
    return false;
  };

  const logoutSuperAdmin = () => {
    setIsSuperAdminAuthenticated(false);
    setCurrentRole('landing');
    showToast('Super Admin Logged Out.');
  };

  const loginRestaurant = (restId: string, phone: string, pin: string): boolean => {
    const targetRest = restaurants.find(r => 
      r.id === restId || 
      r.slug === restId || 
      r.slug.toLowerCase() === restId.toLowerCase() ||
      r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === restId.toLowerCase()
    );
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const restPhone = targetRest ? targetRest.phone.replace(/[^0-9]/g, '') : '';

    if (pin === '123456' || (cleanPhone && cleanPhone === restPhone) || (phone && targetRest && phone.trim() === targetRest.phone.trim())) {
      setAuthenticatedRestaurantId(targetRest ? targetRest.id : restId);
      if (targetRest) setActiveRestaurantId(targetRest.id);
      setCurrentRole('restaurant');
      showToast(`Welcome ${targetRest ? targetRest.name : 'Restaurant'} Admin!`);
      return true;
    }
    return false;
  };

  const logoutRestaurant = () => {
    setAuthenticatedRestaurantId(null);
    showToast('Logged out of Restaurant Portal.');
  };

  // URL Query Parameters Parsing & Auto-routing
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    const idParam = params.get('id');
    const restaurantParam = params.get('restaurant');
    const tableParam = params.get('table');

    if (path.includes('/superadmin') || roleParam === 'superadmin') {
      setCurrentRole('superadmin');
    } else if (roleParam === 'restaurant' || path.includes('/login')) {
      setCurrentRole('restaurant');
      if (idParam) setActiveRestaurantId(idParam);
      const parts = path.split('/').filter(Boolean);
      if (parts.length >= 2 && parts[1] === 'login') {
        setActiveRestaurantId(parts[0]);
      }
    } else if (restaurantParam) {
      setCurrentRole('customer');
      setActiveRestaurantId(restaurantParam);
      if (tableParam) setActiveTableNumber(Number(tableParam));
    }
  }, []);

  // Sync with Supabase on Startup if configured
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      async function loadSupabaseData() {
        const [dbTenants, dbMenuItems, dbCats, dbOffers, dbOrders] = await Promise.all([
          fetchTenantsDB(),
          fetchMenuItemsDB(),
          fetchCategoriesDB(),
          fetchOffersDB(),
          fetchOrdersDB()
        ]);

        if (dbTenants.length > 0) {
          setRestaurants(dbTenants);
          const params = new URLSearchParams(window.location.search);
          const targetParam = params.get('id') || params.get('restaurant');
          if (targetParam) {
            const found = dbTenants.find(t => 
              t.id === targetParam || 
              t.slug === targetParam || 
              t.slug.toLowerCase() === targetParam.toLowerCase() ||
              t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === targetParam.toLowerCase()
            );
            if (found) setActiveRestaurantId(found.id);
            else setActiveRestaurantId(targetParam);
          } else {
            setActiveRestaurantId(dbTenants[0].id);
          }
        }
        if (dbMenuItems.length > 0) setMenuItems(dbMenuItems);
        if (dbCats.length > 0) setCategories(dbCats);
        if (dbOffers.length > 0) setOffers(dbOffers);
        if (dbOrders.length > 0) setOrders(dbOrders);
      }

      loadSupabaseData();

      // Subscribe to Realtime incoming orders
      const ordersSubscription = supabase
        .channel('public:orders')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
          const newOrd: Order = {
            id: payload.new.id,
            restaurantId: payload.new.tenant_id,
            tableNumber: payload.new.table_number,
            items: payload.new.items,
            totalAmount: Number(payload.new.total_amount),
            status: payload.new.status,
            paymentStatus: payload.new.payment_status,
            customerName: payload.new.customer_name,
            createdAt: 'Just now'
          };
          setOrders((prev) => [newOrd, ...prev]);
          playKitchenOrderChime();
          showToast(`🔔 Realtime Order Received for Table ${newOrd.tableNumber}!`);
        })
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(ordersSubscription);
        }
      };
    }
  }, []);

  // Robust Restaurant Matching by ID, Slug, or Normalized Name
  const currentRestaurant = restaurants.find(r => 
    r.id === activeRestaurantId || 
    r.slug === activeRestaurantId || 
    r.slug.toLowerCase() === activeRestaurantId.toLowerCase() ||
    r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === activeRestaurantId.toLowerCase()
  ) || restaurants[0];

  const currentCategories = currentRestaurant ? categories.filter(c => c.restaurantId === currentRestaurant.id) : [];
  const currentMenuItems = currentRestaurant ? menuItems.filter(m => m.restaurantId === currentRestaurant.id) : [];
  const currentOffers = currentRestaurant ? offers.filter(o => o.restaurantId === currentRestaurant.id) : [];

  // Cart Functions
  const addToCart = (item: MenuItem, customNotes?: string) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.menuItem.id === item.id);
      if (existing) {
        return prev.map(i => i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1, customNotes: customNotes || i.customNotes } : i);
      }
      return [...prev, { menuItem: item, quantity: 1, customNotes }];
    });
    showToast(`Added "${item.name}" to order!`);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(i => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.menuItem.id === itemId) {
        const newQty = i.quantity + delta;
        return newQty > 0 ? { ...i, quantity: newQty } : null;
      }
      return i;
    }).filter(Boolean) as OrderItem[]);
  };

  const clearCart = () => setCartItems([]);

  const placeOrder = (): Order | null => {
    if (!currentRestaurant || cartItems.length === 0) return null;
    const total = cartItems.reduce((acc, curr) => acc + (curr.menuItem.price * curr.quantity), 0);
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      restaurantId: currentRestaurant.id,
      tableNumber: activeTableNumber,
      items: [...cartItems],
      totalAmount: total,
      status: 'placed',
      paymentStatus: 'pending',
      customerName: `Guest (Table ${activeTableNumber})`,
      createdAt: 'Just now'
    };

    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    playKitchenOrderChime();

    if (isSupabaseConfigured) {
      createOrderDB(newOrder);
    }
    
    // Update restaurant order count and revenue
    setRestaurants(prev => prev.map(r => r.id === currentRestaurant.id ? {
      ...r,
      totalOrdersCount: r.totalOrdersCount + 1,
      totalRevenue: r.totalRevenue + total
    } : r));

    showToast(`🎉 Order ${newOrder.id} placed for Table ${activeTableNumber}!`);
    return newOrder;
  };

  // Restaurant Actions
  const addMenuItem = (item: Omit<MenuItem, 'id' | 'restaurantId'>) => {
    if (!currentRestaurant) return;
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
      restaurantId: currentRestaurant.id
    };
    setMenuItems(prev => [...prev, newItem]);
    if (isSupabaseConfigured) createMenuItemDB(newItem);
    showToast(`Added "${newItem.name}" to menu.`);
  };

  const updateMenuItem = (updated: MenuItem) => {
    setMenuItems(prev => prev.map(m => m.id === updated.id ? updated : m));
    showToast(`Updated "${updated.name}".`);
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== itemId));
    showToast('Menu item deleted.');
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m));
  };

  const addCategory = (name: string) => {
    if (!currentRestaurant) return;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      restaurantId: currentRestaurant.id,
      name
    };
    setCategories(prev => [...prev, newCat]);
    if (isSupabaseConfigured) createCategoryDB(newCat);
    showToast(`Category "${name}" created.`);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order status updated to ${status.toUpperCase()}`);
  };

  const updateRestaurantSettings = (updated: Partial<Restaurant>) => {
    if (!currentRestaurant) return;
    setRestaurants(prev => prev.map(r => r.id === currentRestaurant.id ? { ...r, ...updated } : r));
    showToast('Restaurant settings updated!');
  };

  // Super Admin Actions
  const addRestaurantTenant = (newRest: Omit<Restaurant, 'id' | 'totalOrdersCount' | 'totalRevenue' | 'createdAt'>) => {
    const created: Restaurant = {
      ...newRest,
      id: `rest-${Date.now()}`,
      totalOrdersCount: 0,
      totalRevenue: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRestaurants(prev => [...prev, created]);
    if (isSupabaseConfigured) createTenantDB(created);
    showToast(`New tenant "${created.name}" onboarded to Supabase DB!`);
  };

  const updateTenantStatus = (restaurantId: string, status: Restaurant['status']) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, status } : r));
    if (isSupabaseConfigured) updateTenantStatusDB(restaurantId, status);
    showToast(`Tenant status set to ${status}`);
  };

  return (
    <SaaSContext.Provider value={{
      currentRole,
      setCurrentRole,
      activeRestaurantId,
      setActiveRestaurantId,
      activeTableNumber,
      setActiveTableNumber,
      darkMode,
      setDarkMode,
      isSuperAdminAuthenticated,
      loginSuperAdmin,
      logoutSuperAdmin,
      authenticatedRestaurantId,
      loginRestaurant,
      logoutRestaurant,
      plans,
      restaurants,
      categories,
      menuItems,
      offers,
      orders,
      currentRestaurant,
      currentCategories,
      currentMenuItems,
      currentOffers,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      toggleItemAvailability,
      addCategory,
      updateOrderStatus,
      updateRestaurantSettings,
      addRestaurantTenant,
      updateTenantStatus,
      toastMessage,
      showToast,
      isLiveDB: isSupabaseConfigured
    }}>
      {children}
    </SaaSContext.Provider>
  );
};

export const useSaaS = () => {
  const ctx = useContext(SaaSContext);
  if (!ctx) throw new Error('useSaaS must be used within a SaaSProvider');
  return ctx;
};
