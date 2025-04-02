# Node.js Hello World HTTP Server

A simple Node.js HTTP server application that exposes a single REST endpoint `/hello` which returns "Hello world" to clients.

![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Performance](#performance)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project is a minimal, functional example of a Node.js web service that serves as a learning tool and starter template for developers. It demonstrates fundamental Node.js web service concepts with minimal complexity, enabling rapid learning and implementation.

## Features

- HTTP server implementation using Node.js built-in modules
- Single `/hello` endpoint returning "Hello world" text response
- Basic error handling for invalid routes and methods
- Configurable server settings (port, host)
- Security headers for all responses
- Structured logging with configurable levels
- No external dependencies beyond Node.js runtime

## Prerequisites

- Node.js 18.x LTS or higher
- npm 9.x or higher

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/node-http-hello-world.git
cd node-http-hello-world

# Install dependencies
cd src/backend
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
# Navigate to the backend directory
cd src/backend

# Start the server in production mode
npm start

# Start the server in development mode with auto-restart
npm run dev
```

Once started, the server will display a message indicating it's running and which port it's listening on.

### Making Requests

You can access the `/hello` endpoint using various methods:

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

## API Documentation

Detailed API documentation is available in the [API.md](API.md) file.

### Endpoints

#### GET /hello

Returns a "Hello world" text response.

**Response:**

- **Status Code:** 200 OK
- **Content-Type:** text/plain
- **Body:** Hello world

### Error Responses

- **404 Not Found** - Returned for requests to undefined routes
- **405 Method Not Allowed** - Returned for non-GET requests to `/hello`
- **500 Internal Server Error** - Returned for unexpected server errors

## Project Structure

```
.
├── .github/                # GitHub configuration files
├── infrastructure/         # Deployment and infrastructure files
├── src/
│   └── backend/           # Backend application code
│       ├── src/
│       │   ├── handlers/  # Request handlers
│       │   ├── config.js  # Configuration settings
│       │   ├── index.js   # Application entry point
│       │   ├── logger.js  # Logging utilities
│       │   ├── router.js  # Request routing logic
│       │   └── server.js  # HTTP server implementation
│       └── tests/         # Test files
├── API.md                 # API documentation
├── CHANGELOG.md           # Version history
├── CONTRIBUTING.md        # Contribution guidelines
├── LICENSE                # MIT license
└── README.md              # This file
```

For more details on the backend structure, see the [backend README](src/backend/README.md).

## Development

### Development Environment

To set up the development environment:

1. Ensure you have Node.js 18.x LTS or higher installed
2. Clone the repository and navigate to the project directory
3. Install dependencies using `npm install`
4. Configure environment variables as needed (see [Configuration](#configuration))
5. Run `npm run dev` for development mode with auto-restart

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

The project is configured to require at least 80% code coverage for branches, functions, lines, and statements.

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

## Contributing

Contributions are welcome! For complete contribution guidelines, see the CONTRIBUTING.md file in the repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.