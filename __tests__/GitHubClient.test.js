const GitHubClient = require('../src/GitHubClient');
const fetch = require('node-fetch');

// Mock node-fetch
jest.mock('node-fetch');

describe('GitHubClient', () => {
  let client;

  beforeEach(() => {
    client = new GitHubClient();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should create instance with default values', () => {
      const client = new GitHubClient();
      expect(client.token).toBeNull();
      expect(client.baseUrl).toBe('https://api.github.com');
    });

    test('should create instance with token', () => {
      const client = new GitHubClient('test-token');
      expect(client.token).toBe('test-token');
    });

    test('should create instance with custom base URL', () => {
      const client = new GitHubClient(null, 'https://custom.api.com');
      expect(client.baseUrl).toBe('https://custom.api.com');
    });
  });

  describe('request', () => {
    test('should make successful API request', async () => {
      const mockResponse = { data: 'test' };
      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await client.request('/test');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/vnd.github.v3+json'
          })
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include authorization header when token is provided', async () => {
      const client = new GitHubClient('test-token');
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({})
      });

      await client.request('/test');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'token test-token'
          })
        })
      );
    });

    test('should throw error on failed request', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(client.request('/test')).rejects.toThrow('GitHub API error: 404 Not Found');
    });

    test('should include error status in thrown error', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      });

      try {
        await client.request('/test');
      } catch (error) {
        expect(error.status).toBe(403);
      }
    });

    test('should merge custom headers with default headers', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({})
      });

      await client.request('/test', {
        headers: { 'Custom-Header': 'value' }
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/vnd.github.v3+json',
            'Custom-Header': 'value'
          })
        })
      );
    });
  });

  describe('getRepository', () => {
    test('should fetch repository information', async () => {
      const mockRepo = {
        name: 'test-repo',
        owner: { login: 'test-owner' },
        description: 'Test repository'
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockRepo
      });

      const result = await client.getRepository('test-owner', 'test-repo');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/test-owner/test-repo',
        expect.any(Object)
      );
      expect(result).toEqual(mockRepo);
    });

    test('should throw error when owner is missing', async () => {
      await expect(client.getRepository('', 'test-repo')).rejects.toThrow(
        'Owner and repo parameters are required'
      );
    });

    test('should throw error when repo is missing', async () => {
      await expect(client.getRepository('test-owner', '')).rejects.toThrow(
        'Owner and repo parameters are required'
      );
    });

    test('should throw error when both parameters are missing', async () => {
      await expect(client.getRepository()).rejects.toThrow(
        'Owner and repo parameters are required'
      );
    });
  });

  describe('getIssues', () => {
    test('should fetch repository issues', async () => {
      const mockIssues = [
        { id: 1, title: 'Issue 1' },
        { id: 2, title: 'Issue 2' }
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockIssues
      });

      const result = await client.getIssues('test-owner', 'test-repo');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/test-owner/test-repo/issues',
        expect.any(Object)
      );
      expect(result).toEqual(mockIssues);
    });

    test('should include query parameters', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      await client.getIssues('test-owner', 'test-repo', {
        state: 'open',
        labels: 'bug'
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('state=open'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('labels=bug'),
        expect.any(Object)
      );
    });

    test('should throw error when owner is missing', async () => {
      await expect(client.getIssues('', 'test-repo')).rejects.toThrow(
        'Owner and repo parameters are required'
      );
    });

    test('should throw error when repo is missing', async () => {
      await expect(client.getIssues('test-owner', '')).rejects.toThrow(
        'Owner and repo parameters are required'
      );
    });
  });

  describe('getUser', () => {
    test('should fetch user information', async () => {
      const mockUser = {
        login: 'testuser',
        name: 'Test User',
        bio: 'A test user'
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockUser
      });

      const result = await client.getUser('testuser');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser',
        expect.any(Object)
      );
      expect(result).toEqual(mockUser);
    });

    test('should throw error when username is missing', async () => {
      await expect(client.getUser('')).rejects.toThrow(
        'Username parameter is required'
      );
    });

    test('should throw error when username is undefined', async () => {
      await expect(client.getUser()).rejects.toThrow(
        'Username parameter is required'
      );
    });
  });

  describe('getUserRepositories', () => {
    test('should fetch user repositories', async () => {
      const mockRepos = [
        { name: 'repo1' },
        { name: 'repo2' }
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockRepos
      });

      const result = await client.getUserRepositories('testuser');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser/repos',
        expect.any(Object)
      );
      expect(result).toEqual(mockRepos);
    });

    test('should include query parameters', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      await client.getUserRepositories('testuser', {
        type: 'owner',
        sort: 'updated'
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('type=owner'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=updated'),
        expect.any(Object)
      );
    });

    test('should throw error when username is missing', async () => {
      await expect(client.getUserRepositories()).rejects.toThrow(
        'Username parameter is required'
      );
    });
  });

  describe('searchRepositories', () => {
    test('should search repositories', async () => {
      const mockResults = {
        total_count: 2,
        items: [
          { name: 'repo1' },
          { name: 'repo2' }
        ]
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResults
      });

      const result = await client.searchRepositories('test');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/search/repositories?q=test'),
        expect.any(Object)
      );
      expect(result).toEqual(mockResults);
    });

    test('should include additional search parameters', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ total_count: 0, items: [] })
      });

      await client.searchRepositories('test', {
        sort: 'stars',
        order: 'desc'
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=test'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=stars'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('order=desc'),
        expect.any(Object)
      );
    });

    test('should throw error when query is missing', async () => {
      await expect(client.searchRepositories()).rejects.toThrow(
        'Query parameter is required'
      );
    });

    test('should throw error when query is empty string', async () => {
      await expect(client.searchRepositories('')).rejects.toThrow(
        'Query parameter is required'
      );
    });
  });

  describe('error handling', () => {
    test('should handle network errors', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      await expect(client.request('/test')).rejects.toThrow('Network error');
    });

    test('should handle 401 unauthorized errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      });

      await expect(client.request('/test')).rejects.toThrow('GitHub API error: 401 Unauthorized');
    });

    test('should handle 403 forbidden errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      });

      await expect(client.request('/test')).rejects.toThrow('GitHub API error: 403 Forbidden');
    });

    test('should handle 404 not found errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(client.request('/test')).rejects.toThrow('GitHub API error: 404 Not Found');
    });

    test('should handle 500 server errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(client.request('/test')).rejects.toThrow('GitHub API error: 500 Internal Server Error');
    });
  });
});
