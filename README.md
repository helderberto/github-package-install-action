# GitHub Package Install Action

GitHub Action to automatically post npm install commands for testing packages directly from GitHub commits.

## Features

- 🎯 Generates npm install command with commit hash
- 📦 Allows testing PRs before merging
- 🔄 Updates existing comment instead of creating duplicates
- 💡 Optional package name for context

## Installation

Add this action to your workflow file (e.g., `.github/workflows/ci.yml`):

```yaml
- uses: helderberto/github-package-install-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Quick Start

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

## Configuration

### Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `github-token` | GitHub token for authentication | ✅ Yes | - |
| `package-name` | Package name (for display) | No | - |
| `comment-title` | Title for the PR comment | No | `🎯 Test this PR` |

### Examples

**Basic usage (minimal):**
```yaml
- uses: helderberto/github-package-install-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

**With package name:**
```yaml
- uses: helderberto/github-package-install-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    package-name: my-awesome-package
```

**Custom comment title:**
```yaml
- uses: helderberto/github-package-install-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    comment-title: '📦 Try This Version'
```

**Complete example with tests:**
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
        if: success()
        uses: helderberto/github-package-install-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          package-name: my-package
```

## Requirements

- Requires `pull-requests: write` permission
- Only runs on `pull_request` events
- Package must be buildable from the GitHub repository

## Example Output

The action posts a comment on your PR that looks like this:

---

## 🎯 Test this PR

Install this PR directly from GitHub to test it before merging:

```bash
npm install github:helderberto/stato#abc1234
```

Commit: `abc1234`

Package: `stato-react`

---

### How to Test

1. **Copy the install command** from the comment above
2. **Run it in your project:**
   ```bash
   npm install github:helderberto/stato#abc1234
   ```
3. **Test the changes** in your local environment
4. **Provide feedback** on the PR

### Reverting

To go back to the published version:
```bash
npm install stato-react@latest
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
