const GitHubAPI = require('../src/github-api');

// Mock node-fetch
jest.mock('node-fetch');
const fetch = require('node-fetch');

describe('GitHubAPI', () => {
  let api;

  beforeEach(() => {
    api = new GitHubAPI();
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    test('should use default base URL when none provided', () => {
      const api = new GitHubAPI();
      expect(api.baseUrl).toBe('https://api.github.com');
    });

    test('should use custom base URL when provided', () => {
      const customUrl = 'https://custom.api.github.com';
      const api = new GitHubAPI(customUrl);
      expect(api.baseUrl).toBe(customUrl);
    });
  });

  describe('getUser', () => {
    test('should fetch user successfully', async () => {
      const mockUser = {
        login: 'octocat',
        id: 1,
        name: 'The Octocat',
        public_repos: 8
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockUser
      });

      const result = await api.getUser('octocat');

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/users/octocat');
      expect(result).toEqual(mockUser);
    });

    test('should throw error for empty username', async () => {
      await expect(api.getUser('')).rejects.toThrow('Username must be a non-empty string');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error for null username', async () => {
      await expect(api.getUser(null)).rejects.toThrow('Username must be a non-empty string');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error for undefined username', async () => {
      await expect(api.getUser(undefined)).rejects.toThrow('Username must be a non-empty string');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error for non-string username', async () => {
      await expect(api.getUser(123)).rejects.toThrow('Username must be a non-empty string');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error when user not found', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(api.getUser('nonexistentuser')).rejects.toThrow("User 'nonexistentuser' not found");
    });

    test('should throw error for other API errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(api.getUser('octocat')).rejects.toThrow('GitHub API error: 500 Internal Server Error');
    });
  });

  describe('listUserRepos', () => {
    test('should list user repositories successfully', async () => {
      const mockRepos = [
        { id: 1, name: 'repo1', full_name: 'octocat/repo1' },
        { id: 2, name: 'repo2', full_name: 'octocat/repo2' }
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockRepos
      });

      const result = await api.listUserRepos('octocat');

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/users/octocat/repos?per_page=30');
      expect(result).toEqual(mockRepos);
    });

    test('should respect custom perPage parameter', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      await api.listUserRepos('octocat', 50);

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/users/octocat/repos?per_page=50');
    });

    test('should throw error for empty username', async () => {
      await expect(api.listUserRepos('')).rejects.toThrow('Username must be a non-empty string');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error for invalid perPage (too low)', async () => {
      await expect(api.listUserRepos('octocat', 0)).rejects.toThrow('perPage must be between 1 and 100');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error for invalid perPage (too high)', async () => {
      await expect(api.listUserRepos('octocat', 101)).rejects.toThrow('perPage must be between 1 and 100');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error when user not found', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(api.listUserRepos('nonexistentuser')).rejects.toThrow("User 'nonexistentuser' not found");
    });

    test('should throw error for other API errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      });

      await expect(api.listUserRepos('octocat')).rejects.toThrow('GitHub API error: 403 Forbidden');
    });
  });

  describe('getRepository', () => {
    test('should fetch repository successfully', async () => {
      const mockRepo = {
        id: 1,
        name: 'hello-world',
        full_name: 'octocat/hello-world',
        description: 'My first repository',
        stargazers_count: 80
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockRepo
      });

      const result = await api.getRepository('octocat', 'hello-world');

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/repos/octocat/hello-world');
      expect(result).toEqual(mockRepo);
    });

    test('should throw error for empty owner', async () => {
      await expect(api.getRepository('', 'repo')).rejects.toThrow('Owner must be a non-empty string');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error for empty repository name', async () => {
      await expect(api.getRepository('octocat', '')).rejects.toThrow('Repository name must be a non-empty string');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error for null owner', async () => {
      await expect(api.getRepository(null, 'repo')).rejects.toThrow('Owner must be a non-empty string');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error for null repository name', async () => {
      await expect(api.getRepository('octocat', null)).rejects.toThrow('Repository name must be a non-empty string');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error when repository not found', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(api.getRepository('octocat', 'nonexistent')).rejects.toThrow("Repository 'octocat/nonexistent' not found");
    });

    test('should throw error for other API errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(api.getRepository('octocat', 'hello-world')).rejects.toThrow('GitHub API error: 500 Internal Server Error');
    });
  });

  describe('searchRepositories', () => {
    test('should search repositories successfully', async () => {
      const mockSearchResults = {
        total_count: 2,
        items: [
          { id: 1, name: 'test-repo-1' },
          { id: 2, name: 'test-repo-2' }
        ]
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockSearchResults
      });

      const result = await api.searchRepositories('test');

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/search/repositories?q=test&per_page=30');
      expect(result).toEqual(mockSearchResults);
    });

    test('should encode special characters in query', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ total_count: 0, items: [] })
      });

      await api.searchRepositories('test query with spaces');

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/search/repositories?q=test%20query%20with%20spaces&per_page=30');
    });

    test('should respect custom perPage parameter', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ total_count: 0, items: [] })
      });

      await api.searchRepositories('test', 50);

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/search/repositories?q=test&per_page=50');
    });

    test('should throw error for empty query', async () => {
      await expect(api.searchRepositories('')).rejects.toThrow('Query must be a non-empty string');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error for null query', async () => {
      await expect(api.searchRepositories(null)).rejects.toThrow('Query must be a non-empty string');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error for undefined query', async () => {
      await expect(api.searchRepositories(undefined)).rejects.toThrow('Query must be a non-empty string');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error for invalid perPage (too low)', async () => {
      await expect(api.searchRepositories('test', 0)).rejects.toThrow('perPage must be between 1 and 100');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error for invalid perPage (too high)', async () => {
      await expect(api.searchRepositories('test', 101)).rejects.toThrow('perPage must be between 1 and 100');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should throw error for API errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity'
      });

      await expect(api.searchRepositories('test')).rejects.toThrow('GitHub API error: 422 Unprocessable Entity');
    });
  });

  describe('Edge cases and integration scenarios', () => {
    test('should handle network errors', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      await expect(api.getUser('octocat')).rejects.toThrow('Network error');
    });

    test('should handle malformed JSON response', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      await expect(api.getUser('octocat')).rejects.toThrow('Invalid JSON');
    });

    test('should work with different base URLs', async () => {
      const customApi = new GitHubAPI('https://custom.github.com/api/v3');
      
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ login: 'test' })
      });

      await customApi.getUser('test');

      expect(fetch).toHaveBeenCalledWith('https://custom.github.com/api/v3/users/test');
    });

    test('should handle concurrent requests', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ login: 'test' })
      });

      const promises = [
        api.getUser('user1'),
        api.getUser('user2'),
        api.getUser('user3')
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });
});
