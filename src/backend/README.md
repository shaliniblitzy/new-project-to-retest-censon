# Node.js Hello World HTTP Server

A simple Node.js HTTP server application that exposes a single REST endpoint `/hello` which returns "Hello world" to clients.

## Features

- HTTP server implementation using Node.js built-in modules
- Single `/hello` endpoint returning "Hello world" text response
- Basic error handling for invalid routes and methods
- Configurable server settings (port, host)
- Security headers for all responses
- Structured logging with configurable levels

## Prerequisites

- Node.js 18.x LTS or higher
- npm 9.x or higher

## Installation

```bash
# Clone the repository (if not already done)
git clone <repository-url>

# Navigate to the backend directory
cd src/backend

# Install dependencies
npm install
```

## Configuration

The application can be configured using environment variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| PORT | The port number the server will listen on | 3000 |
| HOST | The host address the server will bind to | 0.0.0.0 |
| NODE_ENV | The runtime environment | development |
| LOG_LEVEL | The logging level (error, warn, info, debug) | info |

## Usage

### Starting the Server

```bash
# Start the server in production mode
npm start

# Start the server in development mode with auto-restart
npm run dev
```

### Making Requests

Once the server is running, you can access the `/hello` endpoint:

```bash
# Using curl
curl http://localhost:3000/hello

# Using wget
wget -qO- http://localhost:3000/hello
```

You can also access the endpoint in a web browser by navigating to:

```
http://localhost:3000/hello
```

The server will respond with the text "Hello world".

## Project Structure

```
src/
├── index.js           # Application entry point
├── server.js          # HTTP server implementation
├── router.js          # Request routing logic
├── config.js          # Configuration settings
├── logger.js          # Logging utilities
└── handlers/          # Request handlers
    ├── index.js       # Handler exports
    ├── helloHandler.js # /hello endpoint handler
    └── errorHandler.js # Error handling functions
tests/
├── handlers/          # Handler unit tests
├── router.test.js     # Router unit tests
├── server.test.js     # Server unit tests
└── integration.test.js # End-to-end tests
```

## API Reference

### GET /hello

Returns a "Hello world" text response.

**Response:**

- **Status Code:** 200 OK
- **Content-Type:** text/plain
- **Body:** Hello world

### Other Routes

All other routes will return a 404 Not Found response.

**Response:**

- **Status Code:** 404 Not Found
- **Content-Type:** text/plain
- **Body:** Not Found

### Invalid Methods

Using HTTP methods other than GET on the `/hello` endpoint will return a 405 Method Not Allowed response.

**Response:**

- **Status Code:** 405 Method Not Allowed
- **Content-Type:** text/plain
- **Body:** Method Not Allowed

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

The test suite includes:
- Unit tests for individual components
- Integration tests for the complete request-response cycle

## Development

### Code Linting

```bash
# Run ESLint
npm run lint
```

### Auto-restart During Development

The development server uses nodemon to automatically restart when files change:

```bash
npm run dev
```

## Performance

The application is designed to be lightweight and efficient:

- Response time: < 50ms for all endpoints
- Memory usage: < 50MB
- Concurrent connections: 100+ (default Node.js HTTP server capacity)

## Security

The application implements basic security measures:

- Input validation for request paths and methods
- Security headers on all responses:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Content-Security-Policy: default-src 'none'
  - Cache-Control: no-store
- Error handling that avoids exposing system details

## License

MIT