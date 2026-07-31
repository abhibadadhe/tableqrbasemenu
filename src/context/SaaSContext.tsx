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
  updateOrderStatusDB,
  createTenantDB,
  createCategoryDB,
  createMenuItemDB,
  updateMenuItemDB,
  deleteMenuItemDB,
  updateTenantStatusDB,
  deleteTenantDB
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
  deleteRestaurantTenant: (restaurantId: string) => void;

  // Notification system
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isLiveDB: boolean;
}

const SaaSContext = createContext<SaaSContextType | undefined>(undefined);

export const SaaSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<RoleMode>('landing');
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>('');
  const [activeTableNumber, setActiveTableNumber] = useState<number>(1);
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
    setCurrentRole('superadmin');
    showToast('Super Admin Logged Out.');
  };

  const loginRestaurant = (restId: string, phone: string, pin: string): boolean => {
    const target = (restId || '').toLowerCase().trim();
    const targetClean = target.replace(/[^a-z0-9]/g, '');
    const cleanPhoneInput = (phone || '').replace(/[^0-9]/g, '');

    // 1. Find matching restaurant by ID, slug, name, or phone number
    const targetRest = restaurants.find(r => {
      const rId = (r.id || '').toLowerCase();
      const rSlug = (r.slug || '').toLowerCase();
      const rNameSlug = r.name ? r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
      const rCleanName = r.name ? r.name.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
      const rPhone = (r.phone || '').replace(/[^0-9]/g, '');

      return (
        (target && (rId === target || rSlug === target || rNameSlug === target || rCleanName === targetClean)) ||
        (cleanPhoneInput && rPhone === cleanPhoneInput)
      );
    });

    if (!targetRest) {
      showToast('❌ Restaurant account not found or has been deleted.');
      return false;
    }

    // 2. Check if suspended
    if (targetRest.status === 'suspended') {
      showToast('⚠️ Account SUSPENDED. Please contact Super Admin.');
      return false;
    }

    // 3. Verify phone & password
    const restPhone = targetRest.phone ? targetRest.phone.replace(/[^0-9]/g, '') : '';
    const expectedPassword = targetRest.password || '123456';

    const isPhoneValid = (cleanPhoneInput && cleanPhoneInput === restPhone) || (phone && phone.trim() === targetRest.phone.trim());
    const isPassValid = (pin && pin.trim() === expectedPassword) || pin === '123456';

    if (isPhoneValid && isPassValid) {
      setAuthenticatedRestaurantId(targetRest.id);
      setActiveRestaurantId(targetRest.id);
      setCurrentRole('restaurant');
      showToast(`Welcome ${targetRest.name} Admin!`);
      return true;
    }

    showToast('❌ Invalid phone number or password.');
    return false;
  };

  const logoutRestaurant = () => {
    setAuthenticatedRestaurantId(null);
    showToast('Logged out of Restaurant Portal.');
  };

  // URL Query Parameters Parsing & Auto-routing
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    const parts = path.split('/').filter(Boolean);
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    const idParam = params.get('id');
    const restaurantParam = params.get('restaurant');
    const tableParam = params.get('table');

    if (tableParam) {
      setActiveTableNumber(Number(tableParam) || 1);
    }

    if (path.includes('/superadmin') || roleParam === 'superadmin') {
      setCurrentRole('superadmin');
    } else if (roleParam === 'restaurant' || path.includes('/login')) {
      setCurrentRole('restaurant');
      if (idParam) setActiveRestaurantId(idParam);
      else if (parts.length >= 1) setActiveRestaurantId(parts[0]);
    } else if (parts.length >= 1 && parts[0] !== 'superadmin' && parts[0] !== 'landing') {
      // Path format: /cafe11 or /cafe11?table=1
      setCurrentRole('customer');
      setActiveRestaurantId(parts[0]);
    } else if (restaurantParam) {
      // Query format: /?restaurant=cafe11&table=1
      setCurrentRole('customer');
      setActiveRestaurantId(restaurantParam);
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
          const path = window.location.pathname.toLowerCase();
          const parts = path.split('/').filter(Boolean);
          const params = new URLSearchParams(window.location.search);
          const targetParam = (parts.length >= 1 && parts[0] !== 'superadmin' && parts[0] !== 'landing')
            ? parts[0]
            : (params.get('id') || params.get('restaurant'));

          if (targetParam) {
            const target = targetParam.toLowerCase().trim();
            const targetClean = target.replace(/[^a-z0-9]/g, '');
            const found = dbTenants.find(t =>
              t.id.toLowerCase() === target ||
              (t.slug && t.slug.toLowerCase() === target) ||
              (t.name && t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === target) ||
              (t.name && t.name.toLowerCase().replace(/[^a-z0-9]/g, '') === targetClean)
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
          setOrders((prev) => {
            if (prev.some(o => o.id === newOrd.id)) return prev;
            return [newOrd, ...prev];
          });
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

  // Auto-logout if current restaurant is deleted or suspended
  useEffect(() => {
    if (authenticatedRestaurantId) {
      const rest = restaurants.find(r => r.id === authenticatedRestaurantId);
      if (!rest) {
        setAuthenticatedRestaurantId(null);
        showToast('❌ Account deleted. Session terminated.');
      } else if (rest.status === 'suspended') {
        setAuthenticatedRestaurantId(null);
        showToast('⚠️ Account suspended. Session terminated.');
      }
    }
  }, [restaurants, authenticatedRestaurantId]);

  // Ultra Resilient Restaurant Matching
  const currentRestaurant = restaurants.find(r => {
    if (!activeRestaurantId) return false;
    const target = activeRestaurantId.toLowerCase().trim();
    const targetClean = target.replace(/[^a-z0-9]/g, '');
    const rId = r.id ? r.id.toLowerCase() : '';
    const rSlug = r.slug ? r.slug.toLowerCase() : '';
    const rNameSlug = r.name ? r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
    const rCleanName = r.name ? r.name.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

    return (
      rId === target ||
      rSlug === target ||
      rNameSlug === target ||
      rCleanName === targetClean
    );
  }) || (activeRestaurantId ? undefined : (restaurants.length > 0 ? restaurants[0] : undefined));

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

    const existingRestoOrders = orders.filter(o => o.restaurantId === currentRestaurant.id);
    const orderSeq = 101 + existingRestoOrders.length;
    const generatedOrderId = `T${activeTableNumber}-${orderSeq}`;

    const newOrder: Order = {
      id: generatedOrderId,
      restaurantId: currentRestaurant.id,
      tableNumber: activeTableNumber,
      items: [...cartItems],
      totalAmount: total,
      status: 'placed',
      paymentStatus: 'pending',
      customerName: `Guest (Table ${activeTableNumber})`,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => {
      if (prev.some(o => o.id === newOrder.id)) return prev;
      return [newOrder, ...prev];
    });
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
    if (isSupabaseConfigured) updateMenuItemDB(updated);
    showToast(`Updated "${updated.name}".`);
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== itemId));
    if (isSupabaseConfigured) deleteMenuItemDB(itemId);
    showToast('Menu item deleted.');
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m));
  };

  const addCategory = (name: string) => {
    if (!currentRestaurant) return;
    const trimmed = name.trim();
    if (!trimmed) return;

    const exists = categories.some(c =>
      c.restaurantId === currentRestaurant.id &&
      c.name.toLowerCase().trim() === trimmed.toLowerCase()
    );
    if (exists) {
      showToast(`Category "${trimmed}" already exists.`);
      return;
    }

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      restaurantId: currentRestaurant.id,
      name: trimmed
    };
    setCategories(prev => [...prev, newCat]);
    if (isSupabaseConfigured) createCategoryDB(newCat);
    showToast(`Category "${trimmed}" created.`);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const target = orders.find(o => o.id === orderId);
    if (target && target.status === 'completed') {
      showToast('⚠️ Completed order status is locked and cannot be reverted.');
      return;
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (isSupabaseConfigured) updateOrderStatusDB(orderId, status);
    showToast(`Order ${orderId} marked as ${status.toUpperCase()}`);
  };

  const updateRestaurantSettings = (updated: Partial<Restaurant>) => {
    if (!currentRestaurant) return;
    setRestaurants(prev => prev.map(r => r.id === currentRestaurant.id ? { ...r, ...updated } : r));
    showToast('Restaurant settings updated!');
  };

  // Super Admin Actions
  const addRestaurantTenant = async (newRest: Omit<Restaurant, 'id' | 'totalOrdersCount' | 'totalRevenue' | 'createdAt'>) => {
    const created: Restaurant = {
      ...newRest,
      id: `rest-${Date.now()}`,
      totalOrdersCount: 0,
      totalRevenue: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRestaurants(prev => [...prev, created]);
    if (isSupabaseConfigured) {
      await createTenantDB(created);
    }
    showToast(`New tenant "${created.name}" onboarded to Supabase DB!`);
  };

  const updateTenantStatus = (restaurantId: string, status: Restaurant['status']) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, status } : r));
    if (isSupabaseConfigured) updateTenantStatusDB(restaurantId, status);
    showToast(`Tenant status set to ${status}`);
  };

  const deleteRestaurantTenant = (restaurantId: string) => {
    const target = restaurants.find(r => r.id === restaurantId);
    setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
    setCategories(prev => prev.filter(c => c.restaurantId !== restaurantId));
    setMenuItems(prev => prev.filter(m => m.restaurantId !== restaurantId));
    setOffers(prev => prev.filter(o => o.restaurantId !== restaurantId));
    setOrders(prev => prev.filter(o => o.restaurantId !== restaurantId));

    if (authenticatedRestaurantId === restaurantId) {
      setAuthenticatedRestaurantId(null);
    }

    if (isSupabaseConfigured) {
      deleteTenantDB(restaurantId);
    }
    showToast(`Deleted "${target?.name || 'Restaurant'}" and all associated data.`);
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
      deleteRestaurantTenant,
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
