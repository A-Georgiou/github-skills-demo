const GitHubClient = require('./GitHubClient');
const nock = require('nock');

describe('GitHubClient', () => {
  let client;
  const GITHUB_API = 'https://api.github.com';

  beforeEach(() => {
    client = new GitHubClient();
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('constructor', () => {
    test('should create instance without token', () => {
      const client = new GitHubClient();
      expect(client).toBeInstanceOf(GitHubClient);
      expect(client.octokit).toBeDefined();
    });

    test('should create instance with token', () => {
      const client = new GitHubClient('test-token');
      expect(client).toBeInstanceOf(GitHubClient);
      expect(client.octokit).toBeDefined();
    });
  });

  describe('getRepository', () => {
    test('should fetch repository data successfully', async () => {
      const mockRepo = {
        id: 1,
        name: 'test-repo',
        full_name: 'owner/test-repo',
        description: 'Test repository',
        stargazers_count: 100,
        forks_count: 50
      };

      nock(GITHUB_API)
        .get('/repos/owner/test-repo')
        .reply(200, mockRepo);

      const result = await client.getRepository('owner', 'test-repo');
      
      expect(result).toEqual(mockRepo);
      expect(result.name).toBe('test-repo');
      expect(result.stargazers_count).toBe(100);
    });

    test('should throw error when repository not found', async () => {
      nock(GITHUB_API)
        .get('/repos/owner/nonexistent')
        .reply(404, { message: 'Not Found' });

      await expect(client.getRepository('owner', 'nonexistent'))
        .rejects.toThrow('Failed to fetch repository');
    });

    test('should handle API errors gracefully', async () => {
      nock(GITHUB_API)
        .get('/repos/owner/test-repo')
        .reply(500, { message: 'Internal Server Error' });

      await expect(client.getRepository('owner', 'test-repo'))
        .rejects.toThrow('Failed to fetch repository');
    });
  });

  describe('listIssues', () => {
    test('should list open issues by default', async () => {
      const mockIssues = [
        { id: 1, title: 'Issue 1', state: 'open' },
        { id: 2, title: 'Issue 2', state: 'open' }
      ];

      nock(GITHUB_API)
        .get('/repos/owner/test-repo/issues')
        .query({ state: 'open' })
        .reply(200, mockIssues);

      const result = await client.listIssues('owner', 'test-repo');
      
      expect(result).toHaveLength(2);
      expect(result[0].state).toBe('open');
    });

    test('should list closed issues when specified', async () => {
      const mockIssues = [
        { id: 1, title: 'Issue 1', state: 'closed' }
      ];

      nock(GITHUB_API)
        .get('/repos/owner/test-repo/issues')
        .query({ state: 'closed' })
        .reply(200, mockIssues);

      const result = await client.listIssues('owner', 'test-repo', 'closed');
      
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('closed');
    });

    test('should throw error on API failure', async () => {
      nock(GITHUB_API)
        .get('/repos/owner/test-repo/issues')
        .query({ state: 'open' })
        .reply(403, { message: 'Forbidden' });

      await expect(client.listIssues('owner', 'test-repo'))
        .rejects.toThrow('Failed to list issues');
    });
  });

  describe('getUser', () => {
    test('should fetch user data successfully', async () => {
      const mockUser = {
        login: 'testuser',
        id: 12345,
        name: 'Test User',
        public_repos: 10,
        followers: 50
      };

      nock(GITHUB_API)
        .get('/users/testuser')
        .reply(200, mockUser);

      const result = await client.getUser('testuser');
      
      expect(result.login).toBe('testuser');
      expect(result.public_repos).toBe(10);
      expect(result.followers).toBe(50);
    });

    test('should throw error when user not found', async () => {
      nock(GITHUB_API)
        .get('/users/nonexistent')
        .reply(404, { message: 'Not Found' });

      await expect(client.getUser('nonexistent'))
        .rejects.toThrow('Failed to fetch user');
    });
  });

  describe('listUserRepos', () => {
    test('should list user repositories', async () => {
      const mockRepos = [
        { id: 1, name: 'repo1', stargazers_count: 10 },
        { id: 2, name: 'repo2', stargazers_count: 20 }
      ];

      nock(GITHUB_API)
        .get('/users/testuser/repos')
        .query({ sort: 'updated', direction: 'desc' })
        .reply(200, mockRepos);

      const result = await client.listUserRepos('testuser');
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('repo1');
      expect(result[1].name).toBe('repo2');
    });

    test('should return empty array for user with no repos', async () => {
      nock(GITHUB_API)
        .get('/users/testuser/repos')
        .query({ sort: 'updated', direction: 'desc' })
        .reply(200, []);

      const result = await client.listUserRepos('testuser');
      
      expect(result).toHaveLength(0);
    });

    test('should throw error on API failure', async () => {
      nock(GITHUB_API)
        .get('/users/testuser/repos')
        .query({ sort: 'updated', direction: 'desc' })
        .reply(500, { message: 'Internal Server Error' });

      await expect(client.listUserRepos('testuser'))
        .rejects.toThrow('Failed to list user repositories');
    });
  });

  describe('searchRepositories', () => {
    test('should search repositories with default page size', async () => {
      const mockSearchResults = {
        total_count: 2,
        items: [
          { id: 1, name: 'repo1', full_name: 'owner/repo1' },
          { id: 2, name: 'repo2', full_name: 'owner/repo2' }
        ]
      };

      nock(GITHUB_API)
        .get('/search/repositories')
        .query({ q: 'test', per_page: 10 })
        .reply(200, mockSearchResults);

      const result = await client.searchRepositories('test');
      
      expect(result.total_count).toBe(2);
      expect(result.items).toHaveLength(2);
    });

    test('should search repositories with custom page size', async () => {
      const mockSearchResults = {
        total_count: 100,
        items: [
          { id: 1, name: 'repo1', full_name: 'owner/repo1' }
        ]
      };

      nock(GITHUB_API)
        .get('/search/repositories')
        .query({ q: 'javascript', per_page: 1 })
        .reply(200, mockSearchResults);

      const result = await client.searchRepositories('javascript', 1);
      
      expect(result.items).toHaveLength(1);
    });

    test('should throw error on search failure', async () => {
      nock(GITHUB_API)
        .get('/search/repositories')
        .query({ q: 'test', per_page: 10 })
        .reply(422, { message: 'Validation Failed' });

      await expect(client.searchRepositories('test'))
        .rejects.toThrow('Failed to search repositories');
    });
  });

  describe('getCommits', () => {
    test('should fetch repository commits', async () => {
      const mockCommits = [
        { 
          sha: 'abc123',
          commit: { message: 'First commit', author: { name: 'Test User' } }
        },
        { 
          sha: 'def456',
          commit: { message: 'Second commit', author: { name: 'Test User' } }
        }
      ];

      nock(GITHUB_API)
        .get('/repos/owner/test-repo/commits')
        .query({ per_page: 10 })
        .reply(200, mockCommits);

      const result = await client.getCommits('owner', 'test-repo');
      
      expect(result).toHaveLength(2);
      expect(result[0].sha).toBe('abc123');
      expect(result[0].commit.message).toBe('First commit');
    });

    test('should fetch commits with custom page size', async () => {
      const mockCommits = [
        { sha: 'abc123', commit: { message: 'First commit' } }
      ];

      nock(GITHUB_API)
        .get('/repos/owner/test-repo/commits')
        .query({ per_page: 1 })
        .reply(200, mockCommits);

      const result = await client.getCommits('owner', 'test-repo', 1);
      
      expect(result).toHaveLength(1);
    });

    test('should throw error when commits cannot be fetched', async () => {
      nock(GITHUB_API)
        .get('/repos/owner/test-repo/commits')
        .query({ per_page: 10 })
        .reply(404, { message: 'Not Found' });

      await expect(client.getCommits('owner', 'test-repo'))
        .rejects.toThrow('Failed to fetch commits');
    });
  });

  describe('getPullRequests', () => {
    test('should list open pull requests by default', async () => {
      const mockPRs = [
        { id: 1, title: 'PR 1', state: 'open', number: 1 },
        { id: 2, title: 'PR 2', state: 'open', number: 2 }
      ];

      nock(GITHUB_API)
        .get('/repos/owner/test-repo/pulls')
        .query({ state: 'open' })
        .reply(200, mockPRs);

      const result = await client.getPullRequests('owner', 'test-repo');
      
      expect(result).toHaveLength(2);
      expect(result[0].state).toBe('open');
    });

    test('should list closed pull requests when specified', async () => {
      const mockPRs = [
        { id: 1, title: 'PR 1', state: 'closed', number: 1 }
      ];

      nock(GITHUB_API)
        .get('/repos/owner/test-repo/pulls')
        .query({ state: 'closed' })
        .reply(200, mockPRs);

      const result = await client.getPullRequests('owner', 'test-repo', 'closed');
      
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('closed');
    });

    test('should throw error on API failure', async () => {
      nock(GITHUB_API)
        .get('/repos/owner/test-repo/pulls')
        .query({ state: 'open' })
        .reply(500, { message: 'Internal Server Error' });

      await expect(client.getPullRequests('owner', 'test-repo'))
        .rejects.toThrow('Failed to fetch pull requests');
    });
  });
});
