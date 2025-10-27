import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import User from '../src/models/User.js';
import Product from '../src/models/product.js';
import Term from '../src/models/term.js';
import Invoice from '../src/models/invoice.js';
import InvoiceItem from '../src/models/invoiceItem.js';
import Customer from '../src/models/customer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/config.json'), 'utf8'))[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Initialize models
db.User = User;
db.Product = Product;
db.Term = Term;
db.Invoice = Invoice;
db.InvoiceItem = InvoiceItem;
db.Customer = Customer;

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Define associations
db.User.hasMany(db.Product, { foreignKey: 'userId', as: 'products' });
db.Product.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.User.hasMany(db.Customer, { foreignKey: 'userId', as: 'customers' });
db.Customer.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.User.hasMany(db.Invoice, { foreignKey: 'userId', as: 'invoices' });
db.Invoice.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.Customer.hasMany(db.Invoice, { foreignKey: 'customerId', as: 'invoices' });
db.Invoice.belongsTo(db.Customer, { foreignKey: 'customerId', as: 'customer' });

db.Invoice.hasMany(db.InvoiceItem, { foreignKey: 'invoiceId', as: 'items' });
db.InvoiceItem.belongsTo(db.Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

db.Product.hasMany(db.InvoiceItem, { foreignKey: 'productId', as: 'invoiceItems' });
db.InvoiceItem.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
