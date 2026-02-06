import { Cart, CartUser, User, Product } from '../model/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';

/**
 * Get all carts for a user
 */
export const getUserCarts = async (userId) => {
  const carts = await Cart.findAll({
    include: [
      {
        model: CartUser,
        as: 'cartUsers',
        where: { userId },
        required: true,
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
      },
      {
        model: Product,
        as: 'products',
        attributes: ['id', 'status'],
      },
    ],
  });

  return carts.map(cart => {
    const cartJson = cart.toJSON();
    const userRole = cartJson.cartUsers.find(cu => cu.userId === userId)?.role;

    return {
      ...cartJson,
      userRole,
      productCount: cartJson.products.length,
      completedCount: cartJson.products.filter(p => p.status === 'completed').length,
    };
  });
};

/**
 * Create a new cart
 */
export const createCart = async (userId, name) => {
  const cart = await Cart.create({
    name,
    ownerId: userId,
  });

  // Add owner to CartUser
  await CartUser.create({
    cartId: cart.id,
    userId,
    role: 'owner',
  });

  return cart;
};

/**
 * Get cart by ID with permission check
 */
export const getCartById = async (cartId, userId) => {
  const cart = await Cart.findByPk(cartId, {
    include: [
      {
        model: CartUser,
        as: 'cartUsers',
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
      },
      {
        model: Product,
        as: 'products',
        include: [{ model: User, as: 'addedByUser', attributes: ['id', 'username', 'avatar'] }],
        order: [['createdAt', 'DESC']],
      },
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'username', 'avatar'],
      },
    ],
  });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  // Check if user has access
  const userAccess = cart.cartUsers.find(cu => cu.userId === userId);
  if (!userAccess) {
    throw new AppError('Access denied', 403);
  }

  const cartJson = cart.toJSON();
  return {
    ...cartJson,
    userRole: userAccess.role,
  };
};

/**
 * Update cart name
 */
export const updateCart = async (cartId, userId, name) => {
  const cart = await Cart.findByPk(cartId, {
    include: [{ model: CartUser, as: 'cartUsers' }],
  });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  // Check permission (owner or admin)
  const userAccess = cart.cartUsers.find(cu => cu.userId === userId);
  if (!userAccess || !['owner', 'admin'].includes(userAccess.role)) {
    throw new AppError('Permission denied', 403);
  }

  cart.name = name;
  await cart.save();

  return cart;
};

/**
 * Delete cart
 */
export const deleteCart = async (cartId, userId) => {
  const cart = await Cart.findByPk(cartId, {
    include: [{ model: CartUser, as: 'cartUsers' }],
  });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  // Only owner can delete
  const userAccess = cart.cartUsers.find(cu => cu.userId === userId);
  if (!userAccess || userAccess.role !== 'owner') {
    throw new AppError('Only the owner can delete this cart', 403);
  }

  await cart.destroy();
  return { message: 'Cart deleted successfully' };
};

/**
 * Remove user from cart
 */
export const removeUserFromCart = async (cartId, userIdToRemove, requestingUserId) => {
  const cart = await Cart.findByPk(cartId, {
    include: [{ model: CartUser, as: 'cartUsers' }],
  });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const requestingUserAccess = cart.cartUsers.find(cu => cu.userId === requestingUserId);
  const targetUserAccess = cart.cartUsers.find(cu => cu.userId === userIdToRemove);

  if (!requestingUserAccess) {
    throw new AppError('Access denied', 403);
  }

  if (!targetUserAccess) {
    throw new AppError('User not in cart', 404);
  }

  // Cannot remove owner
  if (targetUserAccess.role === 'owner') {
    throw new AppError('Cannot remove cart owner', 403);
  }

  // Only owner and admin can remove users
  if (!['owner', 'admin'].includes(requestingUserAccess.role)) {
    throw new AppError('Permission denied', 403);
  }

  await CartUser.destroy({
    where: {
      cartId,
      userId: userIdToRemove,
    },
  });

  return { message: 'User removed from cart' };
};
