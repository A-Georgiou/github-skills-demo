# github-skills-demo

A repository demonstrating GitHub API capabilities with comprehensive test coverage.

## Overview

This project provides a simple Node.js wrapper for the GitHub API with full test coverage. It demonstrates best practices for:
- API integration
- Error handling
- Input validation
- Comprehensive testing with Jest

## Features

The GitHub API wrapper provides the following functionality:

- **getUser(username)** - Fetch a GitHub user by username
- **listUserRepos(username, perPage)** - List public repositories for a user
- **getRepository(owner, repo)** - Get repository information
- **searchRepositories(query, perPage)** - Search for repositories

## Installation

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Test Coverage

The project includes comprehensive test coverage:

- **Unit Tests**: Testing individual methods with mocked dependencies
- **Input Validation Tests**: Ensuring proper error handling for invalid inputs
- **Error Handling Tests**: Verifying correct behavior for API errors (404, 500, etc.)
- **Edge Case Tests**: Network errors, malformed responses, concurrent requests
- **Integration Tests**: Testing with custom base URLs and query encoding

### Test Statistics

- 50+ test cases covering all methods
- 80%+ code coverage threshold enforced
- Tests for success scenarios, error scenarios, and edge cases

## Usage Example

```javascript
const GitHubAPI = require('./src/github-api');

const api = new GitHubAPI();

// Fetch a user
api.getUser('octocat')
  .then(user => console.log(user))
  .catch(error => console.error(error));

// List user repositories
api.listUserRepos('octocat', 10)
  .then(repos => console.log(repos))
  .catch(error => console.error(error));
```

## Project Structure

```
github-skills-demo/
├── src/
│   └── github-api.js       # Main API wrapper implementation
├── __tests__/
│   └── github-api.test.js  # Comprehensive test suite
├── jest.config.js          # Jest configuration
├── package.json            # Project dependencies and scripts
└── README.md              # This file
```

## License

MIT
