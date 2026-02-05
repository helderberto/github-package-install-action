import * as core from '@actions/core';
import * as github from '@actions/github';

async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token', { required: true });
    const packageName = core.getInput('package-name');
    const commentTitle = core.getInput('comment-title');

    const octokit = github.getOctokit(token);
    const context = github.context;

    if (context.eventName !== 'pull_request') {
      core.info('This action only runs on pull_request events');
      return;
    }

    if (!context.payload.pull_request) {
      core.setFailed('No pull request found in context');
      return;
    }

    const commitHash = context.payload.pull_request.head.sha.substring(0, 7);
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const installCommand = `npm install github:${owner}/${repo}#${commitHash}`;

    const packageInfo = packageName
      ? `\n\nPackage: \`${packageName}\``
      : '';

    const comment = `## ${commentTitle}

Install this PR directly from GitHub to test it before merging:

\`\`\`bash
${installCommand}
\`\`\`

Commit: \`${commitHash}\`${packageInfo}`;

    const { data: comments } = await octokit.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.pull_request.number,
    });

    const botComment = comments.find(
      (comment) =>
        comment.user?.type === 'Bot' &&
        comment.body?.includes(commentTitle)
    );

    if (botComment) {
      await octokit.rest.issues.updateComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: botComment.id,
        body: comment,
      });
      core.info('Updated existing install comment');
    } else {
      await octokit.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.payload.pull_request.number,
        body: comment,
      });
      core.info('Created new install comment');
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }
}

run();
