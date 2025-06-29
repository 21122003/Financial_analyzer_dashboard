import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

if (!fs.existsSync('.env')) {
  console.warn('⚠️ .env file not found. Make sure env vars are provided via the environment.');
}

/**
 * Safely gets an environment variable.
 */
const getEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`❌ Environment variable ${name} is required`);
  }
  return value;
};

export const config = {
  PORT: parseInt(getEnvVar('PORT', '5000'), 10),
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  MONGODB_URI: getEnvVar('MONGODB_URI', ''),
  JWT_SECRET: getEnvVar('JWT_SECRET', ''),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '2h'),
  FRONTEND_URL: getEnvVar('FRONTEND_URL', 'http://localhost:3000'),

  RATE_LIMIT_WINDOW_MS: parseInt(getEnvVar('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(getEnvVar('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
};

export const isProduction = config.NODE_ENV === 'production';
export const isDevelopment = config.NODE_ENV === 'development';
