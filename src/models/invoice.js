import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Customers',
      key: 'id',
    },
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  invoiceDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'draft',
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 25.00, // Swedish VAT rate
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'SEK',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  paymentTerms: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '30 days',
  },
  sentDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  paidDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'invoices',
  timestamps: true,
});

export default Invoice;
