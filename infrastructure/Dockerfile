# Stage 1: Build
# Use Alpine-based Node.js image for smaller footprint
FROM node:18-alpine AS build

# Create and set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
# This way, if dependencies don't change, the layer can be reused
COPY src/backend/package*.json ./

# Install only production dependencies to minimize image size
# Note: This application has no production dependencies by design
RUN npm ci --only=production

# Copy application source code
COPY src/backend/src ./src

# Set NODE_ENV to production for optimized runtime
ENV NODE_ENV=production

# Stage 2: Production
# Use Alpine-based Node.js image for production with minimal footprint
FROM node:18-alpine AS production

# Create non-root user for security best practices
RUN addgroup -g 1001 nodeuser && \
    adduser -u 1001 -G nodeuser -s /bin/sh -D nodeuser

# Create and set working directory
WORKDIR /app

# Copy built application from build stage
COPY --from=build /app ./

# Set ownership of application files to non-root user
RUN chown -R nodeuser:nodeuser /app

# Expose port 3000 for the HTTP server
EXPOSE 3000

# Switch to non-root user for runtime security
USER nodeuser

# Set default environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Define health check for container orchestration
# Checks if the /hello endpoint is responding correctly
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -qO- http://localhost:3000/hello || exit 1

# Set the entry point to start the Node.js application
ENTRYPOINT ["node", "src/index.js"]