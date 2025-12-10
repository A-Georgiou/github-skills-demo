/**
 * GitHub API Utilities
 * A collection of utility functions for working with GitHub repository data
 */

/**
 * Validates if a string is a valid GitHub repository format (owner/repo)
 * @param {string} repoString - The repository string to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidRepoFormat(repoString) {
  if (typeof repoString !== 'string') {
    return false;
  }
  
  const parts = repoString.split('/');
  if (parts.length !== 2) {
    return false;
  }
  
  const [owner, repo] = parts;
  
  // GitHub username/org and repo name rules:
  // - Cannot be empty
  // - Can contain alphanumeric, hyphens, underscores
  // - Cannot start or end with hyphen
  const validPattern = /^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/;
  
  return owner.length > 0 && 
         repo.length > 0 && 
         validPattern.test(owner) && 
         validPattern.test(repo);
}

/**
 * Parses a GitHub repository string into owner and repo components
 * @param {string} repoString - The repository string (owner/repo)
 * @returns {Object|null} Object with owner and repo properties, or null if invalid
 */
function parseRepoString(repoString) {
  if (!isValidRepoFormat(repoString)) {
    return null;
  }
  
  const [owner, repo] = repoString.split('/');
  return { owner, repo };
}

/**
 * Constructs a GitHub repository URL
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {string} Full GitHub repository URL
 */
function buildRepoUrl(owner, repo) {
  if (!owner || !repo) {
    throw new Error('Owner and repo are required');
  }
  
  return `https://github.com/${owner}/${repo}`;
}

/**
 * Constructs a GitHub API URL for a repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {string} GitHub API URL for the repository
 */
function buildApiUrl(owner, repo) {
  if (!owner || !repo) {
    throw new Error('Owner and repo are required');
  }
  
  return `https://api.github.com/repos/${owner}/${repo}`;
}

/**
 * Extracts repository information from a GitHub URL
 * @param {string} url - GitHub URL
 * @returns {Object|null} Object with owner and repo properties, or null if invalid
 */
function extractRepoFromUrl(url) {
  if (typeof url !== 'string') {
    return null;
  }
  
  // Match github.com URLs
  // Pattern matches GitHub's naming rules: start/end with alphanumeric, can contain underscores and hyphens
  const githubPattern = /github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?)\/([a-zA-Z0-9](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?)/;
  const match = url.match(githubPattern);
  
  if (!match) {
    return null;
  }
  
  return {
    owner: match[1],
    repo: match[2]
  };
}

/**
 * Validates if a string is a valid GitHub username
 * @param {string} username - The username to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidGitHubUsername(username) {
  if (typeof username !== 'string') {
    return false;
  }
  
  // GitHub username rules:
  // - Max 39 characters
  // - Can contain alphanumeric and hyphens
  // - Cannot start or end with hyphen
  // - Cannot have consecutive hyphens
  if (username.length === 0 || username.length > 39) {
    return false;
  }
  
  const validPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  const hasConsecutiveHyphens = /--/.test(username);
  
  return validPattern.test(username) && !hasConsecutiveHyphens;
}

module.exports = {
  isValidRepoFormat,
  parseRepoString,
  buildRepoUrl,
  buildApiUrl,
  extractRepoFromUrl,
  isValidGitHubUsername
};
