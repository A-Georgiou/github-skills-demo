/**
 * Example: Fetch and display repository information
 * 
 * This example demonstrates how to use the GitHubClient to fetch
 * repository information and format it using utility functions.
 */

const GitHubClient = require('../src/GitHubClient');
const utils = require('../src/utils');

async function displayRepositoryInfo() {
  // Create a client (no token needed for public repos)
  const client = new GitHubClient();

  try {
    // Fetch a well-known repository
    console.log('Fetching repository information...\n');
    const repo = await client.getRepository('facebook', 'react');

    // Format the repository data
    const formatted = utils.formatRepository(repo);

    // Display formatted information
    console.log('=== Repository Information ===');
    console.log(`Name: ${formatted.name}`);
    console.log(`Full Name: ${formatted.fullName}`);
    console.log(`Description: ${formatted.description}`);
    console.log(`Language: ${formatted.language}`);
    console.log(`Stars: ${formatted.stars}`);
    console.log(`Forks: ${formatted.forks}`);
    console.log(`URL: ${formatted.url}\n`);

    // Calculate engagement score
    const engagement = utils.calculateEngagement(repo);
    console.log(`Engagement Score: ${engagement}`);
    console.log('(Formula: stars + (forks * 2) + watchers)\n');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
if (require.main === module) {
  displayRepositoryInfo();
}

module.exports = displayRepositoryInfo;
