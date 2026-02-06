import jwt from 'jsonwebtoken';
import { environment } from '../config/environment.js';
import chalk from 'chalk';

/**
 * Socket.IO event handler
 */
export const setupSocketHandlers = (io) => {
  // Authentication middleware for Socket.IO
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, environment.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(chalk.blue(`✓ User ${socket.userId} connected`));

    // Join cart room
    socket.on('join-cart', (cartId) => {
      socket.join(`cart:${cartId}`);
      console.log(chalk.cyan(`User ${socket.userId} joined cart ${cartId}`));
    });

    // Leave cart room
    socket.on('leave-cart', (cartId) => {
      socket.leave(`cart:${cartId}`);
      console.log(chalk.cyan(`User ${socket.userId} left cart ${cartId}`));
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(chalk.gray(`User ${socket.userId} disconnected`));
    });
  });

  return io;
};

/**
 * Emit events to cart room
 */
export const emitToCart = (io, cartId, event, data) => {
  io.to(`cart:${cartId}`).emit(event, data);
};

/**
 * Event types:
 * - product-added: { product }
 * - product-updated: { product }
 * - product-deleted: { productId }
 * - cart-cleared: { cartId }
 * - user-joined: { user, role }
 * - user-removed: { userId }
 */
