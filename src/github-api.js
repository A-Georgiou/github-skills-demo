const fetch = require('node-fetch');

/**
 * GitHub API Wrapper
 * Provides simple methods to interact with the GitHub API
 */
class GitHubAPI {
  constructor(baseUrl = 'https://api.github.com') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch a GitHub user by username
   * @param {string} username - The GitHub username
   * @returns {Promise<Object>} User data
   */
  async getUser(username) {
    if (!username || typeof username !== 'string') {
      throw new Error('Username must be a non-empty string');
    }

    const response = await fetch(`${this.baseUrl}/users/${username}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`User '${username}' not found`);
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * List public repositories for a user
   * @param {string} username - The GitHub username
   * @param {number} perPage - Number of repos per page (default: 30, max: 100)
   * @returns {Promise<Array>} Array of repository objects
   */
  async listUserRepos(username, perPage = 30) {
    if (!username || typeof username !== 'string') {
      throw new Error('Username must be a non-empty string');
    }

    if (perPage < 1 || perPage > 100) {
      throw new Error('perPage must be between 1 and 100');
    }

    const response = await fetch(
      `${this.baseUrl}/users/${username}/repos?per_page=${perPage}`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`User '${username}' not found`);
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get repository information
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Object>} Repository data
   */
  async getRepository(owner, repo) {
    if (!owner || typeof owner !== 'string') {
      throw new Error('Owner must be a non-empty string');
    }
    
    if (!repo || typeof repo !== 'string') {
      throw new Error('Repository name must be a non-empty string');
    }

    const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Repository '${owner}/${repo}' not found`);
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search repositories
   * @param {string} query - Search query
   * @param {number} perPage - Number of results per page (default: 30, max: 100)
   * @returns {Promise<Object>} Search results
   */
  async searchRepositories(query, perPage = 30) {
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string');
    }

    if (perPage < 1 || perPage > 100) {
      throw new Error('perPage must be between 1 and 100');
    }

    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${this.baseUrl}/search/repositories?q=${encodedQuery}&per_page=${perPage}`
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

module.exports = GitHubAPI;
