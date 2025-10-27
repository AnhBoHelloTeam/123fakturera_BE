import sequelize from './src/config/db.js';
import User from './src/models/User.js';
import Product from './src/models/product.js';
import Term from './src/models/term.js';
import Customer from './src/models/customer.js';
import Invoice from './src/models/invoice.js';
import InvoiceItem from './src/models/invoiceItem.js';

async function syncDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully');

    console.log('Syncing models in correct order...');
    
    // Sync in dependency order
    await User.sync({ alter: true });
    console.log('users table synced');
    
    await Product.sync({ alter: true });
    console.log('products table synced');
    
    await Term.sync({ alter: true });
    console.log('terms table synced');
    
    await Customer.sync({ alter: true });
    console.log('customers table synced');
    
    await Invoice.sync({ alter: true });
    console.log('invoices table synced');
    
    await InvoiceItem.sync({ alter: true });
    console.log('invoice_items table synced');

    console.log('All tables synced successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database sync failed:', error);
    process.exit(1);
  }
}

syncDatabase();
