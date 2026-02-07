import { Product, Cart, CartUser, User } from '../model/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { getIconForProduct } from '../utils/iconMapper.js';
import { Op } from 'sequelize';

/**
 * Check if user has access to cart
 */
const checkCartAccess = async (cartId, userId, requiredRoles = ['owner', 'admin', 'editor', 'viewer']) => {
  const cartUser = await CartUser.findOne({
    where: { cartId, userId },
  });

  if (!cartUser) {
    throw new AppError('Access denied', 403);
  }

  if (!requiredRoles.includes(cartUser.role)) {
    throw new AppError('Insufficient permissions', 403);
  }

  return cartUser.role;
};

/**
 * Get all products in a cart
 */
export const getCartProducts = async (cartId, userId) => {
  await checkCartAccess(cartId, userId);

  const products = await Product.findAll({
    where: { cartId },
    include: [
      { model: User, as: 'addedByUser', attributes: ['id', 'username', 'avatar'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return products;
};

/**
 * Add product to cart
 */
export const addProduct = async (cartId, userId, { name, description, quantity = 1 }) => {
  await checkCartAccess(cartId, userId, ['owner', 'admin', 'editor']);

  const icon = getIconForProduct(name);

  const product = await Product.create({
    cartId,
    name,
    description,
    quantity,
    icon,
    addedBy: userId,
    status: 'pending',
  });

  // Load user info
  await product.reload({
    include: [{ model: User, as: 'addedByUser', attributes: ['id', 'username', 'avatar'] }],
  });

  return product;
};

/**
 * Update product
 */
export const updateProduct = async (productId, userId, updates) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  await checkCartAccess(product.cartId, userId, ['owner', 'admin', 'editor']);

  // Update fields
  if (updates.name !== undefined) {
    product.name = updates.name;
    product.icon = getIconForProduct(updates.name);
  }
  if (updates.description !== undefined) {
    product.description = updates.description;
  }
  if (updates.status !== undefined) {
    product.status = updates.status;
  }
  if (updates.quantity !== undefined) {
    product.quantity = updates.quantity;
  }

  await product.save();

  await product.reload({
    include: [{ model: User, as: 'addedByUser', attributes: ['id', 'username', 'avatar'] }],
  });

  return product;
};

/**
 * Get product info for socket events
 */
export const getProductInfo = async (productId) => {
  const product = await Product.findByPk(productId);
  if (!product) return { cartId: null, productId: null };
  return { cartId: product.cartId, productId: product.id };
};

/**
 * Delete single product
 */
export const deleteProduct = async (productId, userId) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  await checkCartAccess(product.cartId, userId, ['owner', 'admin', 'editor']);

  await product.destroy();
  return { message: 'Product deleted successfully' };
};

/**
 * Delete all completed products
 */
export const deleteCompletedProducts = async (cartId, userId) => {
  await checkCartAccess(cartId, userId, ['owner', 'admin', 'editor']);

  const deletedCount = await Product.destroy({
    where: {
      cartId,
      status: 'completed',
    },
  });

  return { message: `${deletedCount} completed product(s) deleted` };
};

/**
 * Clear entire cart
 */
export const clearCart = async (cartId, userId) => {
  await checkCartAccess(cartId, userId, ['owner', 'admin', 'editor']);

  const deletedCount = await Product.destroy({
    where: { cartId },
  });

  return { message: `${deletedCount} product(s) deleted` };
};

/**
 * Get autocomplete suggestions
 */
export const getAutocompleteSuggestions = async (cartId, userId, query) => {
  await checkCartAccess(cartId, userId);

  if (!query || query.length < 1) {
    return [];
  }

  // Get unique product names from this cart and user's other carts
  const userCarts = await CartUser.findAll({
    where: { userId },
    attributes: ['cartId'],
  });

  const cartIds = userCarts.map(cu => cu.cartId);

  const products = await Product.findAll({
    where: {
      cartId: { [Op.in]: cartIds },
      name: { [Op.like]: `%${query}%` },
    },
    attributes: ['name', 'icon'],
    group: ['name', 'icon'],
    limit: 10,
  });

  return products.map(p => ({
    name: p.name,
    icon: p.icon,
  }));
};
