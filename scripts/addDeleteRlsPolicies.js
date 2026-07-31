import pg from 'pg';

const dbConfig = {
  host: 'db.neasgslodtcwvlesmvxr.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '7aEp%r@_5Q7hg#v',
  ssl: { rejectUnauthorized: false }
};

async function addDeletePolicies() {
  const client = new pg.Client(dbConfig);
  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();

    console.log('Adding DELETE RLS policies for all tables...');

    await client.query(`
      DROP POLICY IF EXISTS "Allow anon delete tenants" ON tenants;
      CREATE POLICY "Allow anon delete tenants" ON tenants FOR DELETE USING (true);

      DROP POLICY IF EXISTS "Allow anon delete categories" ON categories;
      CREATE POLICY "Allow anon delete categories" ON categories FOR DELETE USING (true);

      DROP POLICY IF EXISTS "Allow anon delete menu_items" ON menu_items;
      CREATE POLICY "Allow anon delete menu_items" ON menu_items FOR DELETE USING (true);

      DROP POLICY IF EXISTS "Allow anon delete offers" ON offers;
      CREATE POLICY "Allow anon delete offers" ON offers FOR DELETE USING (true);

      DROP POLICY IF EXISTS "Allow anon delete orders" ON orders;
      CREATE POLICY "Allow anon delete orders" ON orders FOR DELETE USING (true);
    `);

    console.log('✅ ALL DELETE RLS POLICIES APPLIED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Error adding DELETE policies:', err);
  } finally {
    await client.end();
  }
}

addDeletePolicies();
