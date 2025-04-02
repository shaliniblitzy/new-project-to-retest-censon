#!/bin/bash
#
# setup-local.sh - Setup script for the Node.js HTTP server local development environment
#
# This script automates the process of setting up a local development environment
# for the Node.js HTTP server application. It can set up either a direct Node.js
# environment or a Docker-based environment based on user preference.
#
# The script:
# - Checks for prerequisites (Node.js, npm, Docker if needed)
# - Installs dependencies
# - Configures environment variables
# - Starts the application in development mode
# - Verifies the setup is working correctly
#

# Enable strict error handling
set -euo pipefail

# Global variables - Paths
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "${SCRIPT_DIR}/../.." && pwd)
BACKEND_DIR="${REPO_ROOT}/src/backend"
DOCKER_COMPOSE_FILE="${REPO_ROOT}/infrastructure/docker-compose.yml"

# Default configuration
USE_DOCKER=${USE_DOCKER:-false}
NODE_VERSION=18
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=debug

# Valid values for validation
VALID_LOG_LEVELS=("error" "warn" "info" "debug")
VALID_NODE_ENVS=("development" "production" "test")

# Function to display usage information
print_usage() {
    echo "Usage: $(basename "$0") [OPTIONS]"
    echo
    echo "Setup a local development environment for the Node.js HTTP server application."
    echo
    echo "Options:"
    echo "  -d                Use Docker for local development (default: false)"
    echo "  -p PORT           Port number for the HTTP server (default: 3000)"
    echo "  -h HOST           Host address for the HTTP server (default: 0.0.0.0)"
    echo "  -e NODE_ENV       Node.js environment (development, production, test) (default: development)"
    echo "  -l LOG_LEVEL      Log level (error, warn, info, debug) (default: debug)"
    echo "  --help            Display this help message and exit"
    echo
    echo "Examples:"
    echo "  $(basename "$0")                        # Setup with Node.js directly"
    echo "  $(basename "$0") -d                     # Setup with Docker"
    echo "  $(basename "$0") -p 8080                # Use port 8080 instead of 3000"
    echo "  $(basename "$0") -d -p 8080 -l info     # Use Docker, port 8080, and info log level"
    echo
}

# Function to validate port number
validate_port() {
    local port=$1
    
    # Check if port is a number
    if ! [[ "$port" =~ ^[0-9]+$ ]]; then
        echo "Error: Port must be a number."
        return 1
    fi
    
    # Check if port is in valid range
    if [ "$port" -lt 1024 ] || [ "$port" -gt 65535 ]; then
        echo "Error: Port must be between 1024 and 65535."
        return 1
    fi
    
    return 0
}

# Function to validate log level
validate_log_level() {
    local level=$1
    
    for valid_level in "${VALID_LOG_LEVELS[@]}"; do
        if [ "$level" = "$valid_level" ]; then
            return 0
        fi
    done
    
    echo "Error: Invalid log level. Must be one of: ${VALID_LOG_LEVELS[*]}"
    return 1
}

# Function to validate NODE_ENV
validate_node_env() {
    local env=$1
    
    for valid_env in "${VALID_NODE_ENVS[@]}"; do
        if [ "$env" = "$valid_env" ]; then
            return 0
        fi
    done
    
    echo "Error: Invalid NODE_ENV. Must be one of: ${VALID_NODE_ENVS[*]}"
    return 1
}

# Function to check prerequisites
check_prerequisites() {
    echo "Checking prerequisites..."
    
    # Check for Node.js if not using Docker
    if [ "$USE_DOCKER" = "false" ]; then
        if ! command -v node &> /dev/null; then
            echo "Error: Node.js is not installed. Please install Node.js $NODE_VERSION or later."
            return 1
        fi
        
        # Check Node.js version
        local node_ver
        node_ver=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
        if [ "$node_ver" -lt "$NODE_VERSION" ]; then
            echo "Error: Node.js version $NODE_VERSION or later is required. Found version $node_ver."
            return 1
        fi
        
        # Check for npm
        if ! command -v npm &> /dev/null; then
            echo "Error: npm is not installed. Please install npm."
            return 1
        fi
    else
        # Check for Docker
        if ! command -v docker &> /dev/null; then
            echo "Error: Docker is not installed. Please install Docker."
            return 1
        fi
        
        # Check for docker-compose
        if ! command -v docker-compose &> /dev/null; then
            echo "Error: docker-compose is not installed. Please install docker-compose."
            return 1
        fi
    fi
    
    echo "All prerequisites are met."
    return 0
}

# Function to set up Node.js environment
setup_node_environment() {
    echo "Setting up Node.js environment..."
    
    # Navigate to backend directory
    cd "$BACKEND_DIR" || {
        echo "Error: Failed to navigate to backend directory: $BACKEND_DIR"
        return 1
    }
    
    # Install npm dependencies
    echo "Installing npm dependencies..."
    npm install || {
        echo "Error: Failed to install npm dependencies."
        return 1
    }
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        echo "Creating .env file with development settings..."
        cat > .env << EOF
PORT=$PORT
HOST=$HOST
NODE_ENV=$NODE_ENV
LOG_LEVEL=$LOG_LEVEL
EOF
    else
        echo ".env file already exists, skipping creation."
    fi
    
    echo "Node.js environment setup completed successfully."
    return 0
}

# Function to set up Docker environment
setup_docker_environment() {
    echo "Setting up Docker environment..."
    
    # Navigate to repository root
    cd "$REPO_ROOT" || {
        echo "Error: Failed to navigate to repository root: $REPO_ROOT"
        return 1
    }
    
    # Create .env file for docker-compose if it doesn't exist
    if [ ! -f "${REPO_ROOT}/infrastructure/.env" ]; then
        echo "Creating .env file for docker-compose with development settings..."
        cat > "${REPO_ROOT}/infrastructure/.env" << EOF
PORT=$PORT
HOST=$HOST
NODE_ENV=$NODE_ENV
LOG_LEVEL=$LOG_LEVEL
EOF
    else
        echo "docker-compose .env file already exists, skipping creation."
    fi
    
    # Build Docker containers
    echo "Building Docker containers..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" build || {
        echo "Error: Failed to build Docker containers."
        return 1
    }
    
    echo "Docker environment setup completed successfully."
    return 0
}

# Function to start local development environment
start_local_environment() {
    echo "Starting local development environment..."
    
    if [ "$USE_DOCKER" = "true" ]; then
        # Navigate to repository root
        cd "$REPO_ROOT" || {
            echo "Error: Failed to navigate to repository root: $REPO_ROOT"
            return 1
        }
        
        # Start Docker containers
        echo "Starting Docker containers..."
        # Start in detached mode to continue script execution
        docker-compose -f "$DOCKER_COMPOSE_FILE" up -d || {
            echo "Error: Failed to start Docker containers."
            return 1
        }
        
        echo "Docker containers started successfully."
    else
        # Navigate to backend directory
        cd "$BACKEND_DIR" || {
            echo "Error: Failed to navigate to backend directory: $BACKEND_DIR"
            return 1
        }
        
        # Start Node.js application in development mode
        echo "Starting Node.js application in development mode..."
        # Since we want to keep the terminal interactive, we'll just inform the user
        # how to start the application, rather than starting it here
        echo "To start the application, run the following command in a new terminal:"
        echo "cd $BACKEND_DIR && npm run dev"
        
        # If you want to actually start the application here, uncomment this:
        # npm run dev &
        # But this will run in the background and might be confusing for users
    fi
    
    return 0
}

# Function to verify setup by checking if application is running correctly
verify_setup() {
    echo "Verifying setup..."
    
    # Give the application some time to start
    echo "Waiting for application to start..."
    sleep 5
    
    # Try to access the /hello endpoint
    echo "Testing /hello endpoint..."
    local response
    
    if [ "$USE_DOCKER" = "true" ]; then
        # For Docker, we need to use the Docker network or exposed port
        # Try up to 3 times with a delay between attempts
        for i in {1..3}; do
            echo "Attempt $i of 3..."
            response=$(curl -s http://localhost:$PORT/hello || echo "Failed to connect")
            
            if [[ "$response" == *"Hello world"* ]]; then
                break
            elif [ $i -lt 3 ]; then
                echo "Waiting for service to be ready..."
                sleep 5
            fi
        done
    else
        # For direct Node.js, the app might not be running automatically
        # Check if the app is running by attempting to connect
        if nc -z localhost $PORT 2>/dev/null; then
            response=$(curl -s http://localhost:$PORT/hello || echo "Failed to connect")
        else
            echo "Application is not running. Start it manually with 'cd $BACKEND_DIR && npm run dev'"
            echo "After starting, verify by accessing: http://localhost:$PORT/hello"
            echo "Expected response: 'Hello world'"
            return 0
        fi
    fi
    
    # Check response
    if [[ "$response" == *"Hello world"* ]]; then
        echo "Verification successful: Application is running correctly!"
        return 0
    else
        echo "Verification failed: Application is not returning the expected response."
        echo "Expected: 'Hello world'"
        echo "Received: $response"
        return 1
    fi
}

# Function to parse command line arguments
parse_args() {
    local OPTIND opt
    
    # Process options
    while getopts ":dp:h:e:l:-:" opt; do
        case $opt in
            d)
                USE_DOCKER=true
                ;;
            p)
                PORT=$OPTARG
                validate_port "$PORT" || return 1
                ;;
            h)
                HOST=$OPTARG
                ;;
            e)
                NODE_ENV=$OPTARG
                validate_node_env "$NODE_ENV" || return 1
                ;;
            l)
                LOG_LEVEL=$OPTARG
                validate_log_level "$LOG_LEVEL" || return 1
                ;;
            -)
                case $OPTARG in
                    help)
                        print_usage
                        exit 0
                        ;;
                    *)
                        echo "Unknown option --$OPTARG"
                        print_usage
                        return 1
                        ;;
                esac
                ;;
            \?)
                echo "Unknown option -$OPTARG"
                print_usage
                return 1
                ;;
            :)
                echo "Option -$OPTARG requires an argument."
                print_usage
                return 1
                ;;
        esac
    done
}

# Main function
main() {
    local status=0
    
    # Parse command line arguments
    parse_args "$@" || {
        return 1
    }
    
    # Check prerequisites
    check_prerequisites || {
        echo "Error: Prerequisites check failed."
        return 2
    }
    
    # Setup environment based on preferences
    if [ "$USE_DOCKER" = "true" ]; then
        setup_docker_environment || {
            echo "Error: Failed to setup Docker environment."
            return 4
        }
    else
        setup_node_environment || {
            echo "Error: Failed to setup Node.js environment."
            return 3
        }
    fi
    
    # Start local environment
    start_local_environment || {
        echo "Error: Failed to start local environment."
        return 5
    }
    
    # Verify setup
    verify_setup || {
        echo "Error: Setup verification failed."
        status=6
    }
    
    # Print success message
    if [ $status -eq 0 ]; then
        echo "========================================================="
        echo "Setup completed successfully!"
        echo "The Node.js Hello World application is now ready to use."
        echo
        if [ "$USE_DOCKER" = "true" ]; then
            echo "The application is running in Docker containers."
            echo "Access it at: http://localhost:$PORT/hello"
            echo
            echo "To stop the containers, run:"
            echo "docker-compose -f \"$DOCKER_COMPOSE_FILE\" down"
        else
            echo "To start the application, run:"
            echo "cd \"$BACKEND_DIR\" && npm run dev"
            echo
            echo "Once started, access it at: http://localhost:$PORT/hello"
        fi
        echo "========================================================="
    fi
    
    return $status
}

# Call main function with all script arguments
main "$@"