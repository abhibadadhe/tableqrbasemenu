import pg from 'pg';

const dbConfig = {
  host: 'db.neasgslodtcwvlesmvxr.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '7aEp%r@_5Q7hg#v',
  ssl: { rejectUnauthorized: false }
};

async function seedCafe1111() {
  const client = new pg.Client(dbConfig);
  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();

    console.log('Seeding cafe 11.11 into tenants table...');
    
    // 1. Insert Tenant
    const tenantRes = await client.query(`
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

    const tenantId = tenantRes.rows[0].id;
    console.log(`✅ Tenant 'cafe 11.11' created with ID: ${tenantId}`);

    // 2. Insert Categories
    const catRes = await client.query(`
      INSERT INTO categories (tenant_id, name, sort_order)
      VALUES
        ('${tenantId}', 'Starters & Crispy Bites', 1),
        ('${tenantId}', 'Special Shakes & Cold Coffee', 2),
        ('${tenantId}', 'Tandoori Delights', 3)
      RETURNING id, name;
    `);

    const catMap = {};
    catRes.rows.forEach(row => { catMap[row.name] = row.id; });

    // 3. Insert Menu Items
    await client.query(`
      INSERT INTO menu_items (tenant_id, category_id, name, description, price, image, tags, is_veg, is_available)
      VALUES
        (
          '${tenantId}',
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
          '${tenantId}',
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
          '${tenantId}',
          '${catMap['Tandoori Delights']}',
          'Malai Chaap Tikka Tandoori',
          'Soya chaap, served with a cream & spice marinade, cooked in tandoor.',
          260,
          'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
          '["Chaap", "Tandoor"]'::jsonb,
          true,
          true
        );
    `);

    // 4. Insert Offer
    await client.query(`
      INSERT INTO offers (tenant_id, title, code, discount, bg_color, active)
      VALUES (
        '${tenantId}',
        '15% OFF on Orders above ₹400',
        'CAFE1111',
        '15% OFF',
        'linear-gradient(135deg, #ff5722 0%, #f44336 100%)',
        true
      );
    `);

    console.log('🎉 cafe 11.11 tenant, categories, menu items, and offers seeded into Supabase DB!');

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await client.end();
  }
}

seedCafe1111();
