import { Invitation, Cart, CartUser, User } from '../model/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';

/**
 * Create invitation
 */
export const createInvitation = async (cartId, userId, { invitedUsername, role, singleUse }) => {
  // Check if user has permission (owner or admin)
  const cartUser = await CartUser.findOne({
    where: { cartId, userId },
  });

  if (!cartUser || !['owner', 'admin'].includes(cartUser.role)) {
    throw new AppError('Permission denied', 403);
  }

  // Check if cart exists
  const cart = await Cart.findByPk(cartId);
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  // Check if user with this username is already in the cart
  const existingUser = await User.findOne({ where: { username: invitedUsername } });
  if (existingUser) {
    const existingMembership = await CartUser.findOne({
      where: { cartId, userId: existingUser.id },
    });
    if (existingMembership) {
      throw new AppError('User is already a member of this cart', 400);
    }
  }

  // Check for pending invitation
  const pendingInvitation = await Invitation.findOne({
    where: {
      cartId,
      invitedUsername,
      status: 'pending',
      expiresAt: { [Op.gt]: new Date() },
    },
  });

  if (pendingInvitation) {
    throw new AppError('Pending invitation already exists for this user', 400);
  }

  // Create invitation
  const invitation = await Invitation.create({
    cartId,
    invitedBy: userId,
    invitedUsername,
    role: role || 'editor',
    singleUse: singleUse !== undefined ? singleUse : true,
  });

  await invitation.reload({
    include: [
      { model: Cart, as: 'cart', attributes: ['id', 'name'] },
      { model: User, as: 'inviter', attributes: ['id', 'username', 'avatar'] },
    ],
  });

  return invitation;
};

/**
 * Get invitation by token
 */
export const getInvitationByToken = async (token) => {
  const invitation = await Invitation.findOne({
    where: { token },
    include: [
      { model: Cart, as: 'cart', attributes: ['id', 'name'] },
      { model: User, as: 'inviter', attributes: ['id', 'username', 'avatar'] },
    ],
  });

  if (!invitation) {
    throw new AppError('Invitation not found', 404);
  }

  // Check if expired
  if (new Date() > invitation.expiresAt) {
    if (invitation.status === 'pending') {
      invitation.status = 'expired';
      await invitation.save();
    }
    throw new AppError('Invitation has expired', 400);
  }

  // Check status
  if (invitation.status !== 'pending') {
    throw new AppError(`Invitation is ${invitation.status}`, 400);
  }

  return invitation;
};

/**
 * Accept invitation
 */
export const acceptInvitation = async (token, userId) => {
  const invitation = await getInvitationByToken(token);

  // Check if user is already in cart
  const existingMembership = await CartUser.findOne({
    where: { cartId: invitation.cartId, userId },
  });

  if (existingMembership) {
    throw new AppError('You are already a member of this cart', 400);
  }

  // Add user to cart
  await CartUser.create({
    cartId: invitation.cartId,
    userId,
    role: invitation.role,
  });

  // Update invitation status
  invitation.status = 'accepted';
  await invitation.save();

  // Get cart details
  const cart = await Cart.findByPk(invitation.cartId, {
    include: [
      { model: User, as: 'owner', attributes: ['id', 'username', 'avatar'] },
    ],
  });

  return { cart, role: invitation.role };
};

/**
 * Revoke invitation
 */
export const revokeInvitation = async (invitationId, userId) => {
  const invitation = await Invitation.findByPk(invitationId);

  if (!invitation) {
    throw new AppError('Invitation not found', 404);
  }

  // Check permission
  const cartUser = await CartUser.findOne({
    where: { cartId: invitation.cartId, userId },
  });

  if (!cartUser || !['owner', 'admin'].includes(cartUser.role)) {
    throw new AppError('Permission denied', 403);
  }

  if (invitation.status !== 'pending') {
    throw new AppError('Can only revoke pending invitations', 400);
  }

  invitation.status = 'revoked';
  await invitation.save();

  return { message: 'Invitation revoked successfully' };
};

/**
 * Get cart invitations
 */
export const getCartInvitations = async (cartId, userId) => {
  // Check permission
  const cartUser = await CartUser.findOne({
    where: { cartId, userId },
  });

  if (!cartUser || !['owner', 'admin'].includes(cartUser.role)) {
    throw new AppError('Permission denied', 403);
  }

  const invitations = await Invitation.findAll({
    where: { cartId, status: 'pending' },
    include: [
      { model: User, as: 'inviter', attributes: ['id', 'username', 'avatar'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return invitations;
};
