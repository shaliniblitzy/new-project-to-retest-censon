/**
 * Handlers Index Module
 * 
 * Aggregates and exports all handler functions from the handlers directory,
 * providing a centralized import point for the router and other modules
 * that need to use these handlers.
 * 
 * This module improves maintainability by creating a single import point
 * for all handler-related functionality, supporting the component organization
 * requirement from the technical specifications.
 */

// Import handler functions from their respective modules
const { handleHello } = require('./helloHandler');
const { 
  handleNotFound,
  handleMethodNotAllowed,
  handleServerError,
  setSecurityHeaders
} = require('./errorHandler');

// Export all handler functions to provide a unified interface
module.exports = {
  // Handler for the /hello endpoint
  handleHello,
  
  // Error handling functions
  handleNotFound,
  handleMethodNotAllowed,
  handleServerError,
  
  // Security utility function
  setSecurityHeaders
};