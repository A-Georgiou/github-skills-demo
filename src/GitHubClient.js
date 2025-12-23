const { Octokit } = require('@octokit/rest');

/**
 * GitHubClient - A wrapper class for GitHub API operations
 */
class GitHubClient {
  constructor(token = null) {
    this.octokit = new Octokit({
      auth: token
    });
  }

  /**
   * Get repository information
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Object>} Repository data
   */
  async getRepository(owner, repo) {
    try {
      const { data } = await this.octokit.repos.get({
        owner,
        repo
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch repository: ${error.message}`);
    }
  }

  /**
   * List repository issues
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} state - Issue state (open, closed, all)
   * @returns {Promise<Array>} List of issues
   */
  async listIssues(owner, repo, state = 'open') {
    try {
      const { data } = await this.octokit.issues.listForRepo({
        owner,
        repo,
        state
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to list issues: ${error.message}`);
    }
  }

  /**
   * Get user information
   * @param {string} username - GitHub username
   * @returns {Promise<Object>} User data
   */
  async getUser(username) {
    try {
      const { data } = await this.octokit.users.getByUsername({
        username
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  /**
   * List user repositories
   * @param {string} username - GitHub username
   * @returns {Promise<Array>} List of repositories
   */
  async listUserRepos(username) {
    try {
      const { data } = await this.octokit.repos.listForUser({
        username,
        sort: 'updated',
        direction: 'desc'
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to list user repositories: ${error.message}`);
    }
  }

  /**
   * Search repositories
   * @param {string} query - Search query
   * @param {number} perPage - Results per page
   * @returns {Promise<Object>} Search results
   */
  async searchRepositories(query, perPage = 10) {
    try {
      const { data } = await this.octokit.search.repos({
        q: query,
        per_page: perPage
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to search repositories: ${error.message}`);
    }
  }

  /**
   * Get repository commits
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {number} perPage - Results per page
   * @returns {Promise<Array>} List of commits
   */
  async getCommits(owner, repo, perPage = 10) {
    try {
      const { data } = await this.octokit.repos.listCommits({
        owner,
        repo,
        per_page: perPage
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch commits: ${error.message}`);
    }
  }

  /**
   * Get pull requests for a repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} state - PR state (open, closed, all)
   * @returns {Promise<Array>} List of pull requests
   */
  async getPullRequests(owner, repo, state = 'open') {
    try {
      const { data } = await this.octokit.pulls.list({
        owner,
        repo,
        state
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch pull requests: ${error.message}`);
    }
  }
}

module.exports = GitHubClient;
