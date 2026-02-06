import User from './User.js';
import Cart from './Cart.js';
import CartUser from './CartUser.js';
import Product from './Product.js';
import Invitation from './Invitation.js';

// User <-> Cart (Owner relationship)
User.hasMany(Cart, { foreignKey: 'ownerId', as: 'ownedCarts' });
Cart.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// User <-> Cart (Many-to-Many through CartUser)
User.belongsToMany(Cart, { through: CartUser, foreignKey: 'userId', as: 'carts' });
Cart.belongsToMany(User, { through: CartUser, foreignKey: 'cartId', as: 'users' });

// Direct associations for easier querying
Cart.hasMany(CartUser, { foreignKey: 'cartId', as: 'cartUsers' });
CartUser.belongsTo(Cart, { foreignKey: 'cartId' });
CartUser.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Cart <-> Product
Cart.hasMany(Product, { foreignKey: 'cartId', as: 'products' });
Product.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

// User <-> Product (who added it)
User.hasMany(Product, { foreignKey: 'addedBy', as: 'addedProducts' });
Product.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser' });

// Cart <-> Invitation
Cart.hasMany(Invitation, { foreignKey: 'cartId', as: 'invitations' });
Invitation.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

// User <-> Invitation (who sent it)
User.hasMany(Invitation, { foreignKey: 'invitedBy', as: 'sentInvitations' });
Invitation.belongsTo(User, { foreignKey: 'invitedBy', as: 'inviter' });

export { User, Cart, CartUser, Product, Invitation };
