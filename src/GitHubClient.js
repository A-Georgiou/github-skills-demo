const fetch = require('node-fetch');

/**
 * GitHub API Client
 * A simple client for interacting with the GitHub API
 */
class GitHubClient {
  constructor(token = null, baseUrl = 'https://api.github.com') {
    this.token = token;
    this.baseUrl = baseUrl;
  }

  /**
   * Make a request to the GitHub API
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise<object>} API response
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    return response.json();
  }

  /**
   * Get information about a repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<object>} Repository information
   */
  async getRepository(owner, repo) {
    if (!owner || !repo) {
      throw new Error('Owner and repo parameters are required');
    }
    return this.request(`/repos/${owner}/${repo}`);
  }

  /**
   * Get issues for a repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {object} params - Query parameters (state, labels, etc.)
   * @returns {Promise<array>} List of issues
   */
  async getIssues(owner, repo, params = {}) {
    if (!owner || !repo) {
      throw new Error('Owner and repo parameters are required');
    }
    
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/repos/${owner}/${repo}/issues${queryParams ? `?${queryParams}` : ''}`;
    
    return this.request(endpoint);
  }

  /**
   * Get information about a user
   * @param {string} username - GitHub username
   * @returns {Promise<object>} User information
   */
  async getUser(username) {
    if (!username) {
      throw new Error('Username parameter is required');
    }
    return this.request(`/users/${username}`);
  }

  /**
   * Get repositories for a user
   * @param {string} username - GitHub username
   * @param {object} params - Query parameters (type, sort, direction)
   * @returns {Promise<array>} List of repositories
   */
  async getUserRepositories(username, params = {}) {
    if (!username) {
      throw new Error('Username parameter is required');
    }
    
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/users/${username}/repos${queryParams ? `?${queryParams}` : ''}`;
    
    return this.request(endpoint);
  }

  /**
   * Search repositories
   * @param {string} query - Search query
   * @param {object} params - Additional search parameters
   * @returns {Promise<object>} Search results
   */
  async searchRepositories(query, params = {}) {
    if (!query) {
      throw new Error('Query parameter is required');
    }
    
    const searchParams = new URLSearchParams({ q: query, ...params }).toString();
    const endpoint = `/search/repositories?${searchParams}`;
    
    return this.request(endpoint);
  }
}

module.exports = GitHubClient;
