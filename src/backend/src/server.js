/**
 * Core HTTP Server Module
 * 
 * This module creates and manages the Node.js HTTP server instance.
 * It handles server initialization, request processing, and provides
 * functions to start the server on the configured port.
 * 
 * Implements the requirements from:
 * - F-001-RQ-001: The system shall implement an HTTP server using Node.js
 * - F-001-RQ-002: The server shall log startup information to the console
 */

// Import Node.js built-in HTTP module
const http = require('http'); // built-in

// Import router function from router module
const { router } = require('./router');

// Import configuration constants
const { PORT, HOST } = require('./config');

// Import logging functions
const { info, error } = require('./logger');

// Import security utility
const { setSecurityHeaders } = require('./handlers');

/**
 * Handles incoming HTTP requests by setting security headers and routing
 * to the appropriate handler
 * 
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 */
function requestHandler(req, res) {
  try {
    // Set security headers on all responses
    setSecurityHeaders(res);
    
    // Route the request to the appropriate handler
    router(req, res);
  } catch (err) {
    // Import the handler dynamically to avoid circular dependencies
    const { handleServerError } = require('./handlers');
    handleServerError(req, res, err);
  }
}

/**
 * Creates and initializes an HTTP server instance
 * 
 * @returns {http.Server} The created HTTP server instance
 */
function createServer() {
  // Create an HTTP server instance with the request handler
  const server = http.createServer(requestHandler);
  
  // Set up server error event handler
  server.on('error', handleServerError);
  
  return server;
}

/**
 * Starts the HTTP server on the configured port and host
 * 
 * @param {http.Server} server - The HTTP server instance to start
 * @returns {Promise<http.Server>} Promise that resolves with the server instance when successfully started
 */
function startServer(server) {
  return new Promise((resolve, reject) => {
    // Listen on the configured port and host
    server.listen(PORT, HOST, () => {
      // Log server startup information
      info(`Server running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/`);
      info(`Server ready to accept connections`);
      resolve(server);
    });
    
    // Handle server startup errors
    server.once('error', (err) => {
      error('Failed to start server', err);
      reject(err);
    });
  });
}

/**
 * Handles server-level errors to prevent application crashes
 * 
 * @param {Error} err - The error that occurred
 */
function handleServerError(err) {
  error('Server error occurred', err);
  
  // Provide specific error message for port conflicts
  if (err.code === 'EADDRINUSE') {
    error(`Port ${PORT} is already in use. Choose another port or free up this port.`);
  }
}

// Export server creation and starting functions
module.exports = {
  createServer,
  startServer
};