import pg from 'pg';

const dbConfig = {
  host: 'db.neasgslodtcwvlesmvxr.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '7aEp%r@_5Q7hg#v',
  ssl: { rejectUnauthorized: false }
};

async function addPasswordColumn() {
  const client = new pg.Client(dbConfig);
  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();

    console.log('Adding password column to tenants table if not exists...');
    await client.query(`
      ALTER TABLE tenants ADD COLUMN IF NOT EXISTS password VARCHAR(100) DEFAULT '123456';
    `);
    console.log('✅ Password column added to tenants table!');

  } catch (err) {
    console.error('❌ Alter table failed:', err);
  } finally {
    await client.end();
  }
}

addPasswordColumn();
