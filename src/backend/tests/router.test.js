/**
 * Unit tests for the router module
 * 
 * Verifies proper URL parsing, request routing, and handler selection
 * based on path and HTTP method. Ensures that the router correctly
 * directs requests to appropriate handlers according to the routing rules.
 */

// Import the router function to be tested
const { router } = require('../../src/router');

// Import handlers for verification
const { 
  handleHello, 
  handleNotFound, 
  handleMethodNotAllowed 
} = require('../../src/handlers');

// Import logging functions for verification
const { info, debug } = require('../../src/logger');

// Mock the handlers and logger functions
jest.mock('../../src/handlers');
jest.mock('../../src/logger');

describe('Router', () => {
  let req, res;
  
  // Setup before each test
  beforeEach(() => {
    // Clear all mock function data
    jest.clearAllMocks();
    
    // Create mock request and response objects
    req = {
      url: '/hello',
      method: 'GET'
    };
    
    res = {
      setHeader: jest.fn(),
      statusCode: 200,
      write: jest.fn(),
      end: jest.fn()
    };
  });
  
  // Teardown after each test
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  describe('parseUrl', () => {
    test('should extract path from URL', () => {
      // Set request URL
      req.url = '/hello';
      
      // Call the router
      router(req, res);
      
      // Verify hello handler was called
      expect(handleHello).toHaveBeenCalledWith(req, res);
      expect(handleNotFound).not.toHaveBeenCalled();
    });
    
    test('should normalize paths with trailing slashes', () => {
      // Set request URL with trailing slash
      req.url = '/hello/';
      
      // Call the router
      router(req, res);
      
      // Verify hello handler was called despite trailing slash
      expect(handleHello).toHaveBeenCalledWith(req, res);
      expect(handleNotFound).not.toHaveBeenCalled();
    });
    
    test('should handle URLs with query parameters', () => {
      // Set request URL with query parameters
      req.url = '/hello?param=value';
      
      // Call the router
      router(req, res);
      
      // Verify hello handler was called despite query parameters
      expect(handleHello).toHaveBeenCalledWith(req, res);
      expect(handleNotFound).not.toHaveBeenCalled();
    });
    
    test('should be case sensitive for paths', () => {
      // Set request URL with different case
      req.url = '/HELLO';
      
      // Call the router
      router(req, res);
      
      // Verify not found handler was called due to case sensitivity
      expect(handleNotFound).toHaveBeenCalledWith(req, res);
      expect(handleHello).not.toHaveBeenCalled();
    });
  });
  
  describe('route handling', () => {
    test('should route /hello path to handleHello', () => {
      // Set request URL and method
      req.url = '/hello';
      req.method = 'GET';
      
      // Call the router
      router(req, res);
      
      // Verify hello handler was called
      expect(handleHello).toHaveBeenCalledWith(req, res);
      expect(handleNotFound).not.toHaveBeenCalled();
    });
    
    test('should route invalid paths to handleNotFound', () => {
      // Set request URL to an invalid path
      req.url = '/invalid';
      req.method = 'GET';
      
      // Call the router
      router(req, res);
      
      // Verify not found handler was called
      expect(handleNotFound).toHaveBeenCalledWith(req, res);
      expect(handleHello).not.toHaveBeenCalled();
    });
    
    test('should route root path to handleNotFound', () => {
      // Set request URL to root path
      req.url = '/';
      req.method = 'GET';
      
      // Call the router
      router(req, res);
      
      // Verify not found handler was called
      expect(handleNotFound).toHaveBeenCalledWith(req, res);
      expect(handleHello).not.toHaveBeenCalled();
    });
    
    test('should validate HTTP methods', () => {
      // Set request URL and non-GET method
      req.url = '/hello';
      req.method = 'POST';
      
      // Call the router
      router(req, res);
      
      // Verify hello handler was called
      // Note: Method validation happens inside handleHello, not in the router
      expect(handleHello).toHaveBeenCalledWith(req, res);
      expect(handleMethodNotAllowed).not.toHaveBeenCalled();
    });
  });
  
  describe('logging', () => {
    test('should log incoming requests', () => {
      // Set request URL and method
      req.url = '/hello';
      req.method = 'GET';
      
      // Call the router
      router(req, res);
      
      // Verify info logging was called with request information
      expect(info).toHaveBeenCalledWith(expect.stringContaining('Request received: GET /hello'));
    });
    
    test('should log detailed routing information', () => {
      // Set request URL and method
      req.url = '/hello';
      req.method = 'GET';
      
      // Call the router
      router(req, res);
      
      // Verify debug logging was called with routing information
      expect(debug).toHaveBeenCalledWith(expect.stringContaining('Routing GET /hello to Hello handler'));
    });
    
    test('should log routing to error handler', () => {
      // Set request URL to an invalid path
      req.url = '/invalid';
      req.method = 'GET';
      
      // Call the router
      router(req, res);
      
      // Verify logging of request and routing to error handler
      expect(info).toHaveBeenCalledWith(expect.stringContaining('Request received: GET /invalid'));
      expect(debug).toHaveBeenCalledWith(expect.stringContaining('Routing GET /invalid to Not Found handler'));
    });
  });
});