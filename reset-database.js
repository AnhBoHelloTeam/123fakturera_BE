import sequelize from './src/config/db.js';

async function resetDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully');

    console.log('Dropping tables manually...');
    
    // Drop tables in reverse order of dependencies
    await sequelize.query('DROP TABLE IF EXISTS "invoice_items" CASCADE;');
    console.log('Dropped invoice_items table');
    
    await sequelize.query('DROP TABLE IF EXISTS "invoices" CASCADE;');
    console.log('Dropped invoices table');
    
    await sequelize.query('DROP TABLE IF EXISTS "customers" CASCADE;');
    console.log('Dropped customers table');
    
    await sequelize.query('DROP TABLE IF EXISTS "products" CASCADE;');
    console.log('Dropped products table');
    
    await sequelize.query('DROP TABLE IF EXISTS "terms" CASCADE;');
    console.log('Dropped terms table');
    
    await sequelize.query('DROP TABLE IF EXISTS "users" CASCADE;');
    console.log('Dropped users table');
    
    // Drop enums
    await sequelize.query('DROP TYPE IF EXISTS "enum_invoices_status" CASCADE;');
    console.log('Dropped enum_invoices_status');
    
    await sequelize.query('DROP TYPE IF EXISTS "enum_customers_status" CASCADE;');
    console.log('Dropped enum_customers_status');

    console.log('All tables dropped successfully');
    console.log('Database reset completed!');
    process.exit(0);
  } catch (error) {
    console.error('Database reset failed:', error);
    process.exit(1);
  }
}

resetDatabase();