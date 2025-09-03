import { Sequelize, DataTypes } from 'sequelize';
     import sequelize from '../config/db.js';

     const Product = sequelize.define('Product', {
       id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
       },
       name: {
         type: DataTypes.STRING,
         allowNull: false,
       },
       in_price: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: true,
       },
       price: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
       },
       unit: {
         type: DataTypes.STRING,
         allowNull: true,
       },
       vat_rate: {
         type: DataTypes.INTEGER,
         allowNull: true,
       },
       quantity: {
         type: DataTypes.INTEGER,
         allowNull: true,
       },
       created_at: {
         type: DataTypes.DATE,
         defaultValue: Sequelize.NOW,
       },
     }, {
       tableName: 'products',
       timestamps: false,
     });

     export default Product;