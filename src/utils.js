/**
 * Utility functions for GitHub API data processing
 */

/**
 * Format repository data for display
 * @param {Object} repo - Repository object from GitHub API
 * @returns {Object} Formatted repository data
 */
function formatRepository(repo) {
  if (!repo) {
    throw new Error('Repository data is required');
  }

  return {
    name: repo.name || 'Unknown',
    fullName: repo.full_name || 'Unknown',
    description: repo.description || 'No description',
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    language: repo.language || 'Not specified',
    url: repo.html_url || ''
  };
}

/**
 * Extract issue summary from issues list
 * @param {Array} issues - Array of issue objects
 * @returns {Object} Issue summary statistics
 */
function summarizeIssues(issues) {
  if (!Array.isArray(issues)) {
    throw new Error('Issues must be an array');
  }

  return {
    total: issues.length,
    open: issues.filter(issue => issue.state === 'open').length,
    closed: issues.filter(issue => issue.state === 'closed').length,
    labels: [...new Set(issues.flatMap(issue => 
      (issue.labels || []).map(label => label.name)
    ))]
  };
}

/**
 * Format user profile data
 * @param {Object} user - User object from GitHub API
 * @returns {Object} Formatted user data
 */
function formatUser(user) {
  if (!user) {
    throw new Error('User data is required');
  }

  return {
    username: user.login || 'Unknown',
    name: user.name || user.login || 'Unknown',
    bio: user.bio || 'No bio',
    publicRepos: user.public_repos || 0,
    followers: user.followers || 0,
    following: user.following || 0,
    profileUrl: user.html_url || ''
  };
}

/**
 * Calculate repository engagement score
 * @param {Object} repo - Repository object
 * @returns {number} Engagement score
 */
function calculateEngagement(repo) {
  if (!repo) {
    throw new Error('Repository data is required');
  }

  const stars = repo.stargazers_count || 0;
  const forks = repo.forks_count || 0;
  const watchers = repo.watchers_count || 0;
  
  // Simple engagement score: stars * 1 + forks * 2 + watchers * 1
  return stars + (forks * 2) + watchers;
}

/**
 * Parse GitHub repository URL
 * @param {string} url - GitHub repository URL
 * @returns {Object} Parsed owner and repo
 */
function parseRepoUrl(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('Valid URL string is required');
  }

  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  
  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }

  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, '')
  };
}

/**
 * Filter repositories by language
 * @param {Array} repos - Array of repository objects
 * @param {string} language - Programming language to filter by
 * @returns {Array} Filtered repositories
 */
function filterByLanguage(repos, language) {
  if (!Array.isArray(repos)) {
    throw new Error('Repositories must be an array');
  }

  if (!language || typeof language !== 'string') {
    throw new Error('Valid language string is required');
  }

  return repos.filter(repo => 
    repo.language && repo.language.toLowerCase() === language.toLowerCase()
  );
}

/**
 * Sort repositories by criteria
 * @param {Array} repos - Array of repository objects
 * @param {string} criteria - Sort criteria (stars, forks, updated)
 * @returns {Array} Sorted repositories
 */
function sortRepositories(repos, criteria = 'stars') {
  if (!Array.isArray(repos)) {
    throw new Error('Repositories must be an array');
  }

  const sortedRepos = [...repos];

  switch (criteria) {
    case 'stars':
      return sortedRepos.sort((a, b) => 
        (b.stargazers_count || 0) - (a.stargazers_count || 0)
      );
    case 'forks':
      return sortedRepos.sort((a, b) => 
        (b.forks_count || 0) - (a.forks_count || 0)
      );
    case 'updated':
      return sortedRepos.sort((a, b) => 
        new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
      );
    default:
      throw new Error(`Invalid sort criteria: ${criteria}`);
  }
}

module.exports = {
  formatRepository,
  summarizeIssues,
  formatUser,
  calculateEngagement,
  parseRepoUrl,
  filterByLanguage,
  sortRepositories
};
