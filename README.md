# GitHub Skills Demo

A repository demonstrating GitHub API capabilities with a comprehensive test suite.

## Overview

This project provides a simple, well-tested GitHub API client that demonstrates best practices for:
- API client architecture
- Comprehensive unit testing
- Integration testing
- Error handling
- Mocking external dependencies

## Features

The `GitHubClient` class provides methods to interact with the GitHub API:

- **Repository Management**
  - `getRepository(owner, repo)` - Fetch repository details
  - `getIssues(owner, repo, params)` - List repository issues with filtering
  
- **User Management**
  - `getUser(username)` - Get user profile information
  - `getUserRepositories(username, params)` - List user repositories
  
- **Search**
  - `searchRepositories(query, params)` - Search for repositories

## Installation

```bash
npm install
```

## Usage

```javascript
const { GitHubClient } = require('./src');

// Create a client (optionally with authentication token)
const client = new GitHubClient('your-github-token');

// Fetch repository information
const repo = await client.getRepository('octocat', 'Hello-World');
console.log(repo.name, repo.description);

// Get repository issues
const issues = await client.getIssues('octocat', 'Hello-World', {
  state: 'open',
  labels: 'bug'
});

// Get user information
const user = await client.getUser('octocat');
console.log(user.name, user.bio);

// Search repositories
const results = await client.searchRepositories('javascript testing', {
  sort: 'stars',
  order: 'desc'
});
```

## Testing

This project includes a comprehensive test suite with 41 tests covering:

### Unit Tests (`__tests__/GitHubClient.test.js`)
- Constructor initialization
- Request handling with authentication
- All API methods (getRepository, getIssues, getUser, etc.)
- Parameter validation
- Error handling (401, 403, 404, 500 errors)
- Header management
- Custom base URL support

### Integration Tests (`__tests__/GitHubClient.integration.test.js`)
- Multi-step workflows (fetch repo → fetch issues)
- User profile and repository workflows
- Search and discovery patterns
- Concurrent API calls
- Filtering and pagination
- Error recovery patterns
- GitHub Enterprise support

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The test suite provides comprehensive coverage of:
- ✅ All public methods
- ✅ Success scenarios
- ✅ Error scenarios
- ✅ Edge cases (missing parameters, empty values)
- ✅ Authentication flows
- ✅ Network error handling
- ✅ Real-world usage patterns

## Project Structure

```
github-skills-demo/
├── src/
│   ├── GitHubClient.js    # Main API client
│   └── index.js           # Module exports
├── __tests__/
│   ├── GitHubClient.test.js              # Unit tests
│   └── GitHubClient.integration.test.js  # Integration tests
├── jest.config.js         # Jest configuration
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Dependencies

- **node-fetch**: HTTP client for making API requests
- **jest**: Testing framework

## API Documentation

### GitHubClient(token, baseUrl)

Constructor for creating a new GitHub API client.

**Parameters:**
- `token` (string, optional): GitHub personal access token for authentication
- `baseUrl` (string, optional): Custom API base URL (default: 'https://api.github.com')

### Methods

#### getRepository(owner, repo)
Fetches information about a specific repository.

**Returns:** Promise<Object> - Repository data

#### getIssues(owner, repo, params)
Lists issues for a repository with optional filtering.

**Parameters:**
- `params` (object, optional): Query parameters (state, labels, sort, etc.)

**Returns:** Promise<Array> - List of issues

#### getUser(username)
Retrieves information about a GitHub user.

**Returns:** Promise<Object> - User data

#### getUserRepositories(username, params)
Lists repositories for a specific user.

**Parameters:**
- `params` (object, optional): Query parameters (type, sort, direction)

**Returns:** Promise<Array> - List of repositories

#### searchRepositories(query, params)
Searches for repositories matching the query.

**Parameters:**
- `query` (string): Search query
- `params` (object, optional): Additional search parameters (sort, order)

**Returns:** Promise<Object> - Search results with total count and items

## Error Handling

The client throws descriptive errors for various scenarios:
- Missing required parameters
- API errors (401, 403, 404, 500, etc.)
- Network failures

All errors include the status code and response details when available.

## License

MIT
