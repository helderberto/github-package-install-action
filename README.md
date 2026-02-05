# GitHub Package Install Action

GitHub Action to automatically post npm install commands for testing packages directly from GitHub commits.

## Features

- 🎯 Generates npm install command with commit hash
- 📦 Allows testing PRs before merging
- 🔄 Updates existing comment instead of creating duplicates
- 💡 Optional package name for context

## Usage

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Post install command
        uses: helderberto/github-package-install-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          package-name: my-package-name
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `github-token` | GitHub token for authentication | Yes | - |
| `package-name` | Package name (for display) | No | - |
| `comment-title` | Title for the PR comment | No | `🎯 Test this PR` |

## Requirements

- Requires `pull-requests: write` permission
- Only runs on `pull_request` events
- Package must be buildable from the GitHub repository

## Example Output

The action posts a comment like this:

```markdown
## 🎯 Test this PR

Install this PR directly from GitHub to test it before merging:

\`\`\`bash
npm install github:owner/repo#abc1234
\`\`\`

Commit: `abc1234`

Package: `my-package-name`
```

## Why Use This?

Testing npm packages before they're published:
- ✅ Verify changes work in real projects
- ✅ Test breaking changes before merging
- ✅ Get feedback from reviewers with actual usage
- ✅ No need to publish pre-release versions

## How It Works

GitHub allows installing npm packages directly from repositories using the format:

```bash
npm install github:owner/repo#commit-hash
```

This action:
1. Gets the PR commit hash
2. Generates the install command
3. Posts/updates a PR comment with the command
4. Allows users to test the exact PR changes

## License

MIT
