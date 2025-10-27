import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Customer = sequelize.define('Customer', {
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
  customerNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Sweden',
  },
  orgNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vatNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentTerms: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '30 days',
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
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'customers',
  timestamps: true,
});

export default Customer;
