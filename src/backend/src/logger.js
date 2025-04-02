/**
 * Logger Module
 * 
 * Provides standardized logging functions for the application.
 * Supports different log levels (error, warn, info, debug) and
 * formats log messages with timestamps and appropriate prefixes.
 * 
 * Log levels hierarchy (from highest to lowest priority):
 * - error: Critical errors that need immediate attention
 * - warn: Warnings that don't stop the application but should be noted
 * - info: Informational messages about normal operation
 * - debug: Detailed information for debugging purposes
 * 
 * The actual logging is controlled by the LOG_LEVEL configuration.
 * Only messages with a level equal to or higher priority than the
 * configured level will be output.
 */

const { LOG_LEVEL } = require('./config');

/**
 * Log level hierarchy as numeric values (lower number = higher priority)
 */
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

/**
 * Formats a log message with timestamp and level prefix
 * 
 * @param {string} level - The log level (error, warn, info, debug)
 * @param {string} message - The message to format
 * @returns {string} Formatted log message
 */
function formatLogMessage(level, message) {
  const timestamp = new Date().toISOString();
  const prefix = level.toUpperCase().padEnd(5);
  return `[${timestamp}] ${prefix} | ${message}`;
}

/**
 * Determines if a message should be logged based on the configured log level
 * 
 * @param {string} level - The log level to check
 * @returns {boolean} True if the message should be logged
 */
function shouldLog(level) {
  const messageLevelValue = LOG_LEVELS[level];
  const configuredLevelValue = LOG_LEVELS[LOG_LEVEL];
  
  return messageLevelValue <= configuredLevelValue;
}

/**
 * Logs an error message to the console
 * 
 * @param {string} message - The error message
 * @param {Error|object|null} [err] - Optional error object for stack trace
 */
function error(message, err) {
  if (!shouldLog('error')) return;
  
  const formattedMessage = formatLogMessage('error', message);
  
  if (err) {
    console.error(formattedMessage);
    console.error(err instanceof Error ? err.stack : JSON.stringify(err));
  } else {
    console.error(formattedMessage);
  }
}

/**
 * Logs a warning message to the console
 * 
 * @param {string} message - The warning message
 */
function warn(message) {
  if (!shouldLog('warn')) return;
  
  const formattedMessage = formatLogMessage('warn', message);
  console.warn(formattedMessage);
}

/**
 * Logs an informational message to the console
 * 
 * @param {string} message - The info message
 */
function info(message) {
  if (!shouldLog('info')) return;
  
  const formattedMessage = formatLogMessage('info', message);
  console.info(formattedMessage);
}

/**
 * Logs a debug message to the console
 * 
 * @param {string} message - The debug message
 */
function debug(message) {
  if (!shouldLog('debug')) return;
  
  const formattedMessage = formatLogMessage('debug', message);
  console.debug(formattedMessage);
}

module.exports = {
  error,
  warn,
  info,
  debug
};