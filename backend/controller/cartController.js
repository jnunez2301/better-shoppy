import * as cartService from '../service/cartService.js';

/**
 * Get all carts for current user
 * GET /api/carts
 */
export const getCarts = async (req, res, next) => {
  try {
    const carts = await cartService.getUserCarts(req.user.id);

    res.status(200).json({
      success: true,
      data: carts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new cart
 * POST /api/carts
 */
export const createCart = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Cart name is required',
      });
    }

    const cart = await cartService.createCart(req.user.id, name);

    res.status(201).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get cart by ID
 * GET /api/carts/:id
 */
export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCartById(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update cart
 * PUT /api/carts/:id
 */
export const updateCart = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Cart name is required',
      });
    }

    const cart = await cartService.updateCart(req.params.id, req.user.id, name);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete cart
 * DELETE /api/carts/:id
 */
export const deleteCart = async (req, res, next) => {
  try {
    const result = await cartService.deleteCart(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove user from cart
 * DELETE /api/carts/:id/users/:userId
 */
export const removeUser = async (req, res, next) => {
  try {
    const result = await cartService.removeUserFromCart(
      req.params.id,
      req.params.userId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
