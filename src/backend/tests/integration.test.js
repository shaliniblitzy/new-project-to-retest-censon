/**
 * Integration Tests for Node.js HTTP Server Application
 * 
 * These tests verify the end-to-end functionality of the server by making
 * actual HTTP requests and validating the responses. They ensure that the
 * server correctly handles the /hello endpoint and properly responds to
 * invalid routes or methods.
 */

const supertest = require('supertest'); // v6.3.3
const { createServer, startServer } = require('../src/server');
const { PORT } = require('../src/config');

describe('Integration Tests', () => {
  let server;
  let request;

  beforeAll(async () => {
    // Create and start the server for testing
    server = createServer();
    await startServer(server);
    
    // Create a supertest instance for making requests to the server
    request = supertest(`http://localhost:${PORT}`);
    
    return Promise.resolve();
  });

  afterAll(async () => {
    // Close the server after all tests have completed
    return new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });

  test('GET /hello should return 200 with Hello world message', async () => {
    const response = await request.get('/hello');
    
    // Verify status code and content
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe('Hello world');
    
    // Verify security headers
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
    expect(response.headers['cache-control']).toBe('no-store');
  });

  test('GET /invalid should return 404 Not Found', async () => {
    const response = await request.get('/invalid');
    
    // Verify status code and content
    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe('Not Found');
    
    // Verify security headers
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
    expect(response.headers['cache-control']).toBe('no-store');
  });

  test('POST /hello should return 405 Method Not Allowed', async () => {
    const response = await request.post('/hello');
    
    // Verify status code and content
    expect(response.status).toBe(405);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe('Method Not Allowed');
    
    // Verify security headers
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
    expect(response.headers['cache-control']).toBe('no-store');
  });

  test('GET /hello should respond in less than 50ms', async () => {
    const startTime = Date.now();
    await request.get('/hello');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(responseTime).toBeLessThan(50);
  });

  test('GET /hello with query parameters should return Hello world', async () => {
    const response = await request.get('/hello?param1=value1&param2=value2');
    
    // Verify that query parameters are ignored
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello world');
  });

  test('GET /hello/ with trailing slash should return Hello world', async () => {
    const response = await request.get('/hello/');
    
    // Verify that trailing slash is handled correctly
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello world');
  });

  test('GET /HELLO with uppercase should return 404 Not Found', async () => {
    const response = await request.get('/HELLO');
    
    // Verify that routing is case-sensitive
    expect(response.status).toBe(404);
    expect(response.text).toBe('Not Found');
  });

  test('Server should handle multiple concurrent requests', async () => {
    // Create an array of 10 concurrent requests
    const requests = Array(10).fill().map(() => request.get('/hello'));
    
    // Execute all requests concurrently
    const responses = await Promise.all(requests);
    
    // Verify all responses
    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello world');
    });
  });

  test('Responses should include security headers', async () => {
    const response = await request.get('/hello');
    
    // Verify that all required security headers are present
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
    expect(response.headers['cache-control']).toBe('no-store');
  });
});