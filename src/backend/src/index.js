/**
 * Main Application Entry Point
 * 
 * This is the main entry point for the Node.js HTTP server application.
 * It initializes and starts the server, handles uncaught exceptions,
 * and implements graceful shutdown procedures.
 * 
 * Requirements addressed:
 * - F-001-RQ-001: The system shall implement an HTTP server using Node.js
 * - F-001-RQ-002: The server shall log startup information to the console
 * - F-003-RQ-001: The system shall return a 404 status code for requests to undefined routes
 */

// Import server creation and starting functions
const { createServer, startServer } = require('./server');

// Import configuration settings
const { PORT, NODE_ENV } = require('./config');

// Import logging functions
const { info, error } = require('./logger');

/**
 * Main application function that initializes and starts the HTTP server
 * 
 * @returns {Promise<void>} Promise that resolves when the server has started successfully
 */
async function main() {
  try {
    // Log application startup information
    info(`Starting application in ${NODE_ENV} mode`);
    info(`Node.js version: ${process.version}`);
    
    // Create the HTTP server instance
    const server = createServer();
    
    // Set up process event handlers for graceful shutdown and uncaught exceptions
    setupProcessHandlers(server);
    
    // Start the server
    await startServer(server);
    
    info('Application started successfully');
  } catch (err) {
    error('Failed to start application', err);
    process.exit(1);
  }
}

/**
 * Sets up process event handlers for graceful shutdown and uncaught exceptions
 * 
 * @param {http.Server} server - The HTTP server instance
 */
function setupProcessHandlers(server) {
  // Handle SIGTERM signal for graceful shutdown
  process.on('SIGTERM', () => {
    gracefulShutdown(server, 'SIGTERM');
  });
  
  // Handle SIGINT signal for graceful shutdown (e.g., Ctrl+C)
  process.on('SIGINT', () => {
    gracefulShutdown(server, 'SIGINT');
  });
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    handleUncaughtException(err);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    error('Unhandled Promise Rejection', { reason, promise });
    // In production, we might want to shut down the server
    if (NODE_ENV === 'production') {
      gracefulShutdown(server, 'UNHANDLED_REJECTION');
    }
  });
}

/**
 * Gracefully shuts down the HTTP server and exits the process
 * 
 * @param {http.Server} server - The HTTP server instance
 * @param {string} signal - The signal that triggered the shutdown
 */
function gracefulShutdown(server, signal) {
  info(`Shutdown initiated (${signal})`);
  
  // Set a timeout to force exit if graceful shutdown takes too long
  const forceExit = setTimeout(() => {
    error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000); // 10 seconds
  
  // Close the server
  server.close(() => {
    info('Server closed successfully');
    clearTimeout(forceExit);
    process.exit(0);
  });
}

/**
 * Handles uncaught exceptions to prevent application crashes
 * 
 * @param {Error} err - The uncaught exception
 */
function handleUncaughtException(err) {
  error('Uncaught Exception', err);
  
  // In production, we should shut down and let the process manager restart
  if (NODE_ENV === 'production') {
    process.exit(1);
  }
  
  // In development, keep the process running for debugging
  // but it's still better to fix the error
}

// Start the application
main();