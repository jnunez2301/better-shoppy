import * as invitationService from '../service/invitationService.js';

/**
 * Create invitation
 * POST /api/carts/:cartId/invitations
 */
export const createInvitation = async (req, res, next) => {
  try {
    const { invitedUsername, role, singleUse } = req.body;

    if (!invitedUsername) {
      return res.status(400).json({
        success: false,
        error: 'Invited username is required',
      });
    }

    const invitation = await invitationService.createInvitation(
      req.params.cartId,
      req.user.id,
      { invitedUsername, role, singleUse }
    );

    res.status(201).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get invitation by token
 * GET /api/invitations/:token
 */
export const getInvitation = async (req, res, next) => {
  try {
    const invitation = await invitationService.getInvitationByToken(req.params.token);

    res.status(200).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Accept invitation
 * POST /api/invitations/:token/accept
 */
export const acceptInvitation = async (req, res, next) => {
  try {
    const result = await invitationService.acceptInvitation(req.params.token, req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke invitation
 * DELETE /api/invitations/:id
 */
export const revokeInvitation = async (req, res, next) => {
  try {
    const result = await invitationService.revokeInvitation(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get cart invitations
 * GET /api/carts/:cartId/invitations
 */
export const getCartInvitations = async (req, res, next) => {
  try {
    const invitations = await invitationService.getCartInvitations(
      req.params.cartId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    next(error);
  }
};
