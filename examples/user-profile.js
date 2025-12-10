/**
 * Example: User profile and repositories
 * 
 * This example shows how to fetch user information
 * and list their repositories.
 */

const GitHubClient = require('../src/GitHubClient');
const utils = require('../src/utils');

async function displayUserProfile() {
  const client = new GitHubClient();

  try {
    const username = 'torvalds'; // Linux creator

    // Fetch user profile
    console.log(`Fetching profile for @${username}...\n`);
    const user = await client.getUser(username);

    // Format user data
    const formatted = utils.formatUser(user);

    console.log('=== User Profile ===');
    console.log(`Username: @${formatted.username}`);
    console.log(`Name: ${formatted.name}`);
    console.log(`Bio: ${formatted.bio}`);
    console.log(`Public Repositories: ${formatted.publicRepos}`);
    console.log(`Followers: ${formatted.followers}`);
    console.log(`Following: ${formatted.following}`);
    console.log(`Profile: ${formatted.profileUrl}\n`);

    // List user's repositories
    console.log('Fetching repositories...\n');
    const repos = await client.listUserRepos(username);

    // Sort by stars
    const topRepos = utils.sortRepositories(repos, 'stars').slice(0, 5);

    console.log('=== Top 5 Repositories (by stars) ===');
    topRepos.forEach((repo, index) => {
      console.log(`${index + 1}. ${repo.name}`);
      console.log(`   ⭐ ${repo.stargazers_count} stars | 🍴 ${repo.forks_count} forks`);
      console.log(`   Language: ${repo.language || 'Not specified'}`);
      console.log(`   ${repo.description?.substring(0, 80) || 'No description'}...\n`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
if (require.main === module) {
  displayUserProfile();
}

module.exports = displayUserProfile;
