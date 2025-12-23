# github-skills-demo

A repository demonstrating GitHub API capabilities through a collection of utility functions for working with GitHub repository data.

## Description

This project provides a set of JavaScript utilities for:
- Validating GitHub repository formats
- Parsing repository strings (owner/repo)
- Building GitHub URLs and API endpoints
- Extracting repository information from URLs
- Validating GitHub usernames

These utilities are useful for applications that need to interact with GitHub repositories or validate GitHub-related data.

## Installation

```bash
npm install
```

## Usage

```javascript
const {
  isValidRepoFormat,
  parseRepoString,
  buildRepoUrl,
  buildApiUrl,
  extractRepoFromUrl,
  isValidGitHubUsername
} = require('./src/github-api');

// Validate repository format
isValidRepoFormat('A-Georgiou/github-skills-demo'); // true

// Parse repository string
parseRepoString('A-Georgiou/github-skills-demo'); 
// Returns: { owner: 'A-Georgiou', repo: 'github-skills-demo' }

// Build repository URL
buildRepoUrl('A-Georgiou', 'github-skills-demo'); 
// Returns: 'https://github.com/A-Georgiou/github-skills-demo'

// Build API URL
buildApiUrl('A-Georgiou', 'github-skills-demo'); 
// Returns: 'https://api.github.com/repos/A-Georgiou/github-skills-demo'

// Extract repository info from URL
extractRepoFromUrl('https://github.com/A-Georgiou/github-skills-demo/issues/1');
// Returns: { owner: 'A-Georgiou', repo: 'github-skills-demo' }

// Validate GitHub username
isValidGitHubUsername('A-Georgiou'); // true
```

## Testing

Run the test suite to validate all functionality:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate test coverage report:

```bash
npm run test:coverage
```

## API Reference

### `isValidRepoFormat(repoString)`
Validates if a string is in valid GitHub repository format (owner/repo).

**Parameters:**
- `repoString` (string): The repository string to validate

**Returns:** `boolean` - True if valid, false otherwise

### `parseRepoString(repoString)`
Parses a GitHub repository string into owner and repo components.

**Parameters:**
- `repoString` (string): The repository string (owner/repo)

**Returns:** `Object|null` - Object with owner and repo properties, or null if invalid

### `buildRepoUrl(owner, repo)`
Constructs a GitHub repository URL.

**Parameters:**
- `owner` (string): Repository owner
- `repo` (string): Repository name

**Returns:** `string` - Full GitHub repository URL

**Throws:** Error if owner or repo is missing

### `buildApiUrl(owner, repo)`
Constructs a GitHub API URL for a repository.

**Parameters:**
- `owner` (string): Repository owner
- `repo` (string): Repository name

**Returns:** `string` - GitHub API URL for the repository

**Throws:** Error if owner or repo is missing

### `extractRepoFromUrl(url)`
Extracts repository information from a GitHub URL.

**Parameters:**
- `url` (string): GitHub URL

**Returns:** `Object|null` - Object with owner and repo properties, or null if invalid

### `isValidGitHubUsername(username)`
Validates if a string is a valid GitHub username.

**Parameters:**
- `username` (string): The username to validate

**Returns:** `boolean` - True if valid, false otherwise

## License

MIT
