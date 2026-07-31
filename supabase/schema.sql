-- TableQR Production Multi-Tenant Database Schema for Supabase (PostgreSQL)

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) DEFAULT '₹',
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
  commission_rate DECIMAL(5, 2) DEFAULT 0,
  is_white_label BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Subscription Plans
INSERT INTO subscription_plans (id, name, price, currency, billing_cycle, commission_rate, is_white_label, features) VALUES
('starter', 'Starter Plan', 0, '₹', 'one-time', 50.00, false, '["Our Branding", "On Our Domain", "50% Commission on Orders"]'),
('pro', 'Pro Plan', 6999, '₹', 'per year', 0.00, true, '["100% White Label", "Your Domain", "0% Commission", "Unlimited Tables"]'),
('business', 'Business Plan', 24999, '₹', 'one-time', 0.00, true, '["Full Source Code", "Self Hosted", "Custom Payment Gateway"]')
ON CONFLICT (id) DO NOTHING;

-- 2. Restaurant Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo TEXT,
  banner_image TEXT,
  tagline TEXT,
  address TEXT,
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  currency VARCHAR(10) DEFAULT '₹',
  theme_color VARCHAR(20) DEFAULT '#ff5722',
  plan_id VARCHAR(50) REFERENCES subscription_plans(id) DEFAULT 'pro',
  status VARCHAR(20) DEFAULT 'active',
  tables_count INT DEFAULT 20,
  total_orders_count INT DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  is_veg BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  spicy_level INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Offer Banners
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  code VARCHAR(50),
  discount VARCHAR(50),
  bg_color TEXT DEFAULT 'linear-gradient(135deg, #ff5722 0%, #f44336 100%)',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Orders
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  table_number INT NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'placed', -- placed, preparing, served, completed
  payment_status VARCHAR(20) DEFAULT 'pending',
  customer_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Supabase Realtime for Orders Channel
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
