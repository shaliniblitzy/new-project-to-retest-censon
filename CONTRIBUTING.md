# Contributing to Node.js Hello World HTTP Server

Thank you for your interest in contributing to the Node.js Hello World HTTP Server project! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Project Structure](#project-structure)
- [Documentation Guidelines](#documentation-guidelines)
- [Release Process](#release-process)
- [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. By participating in this project, you agree to abide by its terms.

We are committed to providing a friendly, safe, and welcoming environment for all contributors regardless of gender, sexual orientation, disability, ethnicity, religion, or similar personal characteristics.

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior include:

- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## Getting Started

### Prerequisites

- Node.js 18.x LTS or higher
- Git

### Fork and Clone the Repository

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/node-http-hello-world.git
   cd node-http-hello-world
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/node-http-hello-world.git
   ```
4. Fetch the latest changes from upstream:
   ```bash
   git fetch upstream
   ```

## Development Environment Setup

### Install Dependencies

```bash
cd src/backend
npm install
```

### Run the Development Server

```bash
npm run dev
```

This will start the server with nodemon, which automatically restarts the server when you make changes to the code.

### Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-reload
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Check code style and quality

## Coding Standards

This project uses ESLint and Prettier to enforce consistent code style. The configuration files are located at:

- `.eslintrc.js` - ESLint configuration
- `.prettierrc.js` - Prettier configuration

### Key Style Guidelines

- Use 2 spaces for indentation
- Use single quotes for strings
- Use semicolons at the end of statements
- Maximum line length of 100 characters
- No trailing commas
- Use Unix line endings (LF)

### Best Practices

- Write clear, descriptive variable and function names
- Add comments for complex logic or non-obvious code
- Keep functions small and focused on a single responsibility
- Use const for variables that don't need to be reassigned
- Avoid using console.log in production code (use the logger module instead)
- Follow the principle of least privilege (minimize the scope of variables)

### Checking Your Code

Before submitting a pull request, run the linter to check your code:

```bash
npm run lint
```

## Testing Guidelines

This project uses Jest for testing. All new features and bug fixes should include tests.

### Test Structure

- Unit tests should be placed in the `tests` directory
- Test files should follow the naming convention `*.test.js`
- Tests for handlers should be placed in the `tests/handlers` directory

### Writing Tests

- Each test file should focus on testing a single module or component
- Use descriptive test names that explain what is being tested
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies when appropriate
- Aim for high test coverage (minimum 80%)

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

### Integration Tests

Integration tests are located in `tests/integration.test.js`. These tests verify that the components work together correctly by making actual HTTP requests to the server.

## Pull Request Process

1. **Create a Branch**: Create a branch from the `main` branch for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**: Make your changes, following the coding standards and testing guidelines

3. **Commit Changes**: Commit your changes with a clear and descriptive commit message
   ```bash
   git commit -m "Add feature: your feature description"
   ```

4. **Push Changes**: Push your changes to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**: Create a pull request from your branch to the `main` branch of the original repository

6. **Pull Request Template**: Fill out the pull request template with all required information

7. **Code Review**: Wait for code review and address any feedback

8. **Merge**: Once approved, your pull request will be merged

### Pull Request Requirements

- The pull request must pass all tests
- The code must follow the project's coding standards
- New features must include tests
- Documentation must be updated if necessary
- The pull request should reference any related issues

### Updating Your Pull Request

If you need to update your pull request based on feedback:

```bash
# Make changes
git add .
git commit -m "Address feedback: description of changes"
git push origin feature/your-feature-name
```

## Issue Reporting Guidelines

### Bug Reports

If you find a bug, please create an issue using the bug report template. Include as much information as possible:

- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (Node.js version, OS, etc.)
- Screenshots or logs if applicable

### Feature Requests

If you have an idea for a new feature, please create an issue using the feature request template. Include:

- Clear description of the feature
- Rationale for adding the feature
- Potential implementation approach if you have one in mind

### Security Vulnerabilities

If you discover a security vulnerability, please do NOT open an issue. Email [security@example.com](mailto:security@example.com) instead.

## Project Structure

Understanding the project structure will help you contribute effectively. The main components are:

```
src/backend/
├── src/
│   ├── config.js         # Application configuration
│   ├── handlers/
│   │   ├── errorHandler.js  # Error handling functions
│   │   ├── helloHandler.js  # Hello endpoint handler
│   │   └── index.js         # Handler exports
│   ├── index.js          # Application entry point
│   ├── logger.js         # Logging functionality
│   ├── router.js         # Request routing logic
│   └── server.js         # HTTP server implementation
├── tests/
│   ├── handlers/
│   │   ├── errorHandler.test.js
│   │   └── helloHandler.test.js
│   ├── integration.test.js
│   ├── router.test.js
│   └── server.test.js
```

### Key Components

- **index.js**: Application entry point that initializes and starts the server
- **server.js**: Core HTTP server implementation using Node.js built-in http module
- **router.js**: Request routing logic that directs requests to appropriate handlers
- **handlers/**: Request handler functions for different endpoints and error conditions
- **config.js**: Application configuration management
- **logger.js**: Logging functionality for application events

## Documentation Guidelines

Good documentation is essential for this project. Please follow these guidelines when updating or adding documentation:

### Code Documentation

- Add JSDoc comments for functions, classes, and complex code blocks
- Keep comments up-to-date when changing code
- Use clear and concise language

### README and Other Markdown Files

- Use proper Markdown syntax
- Keep the documentation organized and easy to navigate
- Include examples where appropriate
- Update the documentation when adding or changing features

### API Documentation

When adding or modifying API endpoints, update the API.md file with:

- Endpoint path and method
- Request parameters
- Response format
- Example requests and responses
- Error responses

## Release Process

This project follows Semantic Versioning (SemVer) for releases.

### Version Numbers

Version numbers follow the format MAJOR.MINOR.PATCH:

- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality additions
- PATCH version for backwards-compatible bug fixes

### Release Steps

1. Update the version number in package.json
2. Update CHANGELOG.md with the changes in the new version
3. Create a git tag for the version
4. Push the tag to GitHub
5. Create a GitHub release with release notes

### Changelog

All notable changes to this project are documented in the CHANGELOG.md file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## Community

### Getting Help

If you need help with contributing to the project, you can:

- Open an issue with your question
- Reach out to the maintainers

### Recognition

All contributors will be recognized in the project's README.md file. We appreciate all contributions, no matter how small!

### License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License.