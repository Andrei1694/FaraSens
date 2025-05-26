// src/config/logger.js
import winston from 'winston';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = 'logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'sens',
    version: process.env.npm_package_version || '1.0.0'
  },
  transports: [
    // Error logs
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined logs
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Morgan HTTP logger - integrate with Winston
export const httpLogger = morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim(), { type: 'http_request' })
  },
  skip: (req, res) => {
    // Skip logging health check requests to reduce noise
    return req.url === '/health' || req.url === '/ready';
  }
});

// Morgan for errors only
export const errorHttpLogger = morgan('combined', {
  stream: {
    write: (message) => logger.error(message.trim(), { type: 'http_error' })
  },
  skip: (req, res) => res.statusCode < 400
});

export default logger;