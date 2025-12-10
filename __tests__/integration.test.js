const GitHubClient = require('../src/GitHubClient');
const utils = require('../src/utils');
const nock = require('nock');

describe('Integration Tests', () => {
  let client;
  const GITHUB_API = 'https://api.github.com';

  beforeEach(() => {
    client = new GitHubClient();
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Repository workflow', () => {
    test('should fetch and format repository data', async () => {
      const mockRepo = {
        name: 'awesome-project',
        full_name: 'user/awesome-project',
        description: 'An awesome project',
        stargazers_count: 500,
        forks_count: 100,
        watchers_count: 50,
        language: 'JavaScript',
        html_url: 'https://github.com/user/awesome-project'
      };

      nock(GITHUB_API)
        .get('/repos/user/awesome-project')
        .reply(200, mockRepo);

      // Fetch repository
      const repo = await client.getRepository('user', 'awesome-project');
      
      // Format the data
      const formatted = utils.formatRepository(repo);
      
      // Calculate engagement
      const engagement = utils.calculateEngagement(repo);

      expect(formatted.name).toBe('awesome-project');
      expect(formatted.stars).toBe(500);
      expect(engagement).toBe(750); // 500 + (100 * 2) + 50
    });

    test('should search and filter repositories', async () => {
      const mockSearchResults = {
        total_count: 3,
        items: [
          { 
            name: 'js-lib', 
            language: 'JavaScript',
            stargazers_count: 200,
            forks_count: 50,
            watchers_count: 20
          },
          { 
            name: 'py-tool', 
            language: 'Python',
            stargazers_count: 150,
            forks_count: 30,
            watchers_count: 15
          },
          { 
            name: 'js-framework', 
            language: 'JavaScript',
            stargazers_count: 300,
            forks_count: 80,
            watchers_count: 40
          }
        ]
      };

      nock(GITHUB_API)
        .get('/search/repositories')
        .query({ q: 'web development', per_page: 10 })
        .reply(200, mockSearchResults);

      // Search repositories
      const searchResults = await client.searchRepositories('web development');
      
      // Filter JavaScript repositories
      const jsRepos = utils.filterByLanguage(searchResults.items, 'JavaScript');
      
      // Sort by stars
      const sorted = utils.sortRepositories(jsRepos, 'stars');

      expect(jsRepos).toHaveLength(2);
      expect(sorted[0].name).toBe('js-framework');
      expect(sorted[0].stargazers_count).toBe(300);
    });
  });

  describe('User workflow', () => {
    test('should fetch user and their repositories', async () => {
      const mockUser = {
        login: 'developer',
        name: 'Developer Name',
        bio: 'Full-stack developer',
        public_repos: 15,
        followers: 200,
        following: 50,
        html_url: 'https://github.com/developer'
      };

      const mockRepos = [
        {
          name: 'project1',
          stargazers_count: 50,
          forks_count: 10,
          language: 'JavaScript',
          updated_at: '2024-01-01'
        },
        {
          name: 'project2',
          stargazers_count: 100,
          forks_count: 20,
          language: 'Python',
          updated_at: '2024-02-01'
        }
      ];

      nock(GITHUB_API)
        .get('/users/developer')
        .reply(200, mockUser);

      nock(GITHUB_API)
        .get('/users/developer/repos')
        .query({ sort: 'updated', direction: 'desc' })
        .reply(200, mockRepos);

      // Fetch user
      const user = await client.getUser('developer');
      const formattedUser = utils.formatUser(user);

      // Fetch user's repositories
      const repos = await client.listUserRepos('developer');
      const sortedRepos = utils.sortRepositories(repos, 'stars');

      expect(formattedUser.username).toBe('developer');
      expect(formattedUser.publicRepos).toBe(15);
      expect(repos).toHaveLength(2);
      expect(sortedRepos[0].name).toBe('project2');
    });
  });

  describe('Issue workflow', () => {
    test('should fetch and summarize issues', async () => {
      const mockIssues = [
        {
          id: 1,
          title: 'Bug in login',
          state: 'open',
          labels: [{ name: 'bug' }, { name: 'high-priority' }]
        },
        {
          id: 2,
          title: 'Feature request',
          state: 'open',
          labels: [{ name: 'enhancement' }]
        },
        {
          id: 3,
          title: 'Old bug',
          state: 'closed',
          labels: [{ name: 'bug' }]
        }
      ];

      nock(GITHUB_API)
        .get('/repos/user/project/issues')
        .query({ state: 'open' })
        .reply(200, mockIssues.filter(i => i.state === 'open'));

      nock(GITHUB_API)
        .get('/repos/user/project/issues')
        .query({ state: 'all' })
        .reply(200, mockIssues);

      // Fetch open issues
      const openIssues = await client.listIssues('user', 'project', 'open');
      
      // Fetch all issues
      const allIssues = await client.listIssues('user', 'project', 'all');
      
      // Summarize
      const summary = utils.summarizeIssues(allIssues);

      expect(openIssues).toHaveLength(2);
      expect(summary.total).toBe(3);
      expect(summary.open).toBe(2);
      expect(summary.closed).toBe(1);
      expect(summary.labels).toContain('bug');
      expect(summary.labels).toContain('enhancement');
    });
  });

  describe('URL parsing workflow', () => {
    test('should parse URL and fetch repository', async () => {
      const repoUrl = 'https://github.com/owner/amazing-repo';
      
      const mockRepo = {
        name: 'amazing-repo',
        full_name: 'owner/amazing-repo',
        description: 'Amazing repository',
        stargazers_count: 1000,
        forks_count: 200,
        language: 'TypeScript',
        html_url: repoUrl
      };

      // Parse URL
      const { owner, repo } = utils.parseRepoUrl(repoUrl);

      nock(GITHUB_API)
        .get(`/repos/${owner}/${repo}`)
        .reply(200, mockRepo);

      // Fetch using parsed values
      const repoData = await client.getRepository(owner, repo);
      const formatted = utils.formatRepository(repoData);

      expect(owner).toBe('owner');
      expect(repo).toBe('amazing-repo');
      expect(formatted.stars).toBe(1000);
    });

    test('should handle .git URLs correctly', async () => {
      const repoUrl = 'https://github.com/owner/project.git';
      
      const { owner, repo } = utils.parseRepoUrl(repoUrl);

      expect(owner).toBe('owner');
      expect(repo).toBe('project');
    });
  });

  describe('Complex data processing', () => {
    test('should process and rank repositories by engagement', async () => {
      const mockRepos = [
        {
          name: 'repo1',
          stargazers_count: 100,
          forks_count: 20,
          watchers_count: 30,
          language: 'JavaScript',
          updated_at: '2024-01-01'
        },
        {
          name: 'repo2',
          stargazers_count: 200,
          forks_count: 50,
          watchers_count: 40,
          language: 'JavaScript',
          updated_at: '2024-02-01'
        },
        {
          name: 'repo3',
          stargazers_count: 150,
          forks_count: 100,
          watchers_count: 25,
          language: 'Python',
          updated_at: '2024-03-01'
        }
      ];

      // Calculate engagement for each
      const reposWithEngagement = mockRepos.map(repo => ({
        ...repo,
        engagement: utils.calculateEngagement(repo)
      }));

      // Sort by engagement (custom logic)
      const sortedByEngagement = [...reposWithEngagement].sort(
        (a, b) => b.engagement - a.engagement
      );

      expect(sortedByEngagement[0].name).toBe('repo3'); // 150 + 200 + 25 = 375
      expect(sortedByEngagement[1].name).toBe('repo2'); // 200 + 100 + 40 = 340
      expect(sortedByEngagement[2].name).toBe('repo1'); // 100 + 40 + 30 = 170
    });

    test('should filter and format multiple repositories', async () => {
      const mockRepos = [
        {
          name: 'js-project',
          full_name: 'user/js-project',
          description: 'JavaScript project',
          stargazers_count: 50,
          forks_count: 10,
          language: 'JavaScript',
          html_url: 'https://github.com/user/js-project'
        },
        {
          name: 'py-project',
          full_name: 'user/py-project',
          description: 'Python project',
          stargazers_count: 30,
          forks_count: 5,
          language: 'Python',
          html_url: 'https://github.com/user/py-project'
        }
      ];

      // Filter JavaScript repos
      const jsRepos = utils.filterByLanguage(mockRepos, 'JavaScript');
      
      // Format them
      const formatted = jsRepos.map(repo => utils.formatRepository(repo));

      expect(formatted).toHaveLength(1);
      expect(formatted[0].name).toBe('js-project');
      expect(formatted[0].language).toBe('JavaScript');
      expect(formatted[0].stars).toBe(50);
    });
  });

  describe('Error handling integration', () => {
    test('should handle cascading errors gracefully', async () => {
      nock(GITHUB_API)
        .get('/repos/invalid/repo')
        .reply(404, { message: 'Not Found' });

      // This should throw
      await expect(client.getRepository('invalid', 'repo'))
        .rejects.toThrow('Failed to fetch repository');

      // Utils should also handle errors
      expect(() => utils.formatRepository(null))
        .toThrow('Repository data is required');
    });
  });
});
