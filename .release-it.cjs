module.exports = {
  git: {
    changelog:
      'echo "## Changelog\\n\\n$(npx @uphold/github-changelog-generator -rtp ${npm.name} -f unreleased | tail -n +4 -f)"',
    commitMessage: 'Release ${npm.name}@${version}',
    requireCommits: true,
    tagName: '${npm.name}@v${version}'
  },
  github: {
    release: true,
    releaseName: '${npm.name}@v${version}'
  },
  hooks: {
    'after:bump': `
      echo "$(npx @uphold/github-changelog-generator -rtp \${npm.name} -f \${npm.name}@v\${version})\n$(tail -n +2 CHANGELOG.md)" > CHANGELOG.md &&
      npm run build &&
      git add ../..
    `
  }
};
