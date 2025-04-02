/**
 * Unit Tests for Hello Endpoint Handler
 * 
 * Tests the hello handler module to verify it properly handles GET requests to
 * the /hello endpoint, returning "Hello world" with correct headers and status code.
 */

const { handleHello } = require('../../src/handlers/helloHandler');
const { handleMethodNotAllowed, setSecurityHeaders } = require('../../src/handlers/errorHandler');
const { info } = require('../../src/logger');

// Mock dependencies
jest.mock('../../src/logger', () => ({
  info: jest.fn()
}));

jest.mock('../../src/handlers/errorHandler', () => {
  const original = jest.requireActual('../../src/handlers/errorHandler');
  return {
    ...original,
    handleMethodNotAllowed: jest.fn(),
    setSecurityHeaders: jest.fn()
  };
});

describe('Hello Handler', () => {
  // Mock request and response objects
  let req;
  let res;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Create mock request and response objects
    req = {
      method: 'GET',
      url: '/hello'
    };
    
    res = {
      statusCode: 0,
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn()
    };
  });
  
  afterEach(() => {
    // Restore original implementations
    jest.restoreAllMocks();
  });
  
  test('handleHello should return 200 with Hello world message for GET requests', () => {
    // Call the handler with mock request and response
    handleHello(req, res);
    
    // Verify status code
    expect(res.statusCode).toBe(200);
    
    // Verify Content-Type header
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Verify security headers were set
    expect(setSecurityHeaders).toHaveBeenCalledWith(res);
    
    // Verify response body
    expect(res.write).toHaveBeenCalledWith('Hello world');
    
    // Verify response was ended
    expect(res.end).toHaveBeenCalled();
    
    // Verify logging
    expect(info).toHaveBeenCalledWith('200 OK: GET /hello');
  });
  
  test('handleHello should call handleMethodNotAllowed for non-GET requests', () => {
    // Create a POST request
    req.method = 'POST';
    
    // Call the handler
    handleHello(req, res);
    
    // Verify handleMethodNotAllowed was called with correct arguments
    expect(handleMethodNotAllowed).toHaveBeenCalledWith(req, res);
    expect(handleMethodNotAllowed).toHaveBeenCalledTimes(1);
    
    // Verify other functions were not called
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.write).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
  });
  
  test('handleHello should respond in less than 50ms', () => {
    // Record start time
    const startTime = Date.now();
    
    // Call the handler
    handleHello(req, res);
    
    // Calculate response time
    const responseTime = Date.now() - startTime;
    
    // Response time should be less than 50ms
    expect(responseTime).toBeLessThan(50);
  });
  
  test('handleHello should ignore query parameters and return Hello world', () => {
    // Create request with query parameters
    req.url = '/hello?param1=value1&param2=value2';
    
    // Call the handler
    handleHello(req, res);
    
    // Verify status code and response
    expect(res.statusCode).toBe(200);
    expect(res.write).toHaveBeenCalledWith('Hello world');
    
    // Verify the query parameters were ignored (same response)
    expect(res.write).not.toHaveBeenCalledWith(expect.stringContaining('value1'));
    
    // Verify logging with the full URL including query params
    expect(info).toHaveBeenCalledWith('200 OK: GET /hello?param1=value1&param2=value2');
  });
  
  test('handleHello should handle requests with trailing slash', () => {
    // Create request with trailing slash
    req.url = '/hello/';
    
    // Call the handler
    handleHello(req, res);
    
    // Verify status code and response
    expect(res.statusCode).toBe(200);
    expect(res.write).toHaveBeenCalledWith('Hello world');
    
    // Verify logging with the trailing slash
    expect(info).toHaveBeenCalledWith('200 OK: GET /hello/');
  });
});