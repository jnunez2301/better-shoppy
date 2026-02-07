import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../model/index.js';
import { environment } from '../config/environment.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Register a new user
 */
export const registerUser = async ({ username, password, avatar }) => {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    username,
    password: hashedPassword,
    avatar: avatar || 'avatar-1',
  });

  // Generate token
  const token = generateToken(user.id);

  // Return user without password
  const userResponse = user.toJSON();
  delete userResponse.password;

  return { user: userResponse, token };
};

/**
 * Login user
 */
export const loginUser = async ({ username, password }) => {
  // Find user
  const user = await User.findOne({ where: { username } });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate token
  const token = generateToken(user.id);

  // Return user without password
  const userResponse = user.toJSON();
  delete userResponse.password;

  return { user: userResponse, token };
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

/**
 * Update user profile
 */
/**
 * Update user profile
 */
export const updateUserProfile = async (userId, { avatar, theme }) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update fields
  if (avatar) {
    user.avatar = avatar;
  }
  if (theme) {
    user.theme = theme;
  }

  await user.save();

  // Return updated user without password
  const userResponse = user.toJSON();
  delete userResponse.password;

  return userResponse;
};

/**
 * Change password
 */
export const changePassword = async (userId, { oldPassword, newPassword }) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check old password
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid current password', 401);
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return { message: 'Password updated successfully' };
};

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, environment.JWT_SECRET, {
    expiresIn: environment.JWT_EXPIRES_IN,
  });
};
