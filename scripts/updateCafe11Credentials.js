import pg from 'pg';

const dbConfig = {
  host: 'db.neasgslodtcwvlesmvxr.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '7aEp%r@_5Q7hg#v',
  ssl: { rejectUnauthorized: false }
};

async function updateCafe11Credentials() {
  const client = new pg.Client(dbConfig);
  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();

    console.log('Updating cafe11 phone to 9876543210 and password to 123456...');
    await client.query(`
      UPDATE tenants
      SET phone = '9876543210', whatsapp = '9876543210', password = '123456'
      WHERE slug = 'cafe11' OR slug = 'cafe-11-11' OR name ILIKE '%cafe11%';
    `);
    console.log('✅ cafe11 credentials updated in database!');

  } catch (err) {
    console.error('❌ Update credentials failed:', err);
  } finally {
    await client.end();
  }
}

updateCafe11Credentials();
