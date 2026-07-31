import pg from 'pg';

const dbConfig = {
  host: 'db.neasgslodtcwvlesmvxr.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '7aEp%r@_5Q7hg#v',
  ssl: { rejectUnauthorized: false }
};

async function clearDatabase() {
  const client = new pg.Client(dbConfig);
  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();
    
    console.log('Clearing all demo records from database...');
    await client.query(`
      TRUNCATE TABLE orders, menu_items, offers, categories, tenants CASCADE;
    `);
    console.log('🎉 All demo records wiped! Database is clean and ready for real clients.');

  } catch (err) {
    console.error('❌ Clear DB failed:', err);
  } finally {
    await client.end();
  }
}

clearDatabase();
