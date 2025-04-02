# Node.js Hello World API Documentation

## Introduction

This document provides the API specification for the Node.js Hello World HTTP server application. The server exposes a single REST endpoint that returns a simple text response. This API documentation covers the endpoint details, request and response formats, error handling, and security considerations.

## Base URL

The base URL for all API endpoints is determined by the server configuration:

```
http://{HOST}:{PORT}/
```

Where:
- `HOST` defaults to '0.0.0.0' (all interfaces)
- `PORT` defaults to 3000

These values can be configured using environment variables.

## Endpoints

### GET /hello

Returns a simple 'Hello world' text response.

**Request:**
- Method: GET
- Path: /hello
- Headers: None required
- Body: None required

**Response:**
- Status: 200 OK
- Headers:
  - Content-Type: text/plain
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Content-Security-Policy: default-src 'none'
  - Cache-Control: no-store
- Body: Hello world

**Example:**

Request:
```
GET /hello HTTP/1.1
Host: localhost:3000
```

Response:
```
HTTP/1.1 200 OK
Content-Type: text/plain
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'none'
Cache-Control: no-store

Hello world
```

## Error Responses

### 404 Not Found

Returned when a request is made to an undefined route.

**Response:**
- Status: 404 Not Found
- Headers:
  - Content-Type: text/plain
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Content-Security-Policy: default-src 'none'
  - Cache-Control: no-store
- Body: Not Found

**Example:**

Request:
```
GET /invalid HTTP/1.1
Host: localhost:3000
```

Response:
```
HTTP/1.1 404 Not Found
Content-Type: text/plain
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'none'
Cache-Control: no-store

Not Found
```

### 405 Method Not Allowed

Returned when a request uses an HTTP method that is not supported for the endpoint.

**Response:**
- Status: 405 Method Not Allowed
- Headers:
  - Content-Type: text/plain
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Content-Security-Policy: default-src 'none'
  - Cache-Control: no-store
- Body: Method Not Allowed

**Example:**

Request:
```
POST /hello HTTP/1.1
Host: localhost:3000
```

Response:
```
HTTP/1.1 405 Method Not Allowed
Content-Type: text/plain
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'none'
Cache-Control: no-store

Method Not Allowed
```

### 500 Internal Server Error

Returned when an unexpected server error occurs.

**Response:**
- Status: 500 Internal Server Error
- Headers:
  - Content-Type: text/plain
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Content-Security-Policy: default-src 'none'
  - Cache-Control: no-store
- Body: Internal Server Error

**Example:**

Request:
```
GET /hello HTTP/1.1
Host: localhost:3000
```

Response:
```
HTTP/1.1 500 Internal Server Error
Content-Type: text/plain
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'none'
Cache-Control: no-store

Internal Server Error
```

## Security Headers

All responses from the API include the following security headers:

| Header | Value | Description |
|--------|-------|-------------|
| X-Content-Type-Options | nosniff | Prevents MIME type sniffing |
| X-Frame-Options | DENY | Prevents clickjacking attacks by disallowing the page from being displayed in a frame |
| Content-Security-Policy | default-src 'none' | Restricts resource loading to prevent various attacks |
| Cache-Control | no-store | Prevents response caching |

## Rate Limiting

This API does not implement rate limiting in its current version.

## Authentication

This API does not require authentication in its current version.

## Testing the API

You can test the API using various HTTP clients:

**curl:**
```
curl http://localhost:3000/hello
```

**wget:**
```
wget -qO- http://localhost:3000/hello
```

**Browser:**
Navigate to http://localhost:3000/hello in your web browser

## API Versioning

This API does not implement versioning in its current version. Future versions may implement URL path versioning (e.g., `/v1/hello`).