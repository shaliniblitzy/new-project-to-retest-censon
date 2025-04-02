/**
 * Error Handler Module
 * 
 * Provides functions for handling various HTTP error conditions and
 * setting security headers on responses. Supports standard error scenarios
 * like 404 Not Found, 405 Method Not Allowed, and 500 Internal Server Error.
 */

const { error, info } = require('../logger');

/**
 * Sets basic security headers on HTTP responses to improve security posture
 * 
 * @param {object} res - HTTP response object
 */
function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  res.setHeader('Cache-Control', 'no-store');
}

/**
 * Handles requests to undefined routes by returning a 404 Not Found response
 * 
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 */
function handleNotFound(req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  setSecurityHeaders(res);
  
  error(`404 Not Found: ${req.url}`);
  
  res.write('Not Found');
  res.end();
}

/**
 * Handles requests with invalid HTTP methods by returning a 405 Method Not Allowed response
 * 
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 */
function handleMethodNotAllowed(req, res) {
  res.statusCode = 405;
  res.setHeader('Content-Type', 'text/plain');
  setSecurityHeaders(res);
  
  error(`405 Method Not Allowed: ${req.method} ${req.url}`);
  
  res.write('Method Not Allowed');
  res.end();
}

/**
 * Handles unexpected server errors by returning a 500 Internal Server Error response
 * 
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 * @param {Error} err - The error that occurred
 */
function handleServerError(req, res, err) {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain');
  setSecurityHeaders(res);
  
  error(`500 Internal Server Error: ${req.url}`, err);
  
  res.write('Internal Server Error');
  res.end();
}

module.exports = {
  handleNotFound,
  handleMethodNotAllowed,
  handleServerError,
  setSecurityHeaders
};