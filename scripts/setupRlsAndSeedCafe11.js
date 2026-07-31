import pg from 'pg';

const dbConfig = {
  host: 'db.neasgslodtcwvlesmvxr.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '7aEp%r@_5Q7hg#v',
  ssl: { rejectUnauthorized: false }
};

async function setupRlsAndSeed() {
  const client = new pg.Client(dbConfig);
  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();

    console.log('Applying RLS policies to allow public anon read/write access...');

    // Enable RLS and grant anon policies
    await client.query(`
      ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow anon select tenants" ON tenants;
      DROP POLICY IF EXISTS "Allow anon insert tenants" ON tenants;
      DROP POLICY IF EXISTS "Allow anon update tenants" ON tenants;
      CREATE POLICY "Allow anon select tenants" ON tenants FOR SELECT USING (true);
      CREATE POLICY "Allow anon insert tenants" ON tenants FOR INSERT WITH CHECK (true);
      CREATE POLICY "Allow anon update tenants" ON tenants FOR UPDATE USING (true);

      ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow anon select categories" ON categories;
      DROP POLICY IF EXISTS "Allow anon insert categories" ON categories;
      CREATE POLICY "Allow anon select categories" ON categories FOR SELECT USING (true);
      CREATE POLICY "Allow anon insert categories" ON categories FOR INSERT WITH CHECK (true);

      ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow anon select menu_items" ON menu_items;
      DROP POLICY IF EXISTS "Allow anon insert menu_items" ON menu_items;
      DROP POLICY IF EXISTS "Allow anon update menu_items" ON menu_items;
      CREATE POLICY "Allow anon select menu_items" ON menu_items FOR SELECT USING (true);
      CREATE POLICY "Allow anon insert menu_items" ON menu_items FOR INSERT WITH CHECK (true);
      CREATE POLICY "Allow anon update menu_items" ON menu_items FOR UPDATE USING (true);

      ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow anon select offers" ON offers;
      DROP POLICY IF EXISTS "Allow anon insert offers" ON offers;
      CREATE POLICY "Allow anon select offers" ON offers FOR SELECT USING (true);
      CREATE POLICY "Allow anon insert offers" ON offers FOR INSERT WITH CHECK (true);

      ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow anon select orders" ON orders;
      DROP POLICY IF EXISTS "Allow anon insert orders" ON orders;
      DROP POLICY IF EXISTS "Allow anon update orders" ON orders;
      CREATE POLICY "Allow anon select orders" ON orders FOR SELECT USING (true);
      CREATE POLICY "Allow anon insert orders" ON orders FOR INSERT WITH CHECK (true);
      CREATE POLICY "Allow anon update orders" ON orders FOR UPDATE USING (true);
    `);
    console.log('✅ RLS Policies Applied!');

    // Seed cafe11 tenant if not present
    console.log('Seeding cafe11 tenant into database...');
    
    // Insert tenant for slug 'cafe11'
    const tenantRes1 = await client.query(`
      INSERT INTO tenants (name, slug, tagline, phone, whatsapp, currency, theme_color, plan_id, status, tables_count)
      VALUES (
        'cafe11',
        'cafe11',
        'Modern Multi-Cuisine Cafe & Bistro',
        '9028553395',
        '9028553395',
        '₹',
        '#ff5722',
        'business',
        'active',
        20
      )
      ON CONFLICT (slug) DO UPDATE SET status = 'active', name = 'cafe11'
      RETURNING id;
    `);

    const tenantId1 = tenantRes1.rows[0].id;
    console.log(`✅ Tenant 'cafe11' ready with ID: ${tenantId1}`);

    // Insert tenant for slug 'cafe-11-11'
    const tenantRes2 = await client.query(`
      INSERT INTO tenants (name, slug, tagline, phone, whatsapp, currency, theme_color, plan_id, status, tables_count)
      VALUES (
        'cafe 11.11',
        'cafe-11-11',
        'Modern Multi-Cuisine Cafe & Bistro',
        '9028553395',
        '9028553395',
        '₹',
        '#ff5722',
        'pro',
        'active',
        20
      )
      ON CONFLICT (slug) DO UPDATE SET status = 'active'
      RETURNING id;
    `);
    const tenantId2 = tenantRes2.rows[0].id;

    // Insert categories for cafe11
    for (const tid of [tenantId1, tenantId2]) {
      const catRes = await client.query(`
        INSERT INTO categories (tenant_id, name, sort_order)
        VALUES
          ('${tid}', 'Starters & Crispy Bites', 1),
          ('${tid}', 'Special Shakes & Cold Coffee', 2),
          ('${tid}', 'Tandoori Delights', 3)
        ON CONFLICT DO NOTHING
        RETURNING id, name;
      `);

      const catMap = {};
      catRes.rows.forEach(row => { catMap[row.name] = row.id; });

      if (catMap['Starters & Crispy Bites']) {
        await client.query(`
          INSERT INTO menu_items (tenant_id, category_id, name, description, price, image, tags, is_veg, is_available)
          VALUES
            (
              '${tid}',
              '${catMap['Starters & Crispy Bites']}',
              'Kurkure Paneer Crispy Sticks',
              'Crispy double-coated paneer sticks served with garlic mayo dip.',
              220,
              'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
              '["Crispy", "Chef Special"]'::jsonb,
              true,
              true
            ),
            (
              '${tid}',
              '${catMap['Special Shakes & Cold Coffee']}',
              '11.11 Signature Cold Coffee',
              'Thick blended creamy espresso cold coffee with chocolate syrup & ice cream.',
              160,
              'https://images.unsplash.com/photo-1571006682858-a458b8a69288?auto=format&fit=crop&w=600&q=80',
              '["Bestseller", "Cold Coffee"]'::jsonb,
              true,
              true
            ),
            (
              '${tid}',
              '${catMap['Tandoori Delights']}',
              'Malai Chaap Tikka Tandoori',
              'Soya chaap, served with a cream & spice marinade, cooked in tandoor.',
              260,
              'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
              '["Chaap", "Tandoor"]'::jsonb,
              true,
              true
            )
          ON CONFLICT DO NOTHING;
        `);
      }

      await client.query(`
        INSERT INTO offers (tenant_id, title, code, discount, bg_color, active)
        VALUES (
          '${tid}',
          '15% OFF on Orders above ₹400',
          'CAFE11',
          '15% OFF',
          'linear-gradient(135deg, #ff5722 0%, #f44336 100%)',
          true
        )
        ON CONFLICT DO NOTHING;
      `);
    }

    console.log('🎉 cafe11 & RLS Setup Complete!');

  } catch (err) {
    console.error('❌ Setup failed:', err);
  } finally {
    await client.end();
  }
}

setupRlsAndSeed();
