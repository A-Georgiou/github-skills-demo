/**
 * Example: Search and filter repositories
 * 
 * This example demonstrates how to search for repositories,
 * filter them by language, and sort them by different criteria.
 */

const GitHubClient = require('../src/GitHubClient');
const utils = require('../src/utils');

async function searchAndFilterRepos() {
  const client = new GitHubClient();

  try {
    // Search for JavaScript repositories
    console.log('Searching for "machine learning" repositories...\n');
    const searchResults = await client.searchRepositories('machine learning', 20);

    console.log(`Found ${searchResults.total_count} total repositories`);
    console.log(`Showing top ${searchResults.items.length} results\n`);

    // Filter by Python language
    const pythonRepos = utils.filterByLanguage(searchResults.items, 'Python');
    console.log(`Python repositories: ${pythonRepos.length}`);

    // Filter by JavaScript language
    const jsRepos = utils.filterByLanguage(searchResults.items, 'JavaScript');
    console.log(`JavaScript repositories: ${jsRepos.length}\n`);

    // Sort Python repos by stars
    const sortedByStars = utils.sortRepositories(pythonRepos, 'stars');

    console.log('=== Top 5 Python ML Repositories (by stars) ===');
    sortedByStars.slice(0, 5).forEach((repo, index) => {
      console.log(`${index + 1}. ${repo.full_name}`);
      console.log(`   Stars: ${repo.stargazers_count} | Forks: ${repo.forks_count}`);
      console.log(`   ${repo.description?.substring(0, 80) || 'No description'}...\n`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
if (require.main === module) {
  searchAndFilterRepos();
}

module.exports = searchAndFilterRepos;
