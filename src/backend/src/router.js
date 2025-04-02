/**
 * Request Router Module
 *
 * This module is responsible for examining incoming HTTP requests, extracting the URL path and HTTP method,
 * and routing the request to the appropriate handler based on the path.
 * 
 * It implements the routing logic for the /hello endpoint and handles invalid routes as per the
 * requirements in the technical specification.
 */

// Import Node.js built-in URL module for parsing request URLs
const url = require('url'); // built-in

// Import handler functions from handlers module
const { handleHello, handleNotFound, handleMethodNotAllowed } = require('./handlers');

// Import logging functions
const { info, debug } = require('./logger');

/**
 * Parses the URL from the request object to extract the path
 * 
 * @param {object} req - HTTP request object
 * @returns {string} The normalized path from the request URL
 */
function parseUrl(req) {
  // Parse the request URL
  const parsedUrl = url.parse(req.url, true);
  
  // Extract the pathname from the parsed URL
  let path = parsedUrl.pathname || '/';
  
  // Normalize the path: remove trailing slashes
  path = path.replace(/\/+$/, '');
  if (path === '') path = '/';
  
  return path;
}

/**
 * Routes incoming HTTP requests to the appropriate handler based on the URL path and HTTP method
 * 
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 */
function router(req, res) {
  // Parse the URL path from the request
  const path = parseUrl(req);
  
  // Log the incoming request
  info(`Request received: ${req.method} ${path}`);
  
  // Route the request based on the path
  if (path === '/hello') {
    debug(`Routing ${req.method} ${path} to Hello handler`);
    handleHello(req, res);
  } else {
    debug(`Routing ${req.method} ${path} to Not Found handler`);
    handleNotFound(req, res);
  }
}

// Export the router function
module.exports = {
  router
};