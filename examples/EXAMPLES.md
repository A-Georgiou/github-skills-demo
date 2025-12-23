# Examples

This directory contains practical examples demonstrating how to use the GitHub Skills Demo library.

## Available Examples

### 1. Repository Information (`repository-info.js`)

Demonstrates how to fetch and display repository information.

```bash
npm run example:repo
```

**What it does:**
- Fetches repository data using `GitHubClient`
- Formats the data using utility functions
- Calculates repository engagement score
- Displays formatted information

**Code snippet:**
```javascript
const client = new GitHubClient();
const repo = await client.getRepository('facebook', 'react');
const formatted = utils.formatRepository(repo);
const engagement = utils.calculateEngagement(repo);
```

### 2. Search Repositories (`search-repos.js`)

Shows how to search for repositories, filter by language, and sort results.

```bash
npm run example:search
```

**What it does:**
- Searches repositories by query
- Filters results by programming language
- Sorts repositories by stars, forks, or updated date
- Displays top results

**Code snippet:**
```javascript
const searchResults = await client.searchRepositories('machine learning', 20);
const pythonRepos = utils.filterByLanguage(searchResults.items, 'Python');
const sorted = utils.sortRepositories(pythonRepos, 'stars');
```

### 3. User Profile (`user-profile.js`)

Demonstrates fetching user information and their repositories.

```bash
npm run example:user
```

**What it does:**
- Fetches user profile information
- Formats user data for display
- Lists user's repositories
- Sorts repositories by popularity

**Code snippet:**
```javascript
const user = await client.getUser('torvalds');
const formatted = utils.formatUser(user);
const repos = await client.listUserRepos('torvalds');
const topRepos = utils.sortRepositories(repos, 'stars');
```

### 4. Issue Analysis (`issue-analysis.js`)

Shows how to fetch and analyze repository issues.

```bash
npm run example:issues
```

**What it does:**
- Fetches repository issues
- Summarizes issue statistics
- Lists labels used in issues
- Displays recent issues

**Code snippet:**
```javascript
const issues = await client.listIssues('microsoft', 'vscode', 'open');
const summary = utils.summarizeIssues(issues);
console.log(`Open: ${summary.open}, Closed: ${summary.closed}`);
```

## Running Examples

### Prerequisites

Make sure you have installed all dependencies:
```bash
npm install
```

### Running Individual Examples

You can run any example using npm scripts:

```bash
npm run example:repo      # Repository information
npm run example:search    # Search repositories
npm run example:user      # User profile
npm run example:issues    # Issue analysis
```

Or run directly with Node:

```bash
node examples/repository-info.js
node examples/search-repos.js
node examples/user-profile.js
node examples/issue-analysis.js
```

## Using with Authentication

For higher rate limits and access to private repositories, you can pass a GitHub token:

```javascript
const GitHubClient = require('./src/GitHubClient');

// With authentication
const client = new GitHubClient(process.env.GITHUB_TOKEN);

// Now you can access private repos and have higher rate limits
```

To use a token:

1. Create a personal access token on GitHub: https://github.com/settings/tokens
2. Set it as an environment variable:
   ```bash
   export GITHUB_TOKEN=your_token_here
   ```
3. Run the examples as normal

## API Rate Limits

GitHub API has rate limits:
- **Without authentication**: 60 requests per hour
- **With authentication**: 5,000 requests per hour

Examples use unauthenticated requests by default. For extensive testing, use authentication.

## Modifying Examples

All examples are self-contained and can be easily modified:

1. Open any example file in the `examples/` directory
2. Modify the parameters (username, repository, search query, etc.)
3. Run the example again

### Example Modification

Change the repository being queried:

```javascript
// Original
const repo = await client.getRepository('facebook', 'react');

// Modified to check a different repository
const repo = await client.getRepository('microsoft', 'typescript');
```

## Creating Your Own Examples

To create a new example:

1. Create a new file in the `examples/` directory
2. Import the required modules:
   ```javascript
   const GitHubClient = require('../src/GitHubClient');
   const utils = require('../src/utils');
   ```
3. Write your example code
4. Add error handling
5. Optionally add an npm script in `package.json`

### Template

```javascript
const GitHubClient = require('../src/GitHubClient');
const utils = require('../src/utils');

async function myExample() {
  const client = new GitHubClient();

  try {
    // Your code here
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (require.main === module) {
  myExample();
}

module.exports = myExample;
```

## Common Use Cases

### Get Repository Statistics

```javascript
const repo = await client.getRepository('owner', 'repo-name');
console.log(`Stars: ${repo.stargazers_count}`);
console.log(`Forks: ${repo.forks_count}`);
console.log(`Issues: ${repo.open_issues_count}`);
```

### Find Popular Repositories

```javascript
const results = await client.searchRepositories('topic:javascript stars:>1000');
const sorted = utils.sortRepositories(results.items, 'stars');
```

### Parse and Fetch from URL

```javascript
const url = 'https://github.com/owner/repo';
const { owner, repo } = utils.parseRepoUrl(url);
const repoData = await client.getRepository(owner, repo);
```

### Compare Repository Engagement

```javascript
const repo1 = await client.getRepository('owner1', 'repo1');
const repo2 = await client.getRepository('owner2', 'repo2');

const score1 = utils.calculateEngagement(repo1);
const score2 = utils.calculateEngagement(repo2);

console.log(`Repo 1 engagement: ${score1}`);
console.log(`Repo 2 engagement: ${score2}`);
```

## Troubleshooting

### Rate Limit Exceeded

If you see "API rate limit exceeded":
- Wait an hour, or
- Use authentication with a GitHub token

### Network Errors

If you see "ECONNREFUSED" or similar:
- Check your internet connection
- Verify GitHub API is accessible
- Check if you're behind a proxy

### Not Found Errors

If you see "404 Not Found":
- Verify the repository/user exists
- Check spelling of owner and repo names
- Ensure you have access (for private repos)

## Further Reading

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Octokit.js Documentation](https://octokit.github.io/rest.js/)
- [Main README](../README.md)
- [Test Documentation](../TEST_DOCUMENTATION.md)
