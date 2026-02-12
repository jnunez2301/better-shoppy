import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProductCatalog = sequelize.define('ProductCatalog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 200],
    },
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  defaultUnit: {
    type: DataTypes.STRING(20),
    allowNull: true, // e.g., 'kg', 'lb', 'item'
  },
  icon: {
    type: DataTypes.STRING(50), // storing the icon name/code
    allowNull: true,
  },
}, {
  tableName: 'product_catalog',
  timestamps: true,
});

export default ProductCatalog;
