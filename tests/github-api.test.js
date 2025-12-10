const {
  isValidRepoFormat,
  parseRepoString,
  buildRepoUrl,
  buildApiUrl,
  extractRepoFromUrl,
  isValidGitHubUsername
} = require('../src/github-api');

describe('GitHub API Utilities', () => {
  
  describe('isValidRepoFormat', () => {
    test('should return true for valid repository format', () => {
      expect(isValidRepoFormat('owner/repo')).toBe(true);
      expect(isValidRepoFormat('my-org/my-repo')).toBe(true);
      expect(isValidRepoFormat('user_name/repo_name')).toBe(true);
      expect(isValidRepoFormat('A-Georgiou/github-skills-demo')).toBe(true);
    });

    test('should return false for invalid repository format', () => {
      expect(isValidRepoFormat('invalid')).toBe(false);
      expect(isValidRepoFormat('owner/repo/extra')).toBe(false);
      expect(isValidRepoFormat('/repo')).toBe(false);
      expect(isValidRepoFormat('owner/')).toBe(false);
      expect(isValidRepoFormat('')).toBe(false);
    });

    test('should return false for non-string input', () => {
      expect(isValidRepoFormat(null)).toBe(false);
      expect(isValidRepoFormat(undefined)).toBe(false);
      expect(isValidRepoFormat(123)).toBe(false);
      expect(isValidRepoFormat({})).toBe(false);
    });

    test('should return false for names starting or ending with hyphen', () => {
      expect(isValidRepoFormat('-owner/repo')).toBe(false);
      expect(isValidRepoFormat('owner-/repo')).toBe(false);
      expect(isValidRepoFormat('owner/-repo')).toBe(false);
      expect(isValidRepoFormat('owner/repo-')).toBe(false);
    });

    test('should return false for names with special characters', () => {
      expect(isValidRepoFormat('owner@/repo')).toBe(false);
      expect(isValidRepoFormat('owner/repo!')).toBe(false);
      expect(isValidRepoFormat('owner$/repo')).toBe(false);
    });
  });

  describe('parseRepoString', () => {
    test('should parse valid repository string', () => {
      expect(parseRepoString('owner/repo')).toEqual({ owner: 'owner', repo: 'repo' });
      expect(parseRepoString('A-Georgiou/github-skills-demo')).toEqual({ 
        owner: 'A-Georgiou', 
        repo: 'github-skills-demo' 
      });
    });

    test('should return null for invalid repository string', () => {
      expect(parseRepoString('invalid')).toBe(null);
      expect(parseRepoString('owner/repo/extra')).toBe(null);
      expect(parseRepoString('')).toBe(null);
      expect(parseRepoString(null)).toBe(null);
    });
  });

  describe('buildRepoUrl', () => {
    test('should build correct GitHub repository URL', () => {
      expect(buildRepoUrl('owner', 'repo')).toBe('https://github.com/owner/repo');
      expect(buildRepoUrl('A-Georgiou', 'github-skills-demo')).toBe(
        'https://github.com/A-Georgiou/github-skills-demo'
      );
    });

    test('should throw error for missing owner', () => {
      expect(() => buildRepoUrl('', 'repo')).toThrow('Owner and repo are required');
      expect(() => buildRepoUrl(null, 'repo')).toThrow('Owner and repo are required');
    });

    test('should throw error for missing repo', () => {
      expect(() => buildRepoUrl('owner', '')).toThrow('Owner and repo are required');
      expect(() => buildRepoUrl('owner', null)).toThrow('Owner and repo are required');
    });
  });

  describe('buildApiUrl', () => {
    test('should build correct GitHub API URL', () => {
      expect(buildApiUrl('owner', 'repo')).toBe('https://api.github.com/repos/owner/repo');
      expect(buildApiUrl('A-Georgiou', 'github-skills-demo')).toBe(
        'https://api.github.com/repos/A-Georgiou/github-skills-demo'
      );
    });

    test('should throw error for missing owner', () => {
      expect(() => buildApiUrl('', 'repo')).toThrow('Owner and repo are required');
      expect(() => buildApiUrl(null, 'repo')).toThrow('Owner and repo are required');
    });

    test('should throw error for missing repo', () => {
      expect(() => buildApiUrl('owner', '')).toThrow('Owner and repo are required');
      expect(() => buildApiUrl('owner', null)).toThrow('Owner and repo are required');
    });
  });

  describe('extractRepoFromUrl', () => {
    test('should extract repository info from GitHub URL', () => {
      expect(extractRepoFromUrl('https://github.com/owner/repo')).toEqual({
        owner: 'owner',
        repo: 'repo'
      });
      expect(extractRepoFromUrl('https://github.com/A-Georgiou/github-skills-demo')).toEqual({
        owner: 'A-Georgiou',
        repo: 'github-skills-demo'
      });
    });

    test('should extract from URLs with additional path segments', () => {
      expect(extractRepoFromUrl('https://github.com/owner/repo/issues/123')).toEqual({
        owner: 'owner',
        repo: 'repo'
      });
      expect(extractRepoFromUrl('https://github.com/owner/repo/blob/main/README.md')).toEqual({
        owner: 'owner',
        repo: 'repo'
      });
    });

    test('should return null for invalid URLs', () => {
      expect(extractRepoFromUrl('https://example.com')).toBe(null);
      expect(extractRepoFromUrl('not a url')).toBe(null);
      expect(extractRepoFromUrl('')).toBe(null);
      expect(extractRepoFromUrl(null)).toBe(null);
    });

    test('should return null for non-string input', () => {
      expect(extractRepoFromUrl(123)).toBe(null);
      expect(extractRepoFromUrl({})).toBe(null);
      expect(extractRepoFromUrl(undefined)).toBe(null);
    });
  });

  describe('isValidGitHubUsername', () => {
    test('should return true for valid usernames', () => {
      expect(isValidGitHubUsername('user')).toBe(true);
      expect(isValidGitHubUsername('user123')).toBe(true);
      expect(isValidGitHubUsername('user-name')).toBe(true);
      expect(isValidGitHubUsername('A-Georgiou')).toBe(true);
      expect(isValidGitHubUsername('a')).toBe(true);
    });

    test('should return false for invalid usernames', () => {
      expect(isValidGitHubUsername('')).toBe(false);
      expect(isValidGitHubUsername('-user')).toBe(false);
      expect(isValidGitHubUsername('user-')).toBe(false);
      expect(isValidGitHubUsername('user--name')).toBe(false);
    });

    test('should return false for usernames exceeding 39 characters', () => {
      const longUsername = 'a'.repeat(40);
      expect(isValidGitHubUsername(longUsername)).toBe(false);
    });

    test('should return true for usernames with exactly 39 characters', () => {
      const maxUsername = 'a'.repeat(39);
      expect(isValidGitHubUsername(maxUsername)).toBe(true);
    });

    test('should return false for non-string input', () => {
      expect(isValidGitHubUsername(null)).toBe(false);
      expect(isValidGitHubUsername(undefined)).toBe(false);
      expect(isValidGitHubUsername(123)).toBe(false);
      expect(isValidGitHubUsername({})).toBe(false);
    });

    test('should return false for usernames with special characters', () => {
      expect(isValidGitHubUsername('user@name')).toBe(false);
      expect(isValidGitHubUsername('user_name')).toBe(false);
      expect(isValidGitHubUsername('user.name')).toBe(false);
      expect(isValidGitHubUsername('user!name')).toBe(false);
    });
  });
});
