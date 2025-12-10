/**
 * Example usage of the GitHub API wrapper
 * 
 * This script demonstrates how to use the GitHubAPI class
 * to interact with the GitHub API.
 * 
 * Run with: node examples/usage-example.js
 */

const GitHubAPI = require('../src/github-api');

async function main() {
  const api = new GitHubAPI();

  console.log('=== GitHub API Wrapper Demo ===\n');

  try {
    // Example 1: Get a user
    console.log('1. Fetching user "octocat"...');
    const user = await api.getUser('octocat');
    console.log(`   Name: ${user.name}`);
    console.log(`   Public Repos: ${user.public_repos}`);
    console.log(`   Followers: ${user.followers}\n`);

    // Example 2: List user repositories
    console.log('2. Listing repositories for "octocat" (first 5)...');
    const repos = await api.listUserRepos('octocat', 5);
    repos.forEach((repo, index) => {
      console.log(`   ${index + 1}. ${repo.name} (⭐ ${repo.stargazers_count})`);
    });
    console.log();

    // Example 3: Get a specific repository
    console.log('3. Fetching repository "octocat/Hello-World"...');
    const repo = await api.getRepository('octocat', 'Hello-World');
    console.log(`   Description: ${repo.description}`);
    console.log(`   Language: ${repo.language}`);
    console.log(`   Stars: ${repo.stargazers_count}\n`);

    // Example 4: Search for repositories
    console.log('4. Searching for "javascript" repositories (first 3)...');
    const searchResults = await api.searchRepositories('javascript', 3);
    console.log(`   Total found: ${searchResults.total_count}`);
    searchResults.items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.full_name} (⭐ ${item.stargazers_count})`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the examples
if (require.main === module) {
  main();
}

module.exports = main;
