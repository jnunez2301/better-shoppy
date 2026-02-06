import * as productService from '../service/productService.js';
import { emitToCart } from '../socket/socketHandler.js';

/**
 * Get all products in cart
 * GET /api/carts/:cartId/products
 */
export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getCartProducts(req.params.cartId, req.user.id);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add product to cart
 * POST /api/carts/:cartId/products
 */
export const addProduct = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { cartId } = req.params;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Product name is required',
      });
    }

    const product = await productService.addProduct(cartId, req.user.id, {
      name,
      description,
    });

    // Socket emission
    const io = req.app.get('io');
    emitToCart(io, cartId, 'product-added', product);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    const product = await productService.updateProduct(req.params.id, req.user.id, {
      name,
      description,
      status,
    });

    // Socket emission
    const io = req.app.get('io');
    emitToCart(io, product.cartId, 'product-updated', product);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { cartId, productId } = await productService.getProductInfo(req.params.id);
    const result = await productService.deleteProduct(req.params.id, req.user.id);

    // Socket emission
    const io = req.app.get('io');
    emitToCart(io, cartId, 'product-deleted', { productId });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete completed products
 * DELETE /api/carts/:cartId/products/completed
 */
export const deleteCompleted = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const result = await productService.deleteCompletedProducts(cartId, req.user.id);

    // Socket emission
    const io = req.app.get('io');
    emitToCart(io, cartId, 'products-updated', { cartId }); // Or specialized event

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear cart
 * DELETE /api/carts/:cartId/products
 */
export const clearCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const result = await productService.clearCart(cartId, req.user.id);

    // Socket emission
    const io = req.app.get('io');
    emitToCart(io, cartId, 'cart-cleared', { cartId });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get autocomplete suggestions
 * GET /api/carts/:cartId/products/autocomplete
 */
export const autocomplete = async (req, res, next) => {
  try {
    const { q } = req.query;

    const suggestions = await productService.getAutocompleteSuggestions(
      req.params.cartId,
      req.user.id,
      q
    );

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};
