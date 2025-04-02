/**
 * Configuration Module
 * 
 * Centralizes all application configuration settings.
 * Loads environment variables, applies default values, and exports 
 * configuration constants used throughout the application.
 * 
 * This module handles:
 * - Loading values from environment variables
 * - Validating configuration values
 * - Providing defaults when values are missing or invalid
 * - Exporting a consistent configuration interface for the application
 */

// Default configuration values
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_NODE_ENV = 'development';
const DEFAULT_LOG_LEVEL = 'info';
const VALID_LOG_LEVELS = ['error', 'warn', 'info', 'debug'];

/**
 * Retrieves an environment variable value or returns the default if not set
 * 
 * @param {string} name - The name of the environment variable
 * @param {any} defaultValue - The default value to use if environment variable is not set
 * @returns {any} The environment variable value or the default value
 */
function getEnv(name, defaultValue) {
  return process.env[name] !== undefined ? process.env[name] : defaultValue;
}

/**
 * Validates that the port is a number within the valid range (1024-65535)
 * 
 * @param {any} port - The port value to validate
 * @returns {number} Validated port number
 */
function validatePort(port) {
  const numPort = Number(port);
  
  if (isNaN(numPort) || numPort < 1024 || numPort > 65535) {
    console.warn(`Invalid port ${port}, using default port ${DEFAULT_PORT}`);
    return DEFAULT_PORT;
  }
  
  return numPort;
}

/**
 * Validates that the log level is one of the allowed values
 * 
 * @param {string} level - The log level to validate
 * @returns {string} Validated log level
 */
function validateLogLevel(level) {
  if (!VALID_LOG_LEVELS.includes(level)) {
    console.warn(`Invalid log level ${level}, using default log level ${DEFAULT_LOG_LEVEL}`);
    return DEFAULT_LOG_LEVEL;
  }
  
  return level;
}

// Load and validate configuration from environment variables
const PORT = validatePort(getEnv('PORT', DEFAULT_PORT));
const HOST = getEnv('HOST', DEFAULT_HOST);
const NODE_ENV = getEnv('NODE_ENV', DEFAULT_NODE_ENV);
const LOG_LEVEL = validateLogLevel(getEnv('LOG_LEVEL', DEFAULT_LOG_LEVEL));

// Log configuration on startup
console.info('Application configuration loaded:');
console.info(`- PORT: ${PORT}`);
console.info(`- HOST: ${HOST}`);
console.info(`- NODE_ENV: ${NODE_ENV}`);
console.info(`- LOG_LEVEL: ${LOG_LEVEL}`);

// Export configuration constants
module.exports = {
  PORT,
  HOST,
  NODE_ENV,
  LOG_LEVEL
};