#!/bin/bash
#
# deploy.sh - Deployment script for Node.js Hello World HTTP Server
#
# This script automates the deployment of the Node.js Hello World application
# to a Kubernetes cluster. It handles building the Docker image, pushing it to
# a registry, and deploying the application to Kubernetes with appropriate
# configuration for different environments.
#

# Fail on any error
set -e

# Script directory and repository root paths
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "${SCRIPT_DIR}/../.." && pwd)
KUBE_DIR=${REPO_ROOT}/infrastructure/kubernetes

# Default configuration values
DOCKER_REGISTRY=${DOCKER_REGISTRY:-localhost:5000}
IMAGE_NAME=${IMAGE_NAME:-nodejs-hello-world}
IMAGE_TAG=${IMAGE_TAG:-latest}
NAMESPACE=${NAMESPACE:-default}
DEPLOYMENT_NAME=nodejs-hello-world
SERVICE_NAME=nodejs-hello-world
CONFIGMAP_NAME=nodejs-hello-world-config
ENVIRONMENT=${ENVIRONMENT:-development}
SKIP_BUILD=${SKIP_BUILD:-false}
SKIP_PUSH=${SKIP_PUSH:-false}
ROLLBACK_ON_FAILURE=${ROLLBACK_ON_FAILURE:-true}
HEALTH_CHECK_RETRIES=${HEALTH_CHECK_RETRIES:-10}
HEALTH_CHECK_DELAY=${HEALTH_CHECK_DELAY:-5}

# Display script usage information
print_usage() {
    echo "Usage: $(basename "$0") [options]"
    echo
    echo "Deploy the Node.js Hello World application to a Kubernetes cluster"
    echo
    echo "Options:"
    echo "  -e <env>     Environment (development, staging, production) [default: development]"
    echo "  -r <url>     Docker registry URL [default: ${DOCKER_REGISTRY}]"
    echo "  -i <name>    Image name [default: ${IMAGE_NAME}]"
    echo "  -t <tag>     Image tag [default: ${IMAGE_TAG}]"
    echo "  -n <ns>      Kubernetes namespace [default: ${NAMESPACE}]"
    echo "  -b           Skip build step"
    echo "  -p           Skip push step"
    echo "  -f           Disable rollback on failure"
    echo "  -h           Display this help message"
    echo
    echo "Examples:"
    echo "  $(basename "$0")                            # Deploy to development with default settings"
    echo "  $(basename "$0") -e production -n prod      # Deploy to production namespace"
    echo "  $(basename "$0") -r docker.io/myuser -p     # Use external registry, skip push step"
}

# Check if required tools are installed and configured
check_prerequisites() {
    echo "Checking prerequisites..."
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        echo "Error: docker is not installed or not in PATH"
        return 1
    fi
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        echo "Error: kubectl is not installed or not in PATH"
        return 1
    fi
    
    # Check if kubectl can connect to the cluster
    if ! kubectl cluster-info &> /dev/null; then
        echo "Error: kubectl cannot connect to the Kubernetes cluster"
        echo "Please ensure you have access to a Kubernetes cluster and kubectl is properly configured"
        return 1
    fi
    
    # Check if namespace exists, create it if it doesn't
    if ! kubectl get namespace "${NAMESPACE}" &> /dev/null; then
        echo "Namespace ${NAMESPACE} does not exist, creating it..."
        kubectl create namespace "${NAMESPACE}"
    fi
    
    echo "Prerequisites check passed"
    return 0
}

# Build the Docker image
build_image() {
    if [ "${SKIP_BUILD}" = "true" ]; then
        echo "Skipping build step as requested"
        return 0
    fi
    
    echo "Building Docker image ${IMAGE_NAME}:${IMAGE_TAG}..."
    
    # Change to the repository root directory
    cd "${REPO_ROOT}"
    
    # Build the Docker image
    docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" -f infrastructure/Dockerfile .
    
    # Tag the image with registry information
    docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
    
    echo "Docker image built successfully"
    return 0
}

# Push the Docker image to the registry
push_image() {
    if [ "${SKIP_PUSH}" = "true" ]; then
        echo "Skipping push step as requested"
        return 0
    fi
    
    echo "Pushing Docker image ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} to registry..."
    
    # Push the Docker image to the registry
    docker push "${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
    
    echo "Docker image pushed successfully"
    return 0
}

# Apply the ConfigMap to the Kubernetes cluster
apply_configmap() {
    echo "Applying ConfigMap for environment: ${ENVIRONMENT}..."
    
    local temp_configmap
    temp_configmap=$(mktemp)
    
    # Copy the base ConfigMap YAML
    cp "${KUBE_DIR}/configmap.yaml" "${temp_configmap}"
    
    # Update ConfigMap data based on environment
    case "${ENVIRONMENT}" in
        development)
            sed -i 's/NODE_ENV: "production"/NODE_ENV: "development"/g' "${temp_configmap}"
            sed -i 's/LOG_LEVEL: "info"/LOG_LEVEL: "debug"/g' "${temp_configmap}"
            ;;
        staging)
            # Use production settings with info logging
            sed -i 's/NODE_ENV: "production"/NODE_ENV: "production"/g' "${temp_configmap}"
            sed -i 's/LOG_LEVEL: "info"/LOG_LEVEL: "info"/g' "${temp_configmap}"
            ;;
        production)
            # Use production settings with warn logging
            sed -i 's/NODE_ENV: "production"/NODE_ENV: "production"/g' "${temp_configmap}"
            sed -i 's/LOG_LEVEL: "info"/LOG_LEVEL: "warn"/g' "${temp_configmap}"
            ;;
        *)
            echo "Warning: Unknown environment ${ENVIRONMENT}, using default settings"
            ;;
    esac
    
    # Apply the ConfigMap to the cluster
    kubectl apply -f "${temp_configmap}" -n "${NAMESPACE}"
    
    # Clean up temporary file
    rm "${temp_configmap}"
    
    echo "ConfigMap applied successfully"
    return 0
}

# Apply the Deployment to the Kubernetes cluster
apply_deployment() {
    echo "Applying Deployment..."
    
    local temp_deployment
    temp_deployment=$(mktemp)
    
    # Copy the base Deployment YAML
    cp "${KUBE_DIR}/deployment.yaml" "${temp_deployment}"
    
    # Update the image in the deployment file
    sed -i "s|image: nodejs-hello-world:latest|image: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}|g" "${temp_deployment}"
    
    # Apply the Deployment to the cluster
    kubectl apply -f "${temp_deployment}" -n "${NAMESPACE}"
    
    # Clean up temporary file
    rm "${temp_deployment}"
    
    echo "Deployment applied successfully"
    return 0
}

# Apply the Service to the Kubernetes cluster
apply_service() {
    echo "Applying Service..."
    
    # Apply the Service to the cluster
    kubectl apply -f "${KUBE_DIR}/service.yaml" -n "${NAMESPACE}"
    
    echo "Service applied successfully"
    return 0
}

# Wait for the deployment to be ready
wait_for_deployment() {
    echo "Waiting for deployment to be ready..."
    
    # Wait for the deployment to roll out
    if ! kubectl rollout status deployment/${DEPLOYMENT_NAME} -n "${NAMESPACE}" --timeout=300s; then
        echo "Error: Deployment failed to become ready within timeout"
        return 1
    fi
    
    echo "Deployment is ready"
    return 0
}

# Verify the health of the deployed application
verify_health() {
    echo "Verifying application health..."
    
    # Set up port-forwarding to the service
    local port=8080
    kubectl port-forward svc/${SERVICE_NAME} ${port}:80 -n "${NAMESPACE}" &
    local port_forward_pid=$!
    
    # Wait for port-forwarding to be established
    sleep 3
    
    # Initialize health check status
    local health_status=1
    local retry_count=0
    
    # Retry health check a few times
    while [ ${retry_count} -lt ${HEALTH_CHECK_RETRIES} ]; do
        echo "Health check attempt $((retry_count + 1))/${HEALTH_CHECK_RETRIES}..."
        
        # Try to access the /hello endpoint
        if response=$(curl -s http://localhost:${port}/hello); then
            if [[ "${response}" == "Hello world" ]]; then
                echo "Health check passed: received 'Hello world' response"
                health_status=0
                break
            else
                echo "Health check failed: unexpected response: ${response}"
            fi
        else
            echo "Health check failed: could not connect to endpoint"
        fi
        
        # Increment retry counter and sleep before next attempt
        retry_count=$((retry_count + 1))
        sleep ${HEALTH_CHECK_DELAY}
    done
    
    # Clean up port-forwarding
    kill ${port_forward_pid} 2>/dev/null || true
    wait ${port_forward_pid} 2>/dev/null || true
    
    if [ ${health_status} -eq 0 ]; then
        echo "Application is healthy"
        return 0
    else
        echo "Error: Application health check failed after ${HEALTH_CHECK_RETRIES} attempts"
        return 1
    fi
}

# Roll back the deployment to the previous version
rollback_deployment() {
    echo "Rolling back deployment..."
    
    # Roll back the deployment
    kubectl rollout undo deployment/${DEPLOYMENT_NAME} -n "${NAMESPACE}"
    
    # Wait for rollback to complete
    kubectl rollout status deployment/${DEPLOYMENT_NAME} -n "${NAMESPACE}" --timeout=300s
    
    echo "Deployment rolled back successfully"
    return 0
}

# Parse command line arguments
parse_args() {
    local OPTIND
    
    while getopts ":e:r:i:t:n:bpfh" opt; do
        case ${opt} in
            e)
                ENVIRONMENT="${OPTARG}"
                # Validate environment
                if [[ ! "${ENVIRONMENT}" =~ ^(development|staging|production)$ ]]; then
                    echo "Error: Invalid environment '${ENVIRONMENT}'. Must be one of: development, staging, production"
                    print_usage
                    exit 1
                fi
                ;;
            r)
                DOCKER_REGISTRY="${OPTARG}"
                ;;
            i)
                IMAGE_NAME="${OPTARG}"
                ;;
            t)
                IMAGE_TAG="${OPTARG}"
                ;;
            n)
                NAMESPACE="${OPTARG}"
                ;;
            b)
                SKIP_BUILD="true"
                ;;
            p)
                SKIP_PUSH="true"
                ;;
            f)
                ROLLBACK_ON_FAILURE="false"
                ;;
            h)
                print_usage
                exit 0
                ;;
            \?)
                echo "Error: Invalid option: -${OPTARG}"
                print_usage
                exit 1
                ;;
            :)
                echo "Error: Option -${OPTARG} requires an argument"
                print_usage
                exit 1
                ;;
        esac
    done
    
    # Log the configured settings
    echo "Deployment configuration:"
    echo "- Environment: ${ENVIRONMENT}"
    echo "- Docker Registry: ${DOCKER_REGISTRY}"
    echo "- Image Name: ${IMAGE_NAME}"
    echo "- Image Tag: ${IMAGE_TAG}"
    echo "- Namespace: ${NAMESPACE}"
    echo "- Skip Build: ${SKIP_BUILD}"
    echo "- Skip Push: ${SKIP_PUSH}"
    echo "- Rollback on Failure: ${ROLLBACK_ON_FAILURE}"
}

# Main function
main() {
    # Parse command line arguments
    parse_args "$@"
    
    # Check prerequisites
    if ! check_prerequisites; then
        echo "Error: Prerequisites check failed"
        exit 2
    fi
    
    # Build Docker image
    if ! build_image; then
        echo "Error: Failed to build Docker image"
        exit 3
    fi
    
    # Push Docker image to registry
    if ! push_image; then
        echo "Error: Failed to push Docker image to registry"
        exit 4
    fi
    
    # Apply Kubernetes resources
    if ! apply_configmap || ! apply_deployment || ! apply_service; then
        echo "Error: Failed to apply Kubernetes resources"
        exit 5
    fi
    
    # Wait for deployment to be ready
    if ! wait_for_deployment; then
        echo "Error: Deployment failed to become ready"
        
        if [ "${ROLLBACK_ON_FAILURE}" = "true" ]; then
            echo "Rolling back deployment due to readiness failure"
            rollback_deployment
        fi
        
        exit 6
    fi
    
    # Verify application health
    if ! verify_health; then
        echo "Error: Application health check failed"
        
        if [ "${ROLLBACK_ON_FAILURE}" = "true" ]; then
            echo "Rolling back deployment due to health check failure"
            rollback_deployment
        fi
        
        exit 7
    fi
    
    # Get service URL for accessing the application
    local service_url
    if kubectl get ingress -n "${NAMESPACE}" | grep -q "${SERVICE_NAME}" 2>/dev/null; then
        service_url=$(kubectl get ingress "${SERVICE_NAME}" -n "${NAMESPACE}" -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
        echo "Deployment successful! The application is available at http://${service_url}/hello"
    else
        echo "Deployment successful! The application is available inside the cluster at ${SERVICE_NAME}.${NAMESPACE}.svc.cluster.local"
        echo "To access from your local machine, use: kubectl port-forward svc/${SERVICE_NAME} 8080:80 -n ${NAMESPACE}"
        echo "Then navigate to http://localhost:8080/hello"
    fi
    
    return 0
}

# Execute main function with all script arguments
main "$@"