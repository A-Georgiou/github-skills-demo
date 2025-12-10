const {
  formatRepository,
  summarizeIssues,
  formatUser,
  calculateEngagement,
  parseRepoUrl,
  filterByLanguage,
  sortRepositories
} = require('./utils');

describe('Utils', () => {
  describe('formatRepository', () => {
    test('should format repository data correctly', () => {
      const repo = {
        name: 'test-repo',
        full_name: 'owner/test-repo',
        description: 'A test repository',
        stargazers_count: 100,
        forks_count: 50,
        language: 'JavaScript',
        html_url: 'https://github.com/owner/test-repo'
      };

      const formatted = formatRepository(repo);

      expect(formatted).toEqual({
        name: 'test-repo',
        fullName: 'owner/test-repo',
        description: 'A test repository',
        stars: 100,
        forks: 50,
        language: 'JavaScript',
        url: 'https://github.com/owner/test-repo'
      });
    });

    test('should handle missing optional fields', () => {
      const repo = {
        name: 'test-repo'
      };

      const formatted = formatRepository(repo);

      expect(formatted.name).toBe('test-repo');
      expect(formatted.description).toBe('No description');
      expect(formatted.stars).toBe(0);
      expect(formatted.language).toBe('Not specified');
    });

    test('should throw error for null repository', () => {
      expect(() => formatRepository(null)).toThrow('Repository data is required');
    });

    test('should throw error for undefined repository', () => {
      expect(() => formatRepository(undefined)).toThrow('Repository data is required');
    });
  });

  describe('summarizeIssues', () => {
    test('should summarize issues correctly', () => {
      const issues = [
        { 
          state: 'open', 
          labels: [{ name: 'bug' }, { name: 'high-priority' }] 
        },
        { 
          state: 'open', 
          labels: [{ name: 'enhancement' }] 
        },
        { 
          state: 'closed', 
          labels: [{ name: 'bug' }] 
        }
      ];

      const summary = summarizeIssues(issues);

      expect(summary.total).toBe(3);
      expect(summary.open).toBe(2);
      expect(summary.closed).toBe(1);
      expect(summary.labels).toContain('bug');
      expect(summary.labels).toContain('enhancement');
      expect(summary.labels).toContain('high-priority');
    });

    test('should handle empty issues array', () => {
      const summary = summarizeIssues([]);

      expect(summary.total).toBe(0);
      expect(summary.open).toBe(0);
      expect(summary.closed).toBe(0);
      expect(summary.labels).toHaveLength(0);
    });

    test('should handle issues without labels', () => {
      const issues = [
        { state: 'open' },
        { state: 'closed', labels: [] }
      ];

      const summary = summarizeIssues(issues);

      expect(summary.total).toBe(2);
      expect(summary.labels).toHaveLength(0);
    });

    test('should throw error for non-array input', () => {
      expect(() => summarizeIssues('not an array')).toThrow('Issues must be an array');
      expect(() => summarizeIssues(null)).toThrow('Issues must be an array');
      expect(() => summarizeIssues({})).toThrow('Issues must be an array');
    });
  });

  describe('formatUser', () => {
    test('should format user data correctly', () => {
      const user = {
        login: 'testuser',
        name: 'Test User',
        bio: 'Software Developer',
        public_repos: 25,
        followers: 100,
        following: 50,
        html_url: 'https://github.com/testuser'
      };

      const formatted = formatUser(user);

      expect(formatted).toEqual({
        username: 'testuser',
        name: 'Test User',
        bio: 'Software Developer',
        publicRepos: 25,
        followers: 100,
        following: 50,
        profileUrl: 'https://github.com/testuser'
      });
    });

    test('should handle missing optional fields', () => {
      const user = {
        login: 'testuser'
      };

      const formatted = formatUser(user);

      expect(formatted.username).toBe('testuser');
      expect(formatted.name).toBe('testuser');
      expect(formatted.bio).toBe('No bio');
      expect(formatted.publicRepos).toBe(0);
    });

    test('should use login as name if name is not provided', () => {
      const user = {
        login: 'testuser',
        name: null
      };

      const formatted = formatUser(user);

      expect(formatted.name).toBe('testuser');
    });

    test('should throw error for null user', () => {
      expect(() => formatUser(null)).toThrow('User data is required');
    });
  });

  describe('calculateEngagement', () => {
    test('should calculate engagement score correctly', () => {
      const repo = {
        stargazers_count: 100,
        forks_count: 50,
        watchers_count: 30
      };

      const score = calculateEngagement(repo);

      // 100 * 1 + 50 * 2 + 30 * 1 = 230
      expect(score).toBe(230);
    });

    test('should handle missing counts', () => {
      const repo = {
        stargazers_count: 10
      };

      const score = calculateEngagement(repo);

      expect(score).toBe(10);
    });

    test('should handle zero counts', () => {
      const repo = {
        stargazers_count: 0,
        forks_count: 0,
        watchers_count: 0
      };

      const score = calculateEngagement(repo);

      expect(score).toBe(0);
    });

    test('should throw error for null repository', () => {
      expect(() => calculateEngagement(null)).toThrow('Repository data is required');
    });
  });

  describe('parseRepoUrl', () => {
    test('should parse HTTPS GitHub URL', () => {
      const url = 'https://github.com/owner/repo-name';
      const parsed = parseRepoUrl(url);

      expect(parsed).toEqual({
        owner: 'owner',
        repo: 'repo-name'
      });
    });

    test('should parse GitHub URL with .git extension', () => {
      const url = 'https://github.com/owner/repo-name.git';
      const parsed = parseRepoUrl(url);

      expect(parsed).toEqual({
        owner: 'owner',
        repo: 'repo-name'
      });
    });

    test('should parse HTTP GitHub URL', () => {
      const url = 'http://github.com/owner/repo-name';
      const parsed = parseRepoUrl(url);

      expect(parsed).toEqual({
        owner: 'owner',
        repo: 'repo-name'
      });
    });

    test('should throw error for invalid URL', () => {
      expect(() => parseRepoUrl('https://gitlab.com/owner/repo'))
        .toThrow('Invalid GitHub repository URL');
      expect(() => parseRepoUrl('not a url'))
        .toThrow('Invalid GitHub repository URL');
    });

    test('should throw error for null or undefined URL', () => {
      expect(() => parseRepoUrl(null)).toThrow('Valid URL string is required');
      expect(() => parseRepoUrl(undefined)).toThrow('Valid URL string is required');
      expect(() => parseRepoUrl('')).toThrow('Valid URL string is required');
    });

    test('should throw error for non-string URL', () => {
      expect(() => parseRepoUrl(123)).toThrow('Valid URL string is required');
      expect(() => parseRepoUrl({})).toThrow('Valid URL string is required');
    });
  });

  describe('filterByLanguage', () => {
    const repos = [
      { name: 'repo1', language: 'JavaScript' },
      { name: 'repo2', language: 'Python' },
      { name: 'repo3', language: 'JavaScript' },
      { name: 'repo4', language: 'Go' },
      { name: 'repo5', language: null }
    ];

    test('should filter repositories by language', () => {
      const filtered = filterByLanguage(repos, 'JavaScript');

      expect(filtered).toHaveLength(2);
      expect(filtered[0].name).toBe('repo1');
      expect(filtered[1].name).toBe('repo3');
    });

    test('should be case-insensitive', () => {
      const filtered = filterByLanguage(repos, 'javascript');

      expect(filtered).toHaveLength(2);
    });

    test('should return empty array for non-matching language', () => {
      const filtered = filterByLanguage(repos, 'Ruby');

      expect(filtered).toHaveLength(0);
    });

    test('should throw error for non-array repos', () => {
      expect(() => filterByLanguage('not an array', 'JavaScript'))
        .toThrow('Repositories must be an array');
    });

    test('should throw error for invalid language parameter', () => {
      expect(() => filterByLanguage(repos, null))
        .toThrow('Valid language string is required');
      expect(() => filterByLanguage(repos, ''))
        .toThrow('Valid language string is required');
    });
  });

  describe('sortRepositories', () => {
    const repos = [
      { 
        name: 'repo1', 
        stargazers_count: 100, 
        forks_count: 20,
        updated_at: '2023-01-01'
      },
      { 
        name: 'repo2', 
        stargazers_count: 200, 
        forks_count: 10,
        updated_at: '2023-06-01'
      },
      { 
        name: 'repo3', 
        stargazers_count: 50, 
        forks_count: 30,
        updated_at: '2023-12-01'
      }
    ];

    test('should sort by stars (default)', () => {
      const sorted = sortRepositories(repos);

      expect(sorted[0].name).toBe('repo2');
      expect(sorted[1].name).toBe('repo1');
      expect(sorted[2].name).toBe('repo3');
    });

    test('should sort by forks', () => {
      const sorted = sortRepositories(repos, 'forks');

      expect(sorted[0].name).toBe('repo3');
      expect(sorted[1].name).toBe('repo1');
      expect(sorted[2].name).toBe('repo2');
    });

    test('should sort by updated date', () => {
      const sorted = sortRepositories(repos, 'updated');

      expect(sorted[0].name).toBe('repo3');
      expect(sorted[1].name).toBe('repo2');
      expect(sorted[2].name).toBe('repo1');
    });

    test('should not mutate original array', () => {
      const original = [...repos];
      sortRepositories(repos, 'stars');

      expect(repos).toEqual(original);
    });

    test('should handle missing counts', () => {
      const reposWithMissing = [
        { name: 'repo1', stargazers_count: 100 },
        { name: 'repo2' }
      ];

      const sorted = sortRepositories(reposWithMissing, 'stars');

      expect(sorted[0].name).toBe('repo1');
      expect(sorted[1].name).toBe('repo2');
    });

    test('should throw error for invalid criteria', () => {
      expect(() => sortRepositories(repos, 'invalid'))
        .toThrow('Invalid sort criteria: invalid');
    });

    test('should throw error for non-array repos', () => {
      expect(() => sortRepositories('not an array'))
        .toThrow('Repositories must be an array');
    });
  });
});
