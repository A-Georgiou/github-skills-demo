# github-skills-demo

A sandbox repository used to demonstrate and test **GitHub Copilot agent capabilities** with the GitHub API.

## What this repo does

This repository serves as a controlled playground for exploring how GitHub Copilot task agents interact with GitHub. It is intentionally minimal so that agents can be given well-defined tasks against a real repository without affecting production code.

### Primary use cases

- **GitHub API demonstrations** – exploring Copilot's ability to read repository metadata, branches, commits, issues, and pull requests via the GitHub MCP server.
- **Agent task testing** – used as a live target for tasks such as "create a PR", "list open issues", or "summarise repository activity".
- **Skills evaluation** – benchmarking what Copilot agents can and cannot do when given open-ended repository tasks.

## Repository structure

| Path | Purpose |
|------|---------|
| `README.md` | This file – describes the repository |
| `.github/custom-instructions.md` | Agent-level instructions injected into Copilot sessions |

## Notes

- The `main` branch is kept intentionally sparse.
- Open draft PRs are artefacts of previous Copilot agent test runs and are not intended to be merged.

