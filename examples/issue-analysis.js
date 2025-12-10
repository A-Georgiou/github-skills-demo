/**
 * Example: Issue tracking and analysis
 * 
 * This example demonstrates how to fetch and analyze
 * repository issues.
 */

const GitHubClient = require('../src/GitHubClient');
const utils = require('../src/utils');

async function analyzeIssues() {
  const client = new GitHubClient();

  try {
    const owner = 'microsoft';
    const repo = 'vscode';

    console.log(`Fetching issues for ${owner}/${repo}...\n`);

    // Fetch open issues
    const openIssues = await client.listIssues(owner, repo, 'open');
    
    // Get issue summary
    const summary = utils.summarizeIssues(openIssues);

    console.log('=== Issue Summary ===');
    console.log(`Total Issues: ${summary.total}`);
    console.log(`Open: ${summary.open}`);
    console.log(`Closed: ${summary.closed}\n`);

    if (summary.labels.length > 0) {
      console.log('Labels found:', summary.labels.slice(0, 10).join(', '));
      if (summary.labels.length > 10) {
        console.log(`... and ${summary.labels.length - 10} more\n`);
      } else {
        console.log('');
      }
    }

    // Show recent issues
    console.log('=== Recent Open Issues ===');
    openIssues.slice(0, 5).forEach((issue, index) => {
      console.log(`${index + 1}. #${issue.number} - ${issue.title}`);
      console.log(`   State: ${issue.state}`);
      console.log(`   Labels: ${issue.labels.map(l => l.name).join(', ') || 'None'}`);
      console.log(`   URL: ${issue.html_url}\n`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
if (require.main === module) {
  analyzeIssues();
}

module.exports = analyzeIssues;
