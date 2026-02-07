import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { environment } from '../config/environment.js';

const Invitation = sequelize.define('Invitation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cartId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'carts',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  invitedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  invitedUsername: {
    type: DataTypes.STRING(50),
    allowNull: true, // Now optional for general share links
    validate: {
      len: [3, 50],
    },
  },
  token: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'editor', 'viewer'),
    allowNull: false,
    defaultValue: 'editor',
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'revoked', 'expired'),
    defaultValue: 'pending',
    allowNull: false,
  },
  singleUse: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => {
      const date = new Date();
      date.setDate(date.getDate() + environment.INVITATION_EXPIRY_DAYS);
      return date;
    },
  },
}, {
  tableName: 'invitations',
  timestamps: true,
});

export default Invitation;
