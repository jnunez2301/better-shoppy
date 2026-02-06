import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
    },
  },

  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  avatar: {
    type: DataTypes.ENUM('avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5'),
    defaultValue: 'avatar-1',
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

export default User;
