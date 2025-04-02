/**
 * Hello Endpoint Handler Module
 * 
 * Handles requests to the `/hello` endpoint by returning a 'Hello world' text
 * response with appropriate HTTP headers and status code.
 * 
 * Requirements:
 * - Responds to GET requests with 'Hello world' text and 200 status code
 * - Sets appropriate Content-Type and security headers
 * - Forwards non-GET requests to method not allowed handler
 * - Logs request information
 */

const { info } = require('../logger');
const { setSecurityHeaders, handleMethodNotAllowed } = require('./errorHandler');

/**
 * Handles GET requests to the /hello endpoint by returning a 'Hello world' text response
 * 
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 */
function handleHello(req, res) {
  // Check if the request method is GET
  if (req.method !== 'GET') {
    // Forward non-GET requests to the method not allowed handler
    return handleMethodNotAllowed(req, res);
  }
  
  // Set status code to 200 OK
  res.statusCode = 200;
  
  // Set Content-Type header to text/plain
  res.setHeader('Content-Type', 'text/plain');
  
  // Apply security headers
  setSecurityHeaders(res);
  
  // Log the successful request
  info(`200 OK: GET ${req.url}`);
  
  // Send 'Hello world' response and end the request
  res.write('Hello world');
  res.end();
}

module.exports = {
  handleHello
};