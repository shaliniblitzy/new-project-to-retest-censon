/**
 * Unit Tests for Error Handler Module
 * 
 * Tests error handling functionality including 404 Not Found, 
 * 405 Method Not Allowed, and 500 Internal Server Error responses.
 * Also verifies security headers and response time requirements.
 */

// Import error handler functions
const { 
  handleNotFound, 
  handleMethodNotAllowed, 
  handleServerError, 
  setSecurityHeaders 
} = require('../../src/handlers/errorHandler');

// Import logger for mocking
const { error, info } = require('../../src/logger');

// Mock logger functions to prevent console output during tests
jest.mock('../../src/logger', () => ({
  error: jest.fn(),
  info: jest.fn()
}));

describe('Error Handler', () => {
  // Mock request and response objects
  let req;
  let res;

  beforeEach(() => {
    // Reset mock data before each test
    jest.clearAllMocks();
    
    // Create mock request object
    req = {
      url: '/test',
      method: 'GET'
    };
    
    // Create mock response object with jest mock functions
    res = {
      statusCode: 200,
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn()
    };
  });

  afterEach(() => {
    // Clean up after each test
    jest.resetAllMocks();
  });

  test('handleNotFound should return 404 with Not Found message', () => {
    // Call the function with mock objects
    handleNotFound(req, res);
    
    // Verify status code is set to 404
    expect(res.statusCode).toBe(404);
    
    // Verify Content-Type header is set
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Verify security headers are set
    expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Security-Policy', "default-src 'none'");
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
    
    // Verify response body
    expect(res.write).toHaveBeenCalledWith('Not Found');
    
    // Verify response is ended
    expect(res.end).toHaveBeenCalled();
    
    // Verify error is logged
    expect(error).toHaveBeenCalledWith(`404 Not Found: ${req.url}`);
  });

  test('handleMethodNotAllowed should return 405 with Method Not Allowed message', () => {
    // Call the function with mock objects
    handleMethodNotAllowed(req, res);
    
    // Verify status code is set to 405
    expect(res.statusCode).toBe(405);
    
    // Verify Content-Type header is set
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Verify security headers are set
    expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Security-Policy', "default-src 'none'");
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
    
    // Verify response body
    expect(res.write).toHaveBeenCalledWith('Method Not Allowed');
    
    // Verify response is ended
    expect(res.end).toHaveBeenCalled();
    
    // Verify error is logged
    expect(error).toHaveBeenCalledWith(`405 Method Not Allowed: ${req.method} ${req.url}`);
  });

  test('handleServerError should return 500 with Internal Server Error message', () => {
    // Create mock error object
    const err = new Error('Test error');
    
    // Call the function with mock objects
    handleServerError(req, res, err);
    
    // Verify status code is set to 500
    expect(res.statusCode).toBe(500);
    
    // Verify Content-Type header is set
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Verify security headers are set
    expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Security-Policy', "default-src 'none'");
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
    
    // Verify response body
    expect(res.write).toHaveBeenCalledWith('Internal Server Error');
    
    // Verify response is ended
    expect(res.end).toHaveBeenCalled();
    
    // Verify error is logged with error object
    expect(error).toHaveBeenCalledWith(`500 Internal Server Error: ${req.url}`, err);
  });

  test('setSecurityHeaders should set appropriate security headers', () => {
    // Call the function with mock response
    setSecurityHeaders(res);
    
    // Verify all security headers are set correctly
    expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Security-Policy', "default-src 'none'");
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
  });

  test('Error handlers should respond in less than 50ms', () => {
    // Create mock error object
    const err = new Error('Test error');
    
    // Test response time for handleNotFound
    const notFoundStart = performance.now();
    handleNotFound(req, res);
    const notFoundTime = performance.now() - notFoundStart;
    
    // Test response time for handleMethodNotAllowed
    const methodNotAllowedStart = performance.now();
    handleMethodNotAllowed(req, res);
    const methodNotAllowedTime = performance.now() - methodNotAllowedStart;
    
    // Test response time for handleServerError
    const serverErrorStart = performance.now();
    handleServerError(req, res, err);
    const serverErrorTime = performance.now() - serverErrorStart;
    
    // Verify all response times are less than 50ms
    expect(notFoundTime).toBeLessThan(50);
    expect(methodNotAllowedTime).toBeLessThan(50);
    expect(serverErrorTime).toBeLessThan(50);
  });
});