import express from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import * as authController from '../controller/authController.js';
import * as cartController from '../controller/cartController.js';
import * as productController from '../controller/productController.js';
import * as invitationController from '../controller/invitationController.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticate, authController.getMe);
router.put('/auth/me', authenticate, authController.updateProfile);
router.put('/auth/password', authenticate, authController.changePassword);

// Cart routes
router.get('/carts', authenticate, cartController.getCarts);
router.post('/carts', authenticate, cartController.createCart);
router.get('/carts/:id', authenticate, cartController.getCart);
router.put('/carts/:id', authenticate, cartController.updateCart);
router.delete('/carts/:id', authenticate, cartController.deleteCart);
router.delete('/carts/:id/users/:userId', authenticate, cartController.removeUser);

// Product routes
router.get('/carts/:cartId/products', authenticate, productController.getProducts);
router.post('/carts/:cartId/products', authenticate, productController.addProduct);
router.get('/carts/:cartId/products/autocomplete', authenticate, productController.autocomplete);
router.delete('/carts/:cartId/products/completed', authenticate, productController.deleteCompleted);
router.delete('/carts/:cartId/products', authenticate, productController.clearCart);
router.put('/products/:id', authenticate, productController.updateProduct);
router.delete('/products/:id', authenticate, productController.deleteProduct);

// Invitation routes
router.post('/carts/:cartId/invitations', authenticate, invitationController.createInvitation);
router.get('/carts/:cartId/invitations', authenticate, invitationController.getCartInvitations);
router.get('/invitations/:token', optionalAuth, invitationController.getInvitation);
router.post('/invitations/:token/accept', authenticate, invitationController.acceptInvitation);
router.delete('/invitations/:id', authenticate, invitationController.revokeInvitation);

export default router;
