import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default config;