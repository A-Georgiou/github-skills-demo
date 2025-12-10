# Test Suite Documentation

This document provides comprehensive information about the test suite for the GitHub Skills Demo project.

## Overview

The test suite validates the functionality of GitHub API operations and utility functions used throughout the application. It uses Jest as the testing framework and Nock for HTTP request mocking.

## Test Structure

### Test Files

1. **src/GitHubClient.test.js** - Tests for GitHub API client wrapper
2. **src/utils.test.js** - Tests for utility functions

### Test Coverage

- **Statement Coverage**: 100%
- **Function Coverage**: 100%
- **Branch Coverage**: 90.36%
- **Total Tests**: 56 passing tests

## Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Suites

### GitHubClient Test Suite

Tests the `GitHubClient` class which wraps GitHub API operations.

#### Constructor Tests
- ✓ Creates instance without authentication token
- ✓ Creates instance with authentication token

#### Repository Operations
- ✓ Fetches repository data successfully
- ✓ Handles repository not found errors
- ✓ Handles API errors gracefully

#### Issue Operations
- ✓ Lists open issues by default
- ✓ Lists closed issues when specified
- ✓ Handles API failures

#### User Operations
- ✓ Fetches user data successfully
- ✓ Handles user not found errors
- ✓ Lists user repositories
- ✓ Returns empty array for users with no repositories
- ✓ Handles API failures when listing repositories

#### Search Operations
- ✓ Searches repositories with default page size
- ✓ Searches repositories with custom page size
- ✓ Handles search failures

#### Commit Operations
- ✓ Fetches repository commits
- ✓ Fetches commits with custom page size
- ✓ Handles errors when commits cannot be fetched

#### Pull Request Operations
- ✓ Lists open pull requests by default
- ✓ Lists closed pull requests when specified
- ✓ Handles API failures

### Utils Test Suite

Tests utility functions for data processing and formatting.

#### formatRepository Tests
- ✓ Formats repository data correctly with all fields
- ✓ Handles missing optional fields with defaults
- ✓ Throws error for null input
- ✓ Throws error for undefined input

#### summarizeIssues Tests
- ✓ Summarizes issues with correct statistics
- ✓ Handles empty issues array
- ✓ Handles issues without labels
- ✓ Throws error for non-array input

#### formatUser Tests
- ✓ Formats user data correctly
- ✓ Handles missing optional fields
- ✓ Uses login as name when name is not provided
- ✓ Throws error for null user

#### calculateEngagement Tests
- ✓ Calculates engagement score correctly
- ✓ Handles missing count fields
- ✓ Handles zero counts
- ✓ Throws error for null repository

#### parseRepoUrl Tests
- ✓ Parses HTTPS GitHub URLs
- ✓ Parses URLs with .git extension
- ✓ Parses HTTP GitHub URLs
- ✓ Throws error for invalid URLs
- ✓ Throws error for null/undefined/empty URLs
- ✓ Throws error for non-string inputs

#### filterByLanguage Tests
- ✓ Filters repositories by programming language
- ✓ Performs case-insensitive filtering
- ✓ Returns empty array for non-matching language
- ✓ Throws error for non-array repositories input
- ✓ Throws error for invalid language parameter

#### sortRepositories Tests
- ✓ Sorts by stars (default behavior)
- ✓ Sorts by forks count
- ✓ Sorts by updated date
- ✓ Does not mutate original array
- ✓ Handles missing count fields
- ✓ Throws error for invalid sort criteria
- ✓ Throws error for non-array repositories input

## Testing Approach

### Mocking Strategy

The test suite uses **Nock** to mock HTTP requests to the GitHub API. This approach:
- Prevents actual API calls during testing
- Ensures tests run quickly and reliably
- Allows testing of error scenarios
- Doesn't require authentication tokens

### Test Patterns

1. **Arrange-Act-Assert**: Each test follows the AAA pattern
2. **Isolation**: Each test is independent and self-contained
3. **Edge Cases**: Tests cover happy paths, error cases, and edge cases
4. **Descriptive Names**: Test names clearly describe what is being tested

### Example Test Structure

```javascript
test('should fetch repository data successfully', async () => {
  // Arrange - Set up mock data and HTTP mock
  const mockRepo = {
    id: 1,
    name: 'test-repo',
    stargazers_count: 100
  };
  
  nock('https://api.github.com')
    .get('/repos/owner/test-repo')
    .reply(200, mockRepo);

  // Act - Call the function being tested
  const result = await client.getRepository('owner', 'test-repo');
  
  // Assert - Verify the results
  expect(result).toEqual(mockRepo);
  expect(result.stargazers_count).toBe(100);
});
```

## Key Testing Concepts

### Error Handling
All functions are tested for proper error handling, ensuring:
- Invalid inputs throw appropriate errors
- API failures are caught and wrapped with meaningful messages
- Edge cases don't cause unexpected crashes

### Data Validation
Tests verify that:
- Input parameters are validated
- Output data is correctly formatted
- Default values are applied when appropriate
- Type checking is enforced

### Async Operations
GitHub API operations are asynchronous. Tests use:
- `async/await` syntax for clarity
- Proper error handling with `expect().rejects.toThrow()`
- Nock to control async behavior

## Dependencies

### Testing Dependencies
- **jest**: Test framework
- **@types/jest**: TypeScript definitions for Jest
- **nock**: HTTP request mocking
- **@babel/core**: JavaScript compiler
- **@babel/preset-env**: Babel preset for environment compatibility
- **babel-jest**: Babel integration for Jest

### Production Dependencies
- **@octokit/rest**: Official GitHub REST API client

## Configuration Files

### jest.config.js
Configures Jest test runner with:
- Node test environment
- Coverage collection settings
- Test file patterns
- Transform ignore patterns for ES modules

### babel.config.js
Configures Babel to transpile ES modules from dependencies for Jest compatibility.

## Best Practices

1. **Always run tests before committing** to ensure no regressions
2. **Maintain high coverage** - aim for 90%+ on all metrics
3. **Test behavior, not implementation** - tests should survive refactoring
4. **Keep tests fast** - use mocks to avoid external dependencies
5. **Write descriptive test names** - they serve as documentation

## Continuous Integration

The test suite is designed to run in CI/CD pipelines:
- No external dependencies required
- Fast execution time (< 2 seconds)
- Clear pass/fail output
- Coverage reports for quality gates

## Future Enhancements

Potential additions to the test suite:
- Integration tests with real GitHub API (optional)
- Performance benchmarks
- Visual regression tests if UI is added
- Contract tests for API interactions
- Mutation testing for test quality assessment
