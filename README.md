# github-skills-demo
A repository demonstrating GitHub API capabilities

## Overview

This project demonstrates how to interact with the GitHub API using Node.js. It includes a comprehensive wrapper for common GitHub operations and utility functions for processing GitHub data.

## Features

- **GitHub API Client**: Wrapper class for GitHub REST API operations
  - Repository information retrieval
  - Issue management
  - User profile fetching
  - Repository search
  - Commit history
  - Pull request management

- **Utility Functions**: Helper functions for data processing
  - Repository data formatting
  - Issue summarization
  - User profile formatting
  - Engagement score calculation
  - Repository URL parsing
  - Language filtering
  - Repository sorting

## Installation

```bash
npm install
```

## Usage

### Basic Example

```javascript
const GitHubClient = require('./src/GitHubClient');

// Create a client instance
const client = new GitHubClient('your-github-token');

// Get repository information
const repo = await client.getRepository('owner', 'repo-name');
console.log(`${repo.name}: ${repo.stargazers_count} stars`);

// List issues
const issues = await client.listIssues('owner', 'repo-name', 'open');
console.log(`Open issues: ${issues.length}`);

// Search repositories
const results = await client.searchRepositories('javascript', 10);
console.log(`Found ${results.total_count} repositories`);
```

### Using Utility Functions

```javascript
const utils = require('./src/utils');

// Format repository data
const formatted = utils.formatRepository(repoData);

// Calculate engagement score
const score = utils.calculateEngagement(repoData);

// Parse GitHub URL
const { owner, repo } = utils.parseRepoUrl('https://github.com/owner/repo');

// Filter repositories by language
const jsRepos = utils.filterByLanguage(repos, 'JavaScript');

// Sort repositories
const topRepos = utils.sortRepositories(repos, 'stars');
```

## Testing

This project includes a comprehensive test suite with 100% statement and function coverage.

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

- **56 passing tests**
- **100% statement coverage**
- **100% function coverage**
- **90%+ branch coverage**

For detailed test documentation, see [TEST_DOCUMENTATION.md](./TEST_DOCUMENTATION.md).

## Project Structure

```
github-skills-demo/
├── src/
│   ├── GitHubClient.js       # GitHub API client wrapper
│   ├── GitHubClient.test.js  # Tests for GitHubClient
│   ├── utils.js              # Utility functions
│   └── utils.test.js         # Tests for utilities
├── coverage/                 # Test coverage reports (generated)
├── babel.config.js          # Babel configuration
├── jest.config.js           # Jest test configuration
├── package.json             # Project dependencies and scripts
├── README.md                # This file
└── TEST_DOCUMENTATION.md    # Detailed test documentation
```

## Dependencies

### Production
- `@octokit/rest` - GitHub REST API client

### Development
- `jest` - Testing framework
- `nock` - HTTP request mocking
- `@babel/core` - JavaScript compiler
- `@babel/preset-env` - Babel environment preset
- `babel-jest` - Babel integration for Jest

## API Reference

### GitHubClient

#### Constructor
- `new GitHubClient(token?)` - Create a new client instance with optional authentication token

#### Methods
- `getRepository(owner, repo)` - Get repository information
- `listIssues(owner, repo, state?)` - List repository issues
- `getUser(username)` - Get user profile information
- `listUserRepos(username)` - List user's repositories
- `searchRepositories(query, perPage?)` - Search for repositories
- `getCommits(owner, repo, perPage?)` - Get repository commits
- `getPullRequests(owner, repo, state?)` - Get pull requests

### Utility Functions

- `formatRepository(repo)` - Format repository data for display
- `summarizeIssues(issues)` - Generate issue statistics
- `formatUser(user)` - Format user profile data
- `calculateEngagement(repo)` - Calculate repository engagement score
- `parseRepoUrl(url)` - Parse GitHub repository URL
- `filterByLanguage(repos, language)` - Filter repositories by programming language
- `sortRepositories(repos, criteria)` - Sort repositories by stars, forks, or updated date

## Contributing

Contributions are welcome! Please ensure:
1. All tests pass (`npm test`)
2. Code coverage remains at 90%+
3. New features include appropriate tests
4. Code follows existing patterns and style

## License

ISC

[content excluded]
