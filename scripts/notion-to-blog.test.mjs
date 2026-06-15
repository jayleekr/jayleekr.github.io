import { describe, expect, it } from 'vitest';
import { generatePRBody, repoRelativePath, runCommand } from './notion-to-blog.mjs';

describe('notion-to-blog command safety', () => {
  it('passes shell metacharacters as literal command arguments', () => {
    const title = 'bad"; touch /tmp/notion-owned; echo "';
    const result = runCommand(
      process.execPath,
      [
        '-e',
        'process.stdout.write(JSON.stringify(process.argv.slice(1)))',
        `feat: Add post "${title}" from Notion`
      ],
      { encoding: 'utf-8' }
    );

    expect(JSON.parse(result.stdout)).toEqual([`feat: Add post "${title}" from Notion`]);
  });

  it('keeps generated PR body literal when passed as an argument', () => {
    const body = generatePRBody({
      success: [{ title: '$(touch /tmp/notion-pr-body-owned)', file: 'src/content/blog/x.mdx' }],
      skipped: [],
      failed: []
    });

    const result = runCommand(
      process.execPath,
      ['-e', 'process.stdout.write(process.argv[1])', body],
      { encoding: 'utf-8' }
    );

    expect(result.stdout).toBe(body);
  });

  it('refuses to add generated paths outside the repository', () => {
    expect(() => repoRelativePath('/tmp/outside-repo.mdx')).toThrow(/outside repository/);
  });
});
