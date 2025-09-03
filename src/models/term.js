import { Sequelize, DataTypes } from 'sequelize';
  import sequelize from '../config/db.js';

  const Term = sequelize.define('Term', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    language: {
      type: DataTypes.STRING(2),
      allowNull: false,
      validate: {
        isIn: [['en', 'sv']],
      },
      unique: true,
    },
    terms_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    terms_button: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    terms_context: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  }, {
    tableName: 'terms',
    timestamps: false,
  });

  export default Term;