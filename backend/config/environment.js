import dotenv from 'dotenv';

dotenv.config();

export const environment = {
  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'better_shoppy',

  // Server
  PORT: process.env.PORT || 4000,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Invitations
  INVITATION_EXPIRY_DAYS: parseInt(process.env.INVITATION_EXPIRY_DAYS || '7', 10),
};
