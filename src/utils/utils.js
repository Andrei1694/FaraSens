import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config.js';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

export async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

