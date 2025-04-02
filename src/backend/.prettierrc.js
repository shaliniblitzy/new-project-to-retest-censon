/**
 * Prettier configuration file for the Node.js HTTP server application
 * 
 * This configuration ensures consistent code style across the project,
 * making code more readable and maintainable. It works alongside ESLint
 * to enforce both code style and quality standards.
 * 
 * @version 1.0.0
 */

module.exports = {
  // Use single quotes instead of double quotes
  singleQuote: true,
  
  // Add semicolons at the end of statements
  semi: true,
  
  // Use 2 spaces for indentation
  tabWidth: 2,
  
  // Line length should be no more than 100 characters
  printWidth: 100,
  
  // No trailing commas in object/array literals
  trailingComma: 'none',
  
  // Add spaces between brackets in object literals
  bracketSpacing: true,
  
  // Omit parentheses around a sole arrow function parameter
  arrowParens: 'avoid',
  
  // Use LF (Line Feed) for line endings
  endOfLine: 'lf'
};