const GitHubClient = require('../src/GitHubClient');
const fetch = require('node-fetch');

jest.mock('node-fetch');

describe('GitHubClient Integration Tests', () => {
  let client;

  beforeEach(() => {
    client = new GitHubClient('test-token');
    jest.clearAllMocks();
  });

  describe('Workflow: Fetching repository details and issues', () => {
    test('should fetch repository info and then fetch its issues', async () => {
      // Mock repository response
      const mockRepo = {
        name: 'test-repo',
        owner: { login: 'test-owner' },
        description: 'Test repository',
        open_issues_count: 5
      };

      // Mock issues response
      const mockIssues = [
        { id: 1, title: 'Bug fix', state: 'open' },
        { id: 2, title: 'Feature request', state: 'open' }
      ];

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRepo
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockIssues
        });

      // Fetch repository
      const repo = await client.getRepository('test-owner', 'test-repo');
      expect(repo.open_issues_count).toBe(5);

      // Fetch issues for the repository
      const issues = await client.getIssues('test-owner', 'test-repo', { state: 'open' });
      expect(issues).toHaveLength(2);
      expect(issues[0].title).toBe('Bug fix');
    });
  });

  describe('Workflow: User profile and repositories', () => {
    test('should fetch user profile and their repositories', async () => {
      const mockUser = {
        login: 'testuser',
        name: 'Test User',
        public_repos: 10
      };

      const mockRepos = [
        { name: 'repo1', stargazers_count: 100 },
        { name: 'repo2', stargazers_count: 50 }
      ];

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUser
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRepos
        });

      // Fetch user profile
      const user = await client.getUser('testuser');
      expect(user.public_repos).toBe(10);

      // Fetch user's repositories
      const repos = await client.getUserRepositories('testuser');
      expect(repos).toHaveLength(2);
      expect(repos[0].stargazers_count).toBe(100);
    });
  });

  describe('Workflow: Search and discover repositories', () => {
    test('should search for repositories and fetch details of top result', async () => {
      const mockSearchResults = {
        total_count: 100,
        items: [
          { name: 'popular-repo', owner: { login: 'test-owner' } },
          { name: 'another-repo', owner: { login: 'test-owner' } }
        ]
      };

      const mockRepoDetails = {
        name: 'popular-repo',
        owner: { login: 'test-owner' },
        stargazers_count: 1000,
        description: 'A very popular repository'
      };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSearchResults
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRepoDetails
        });

      // Search for repositories
      const searchResults = await client.searchRepositories('javascript testing');
      expect(searchResults.total_count).toBe(100);
      expect(searchResults.items).toHaveLength(2);

      // Fetch details of the first result
      const topResult = searchResults.items[0];
      const repoDetails = await client.getRepository(
        topResult.owner.login,
        topResult.name
      );
      expect(repoDetails.stargazers_count).toBe(1000);
    });
  });

  describe('Workflow: Error recovery', () => {
    test('should handle repository not found gracefully', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      try {
        await client.getRepository('nonexistent', 'repo');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toContain('404');
      }
    });

    test('should handle rate limiting', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      });

      try {
        await client.getUser('testuser');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.status).toBe(403);
        expect(error.message).toContain('403');
      }
    });

    test('should handle unauthorized access', async () => {
      const unauthClient = new GitHubClient(); // No token

      fetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      });

      try {
        await unauthClient.request('/test');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.status).toBe(401);
      }
    });
  });

  describe('Workflow: Multiple API calls in parallel', () => {
    test('should handle multiple concurrent requests', async () => {
      const mockUser = { login: 'user1', name: 'User One' };
      const mockRepo = { name: 'repo1', owner: { login: 'user1' } };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockUser
      });

      // Make multiple requests concurrently
      const [user1, user2, user3] = await Promise.all([
        client.getUser('user1'),
        client.getUser('user2'),
        client.getUser('user3')
      ]);

      expect(user1.login).toBe('user1');
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('Workflow: Filtering and pagination', () => {
    test('should fetch issues with specific filters', async () => {
      const mockIssues = [
        { id: 1, title: 'Bug', labels: [{ name: 'bug' }] },
        { id: 2, title: 'Another bug', labels: [{ name: 'bug' }] }
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockIssues
      });

      const issues = await client.getIssues('owner', 'repo', {
        state: 'open',
        labels: 'bug',
        sort: 'created',
        direction: 'desc'
      });

      expect(issues).toHaveLength(2);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('state=open'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('labels=bug'),
        expect.any(Object)
      );
    });

    test('should fetch user repositories with sorting', async () => {
      const mockRepos = [
        { name: 'newest-repo', created_at: '2023-01-01' },
        { name: 'older-repo', created_at: '2022-01-01' }
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockRepos
      });

      const repos = await client.getUserRepositories('testuser', {
        sort: 'created',
        direction: 'desc'
      });

      expect(repos).toHaveLength(2);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=created'),
        expect.any(Object)
      );
    });
  });

  describe('Workflow: Custom base URL for GitHub Enterprise', () => {
    test('should work with custom GitHub Enterprise URL', async () => {
      const enterpriseClient = new GitHubClient(
        'enterprise-token',
        'https://github.enterprise.com/api/v3'
      );

      const mockRepo = { name: 'enterprise-repo' };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockRepo
      });

      await enterpriseClient.getRepository('owner', 'repo');

      expect(fetch).toHaveBeenCalledWith(
        'https://github.enterprise.com/api/v3/repos/owner/repo',
        expect.any(Object)
      );
    });
  });
});
