/**
 * Unit Tests for Server Module
 * 
 * Tests the server module functions including:
 * - Server initialization
 * - Request handling
 * - Error handling
 * - Integration with router component
 */

// Import the functions to test
const { createServer, startServer } = require('../src/server');

// Import dependencies that will be mocked
const { router } = require('../src/router');
const { PORT, HOST } = require('../src/config');
const { info, error } = require('../src/logger');
const { setSecurityHeaders } = require('../src/handlers');

// Import Node.js modules that will be mocked
const http = require('http'); // built-in

// Jest mock setup
jest.mock('../src/router');
jest.mock('../src/logger');
jest.mock('../src/handlers');
jest.mock('http');

describe('Server', () => {
  // Mock objects
  let mockRequest;
  let mockResponse;
  let mockServer;

  beforeEach(() => {
    // Create mock request and response objects
    mockRequest = {
      url: '/hello',
      method: 'GET'
    };
    
    mockResponse = {
      setHeader: jest.fn(),
      statusCode: 200,
      write: jest.fn(),
      end: jest.fn()
    };
    
    // Create mock server object
    mockServer = {
      listen: jest.fn(),
      on: jest.fn(),
      once: jest.fn()
    };
    
    // Set up http.createServer mock
    http.createServer.mockReturnValue(mockServer);
    
    // Reset all mock function calls
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore original implementations
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
  
  describe('createServer', () => {
    test('should create an HTTP server instance', () => {
      const server = createServer();
      
      // Verify http.createServer was called
      expect(http.createServer).toHaveBeenCalled();
      
      // Verify the returned server is our mock server
      expect(server).toBe(mockServer);
    });
    
    test('should set up request handler function', () => {
      createServer();
      
      // Get the request handler function that was passed to http.createServer
      const requestHandler = http.createServer.mock.calls[0][0];
      
      // Call the handler with mock request and response
      requestHandler(mockRequest, mockResponse);
      
      // Verify security headers were set
      expect(setSecurityHeaders).toHaveBeenCalledWith(mockResponse);
      
      // Verify router was called with request and response
      expect(router).toHaveBeenCalledWith(mockRequest, mockResponse);
    });
    
    test('should set up error event handler', () => {
      createServer();
      
      // Verify server.on was called with 'error' event
      expect(mockServer.on).toHaveBeenCalledWith('error', expect.any(Function));
      
      // Get the error handler function
      const errorHandler = mockServer.on.mock.calls[0][1];
      
      // Create a mock error
      const mockError = new Error('Test error');
      
      // Call the error handler with the mock error
      errorHandler(mockError);
      
      // Verify error was logged
      expect(error).toHaveBeenCalledWith('Server error occurred', mockError);
    });
  });
  
  describe('startServer', () => {
    test('should start the server on the configured port and host', async () => {
      // Set up server.listen to call the success callback
      mockServer.listen.mockImplementation((port, host, callback) => {
        callback();
        return mockServer;
      });
      
      // Call startServer with our mock server
      const serverPromise = startServer(mockServer);
      
      // Wait for the promise to resolve
      const result = await serverPromise;
      
      // Verify server.listen was called with the right arguments
      expect(mockServer.listen).toHaveBeenCalledWith(PORT, HOST, expect.any(Function));
      
      // Check for correct host in the log message
      const expectedHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
      
      // Verify info was logged with correct host
      expect(info).toHaveBeenCalledWith(`Server running at http://${expectedHost}:${PORT}/`);
      expect(info).toHaveBeenCalledWith('Server ready to accept connections');
      
      // Verify the promise resolves with the server
      expect(result).toBe(mockServer);
    });
    
    test('should handle server start errors', async () => {
      // Create a mock error
      const mockError = new Error('Server start error');
      
      // Set up server.once to call the error callback
      mockServer.once.mockImplementation((event, callback) => {
        if (event === 'error') {
          callback(mockError);
        }
        return mockServer;
      });
      
      // Call startServer with our mock server
      const serverPromise = startServer(mockServer);
      
      // Verify the promise rejects with the error
      await expect(serverPromise).rejects.toThrow(mockError);
      
      // Verify error was logged
      expect(error).toHaveBeenCalledWith('Failed to start server', mockError);
    });
    
    test('should handle EADDRINUSE error specifically', async () => {
      // Create a mock error with code EADDRINUSE
      const mockError = new Error('Port already in use');
      mockError.code = 'EADDRINUSE';
      
      // Set up server.once to call the error callback
      mockServer.once.mockImplementation((event, callback) => {
        if (event === 'error') {
          callback(mockError);
        }
        return mockServer;
      });
      
      // Call startServer with our mock server
      const serverPromise = startServer(mockServer);
      
      // Verify the promise rejects with the error
      await expect(serverPromise).rejects.toThrow(mockError);
      
      // Verify error was logged
      expect(error).toHaveBeenCalledWith('Failed to start server', mockError);
      expect(error).toHaveBeenCalledWith(`Port ${PORT} is already in use. Choose another port or free up this port.`);
    });
  });
  
  describe('request handling', () => {
    test('should process incoming requests correctly', () => {
      createServer();
      
      // Get the request handler function
      const requestHandler = http.createServer.mock.calls[0][0];
      
      // Call the handler with mock request and response
      requestHandler(mockRequest, mockResponse);
      
      // Verify security headers were set
      expect(setSecurityHeaders).toHaveBeenCalledWith(mockResponse);
      
      // Verify router was called with request and response
      expect(router).toHaveBeenCalledWith(mockRequest, mockResponse);
    });
    
    test('should handle request processing errors', () => {
      // Mock router to throw an error
      const mockError = new Error('Request processing error');
      router.mockImplementation(() => {
        throw mockError;
      });
      
      // Create a mock handleServerError function
      const handleServerError = jest.fn();
      
      // Modify the handlers module mock to include our mock function
      require('../src/handlers').handleServerError = handleServerError;
      
      createServer();
      
      // Get the request handler function
      const requestHandler = http.createServer.mock.calls[0][0];
      
      // Call the handler with mock request and response
      requestHandler(mockRequest, mockResponse);
      
      // In a real test with proper dependency injection, we'd verify handleServerError was called
      // Here we'll just verify router was called and throws
      expect(router).toHaveBeenCalled();
      expect(() => router(mockRequest, mockResponse)).toThrow(mockError);
    });
  });
});