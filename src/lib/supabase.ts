import { createClient } from '@supabase/supabase-js';
import type { Restaurant, MenuItem, Category, OfferBanner, Order } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Kitchen Order Audio Bell Alert Synthesizer
export const playKitchenOrderChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (err) {
    console.error('Audio chime error:', err);
  }
};

// Supabase DB Fetch Helpers
export async function fetchTenantsDB(): Promise<Restaurant[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('tenants').select('*');
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    logo: r.logo || '',
    bannerImage: r.banner_image || '',
    tagline: r.tagline || '',
    address: r.address || '',
    phone: r.phone || '',
    whatsapp: r.whatsapp || '',
    password: r.password || '123456',
    currency: r.currency || '₹',
    themeColor: r.theme_color || '#ff5722',
    planId: r.plan_id || 'pro',
    status: r.status || 'active',
    tablesCount: r.tables_count || 20,
    totalOrdersCount: r.total_orders_count || 0,
    totalRevenue: Number(r.total_revenue || 0),
    createdAt: r.created_at
  }));
}

export async function fetchMenuItemsDB(): Promise<MenuItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('menu_items').select('*');
  if (error || !data) return [];
  return data.map((m) => ({
    id: m.id,
    restaurantId: m.tenant_id,
    categoryId: m.category_id,
    name: m.name,
    description: m.description || '',
    price: Number(m.price),
    image: m.image || '',
    tags: m.tags || [],
    isVeg: m.is_veg ?? true,
    isAvailable: m.is_available ?? true,
    spicyLevel: m.spicy_level || 0
  }));
}

export async function fetchCategoriesDB(): Promise<Category[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('categories').select('*');
  if (error || !data) return [];
  return data.map((c) => ({
    id: c.id,
    restaurantId: c.tenant_id,
    name: c.name,
    icon: c.icon
  }));
}

export async function fetchOffersDB(): Promise<OfferBanner[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('offers').select('*');
  if (error || !data) return [];
  return data.map((o) => ({
    id: o.id,
    restaurantId: o.tenant_id,
    title: o.title,
    code: o.code || '',
    discount: o.discount || '',
    bgColor: o.bg_color || 'linear-gradient(135deg, #ff5722 0%, #f44336 100%)',
    active: o.active ?? true
  }));
}

export async function fetchOrdersDB(): Promise<Order[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map((o) => ({
    id: o.id,
    restaurantId: o.tenant_id,
    tableNumber: o.table_number,
    items: o.items || [],
    totalAmount: Number(o.total_amount),
    status: o.status,
    paymentStatus: o.payment_status,
    customerName: o.customer_name,
    createdAt: o.created_at || new Date().toISOString()
  }));
}

// Supabase DB Mutation Helpers
export async function createTenantDB(r: Restaurant) {
  if (!supabase) return;
  await supabase.from('tenants').insert({
    name: r.name,
    slug: r.slug,
    logo: r.logo,
    banner_image: r.bannerImage,
    tagline: r.tagline,
    address: r.address,
    phone: r.phone,
    whatsapp: r.whatsapp,
    password: r.password || '123456',
    currency: r.currency,
    theme_color: r.themeColor,
    plan_id: r.planId,
    status: r.status,
    tables_count: r.tablesCount
  });
}

export async function updateTenantStatusDB(tenantId: string, status: Restaurant['status']) {
  if (!supabase) return;
  await supabase.from('tenants').update({ status }).eq('id', tenantId);
}

export async function deleteTenantDB(tenantId: string) {
  if (!supabase) return;
  await supabase.from('orders').delete().eq('tenant_id', tenantId);
  await supabase.from('menu_items').delete().eq('tenant_id', tenantId);
  await supabase.from('categories').delete().eq('tenant_id', tenantId);
  await supabase.from('offers').delete().eq('tenant_id', tenantId);
  await supabase.from('tenants').delete().eq('id', tenantId);
}

export async function createCategoryDB(c: Category) {
  if (!supabase) return;
  await supabase.from('categories').insert({
    tenant_id: c.restaurantId,
    name: c.name
  });
}

export async function createMenuItemDB(m: MenuItem) {
  if (!supabase) return;
  await supabase.from('menu_items').insert({
    tenant_id: m.restaurantId,
    category_id: m.categoryId,
    name: m.name,
    description: m.description,
    price: m.price,
    image: m.image,
    tags: m.tags,
    is_veg: m.isVeg,
    is_available: m.isAvailable
  });
}

export async function updateMenuItemDB(m: MenuItem) {
  if (!supabase) return;
  await supabase.from('menu_items').update({
    name: m.name,
    description: m.description,
    price: m.price,
    image: m.image,
    tags: m.tags,
    is_veg: m.isVeg,
    is_available: m.isAvailable,
    category_id: m.categoryId
  }).eq('id', m.id);
}

export async function deleteMenuItemDB(itemId: string) {
  if (!supabase) return;
  await supabase.from('menu_items').delete().eq('id', itemId);
}

export async function createOrderDB(order: Order) {
  if (!supabase) return;
  await supabase.from('orders').insert({
    id: order.id,
    tenant_id: order.restaurantId,
    table_number: order.tableNumber,
    items: order.items,
    total_amount: order.totalAmount,
    status: order.status,
    payment_status: order.paymentStatus,
    customer_name: order.customerName
  });
}

export async function updateOrderStatusDB(orderId: string, status: Order['status']) {
  if (!supabase) return;
  await supabase.from('orders').update({ status }).eq('id', orderId);
}
