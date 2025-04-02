/**
 * Jest Configuration File
 * 
 * This file configures Jest for testing the Node.js HTTP server application.
 * It defines the test environment, coverage thresholds, test patterns, and
 * other testing-related settings to ensure proper test execution and reporting.
 * 
 * @version 1.0.0
 */

module.exports = {
  // Use Node.js as the test environment
  testEnvironment: 'node',
  
  // Enable verbose output for detailed test results
  verbose: true,
  
  // Specify which files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.js',     // Include all JavaScript files in src directory
    '!src/index.js'    // Exclude the main entry point
  ],
  
  // Define coverage thresholds to enforce code quality
  coverageThreshold: {
    global: {
      branches: 80,   // Require 80% branch coverage
      functions: 80,  // Require 80% function coverage
      lines: 80,      // Require 80% line coverage
      statements: 80  // Require 80% statement coverage
    }
  },
  
  // Define patterns to match test files
  testMatch: [
    '**/tests/**/*.test.js'  // Match all test files in tests directory
  ],
  
  // Define patterns to ignore when looking for test files
  testPathIgnorePatterns: [
    '/node_modules/'  // Ignore node_modules directory
  ],
  
  // Clear mock calls and instances between every test
  clearMocks: true,
  
  // Reset mocks between every test
  resetMocks: true,
  
  // Restore mocks between every test
  restoreMocks: true
};