'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  archiveTagFor,
  buildPlan,
  createGitHubApi,
  runMaintenance,
} = require('../../scripts/run-branch-maintenance.cjs');

const REPOSITORY = 'raawaa93/Raawaa';
const ARCHIVE_BRANCH = 'docs/final-live-state-2026-11-21';
const ARCHIVE_SHA = 'b617c56799a3d913878df4915a1c2a94ea273617';
const MERGED_BRANCH = 'docs/tooling-refresh-2026-11-21';
const MERGED_SHA = '2e4c679c5230aa873f432e187dffdad9ff7a936e';

function branchRef(name, sha, protectedBranch = false) {
  return { name, protected: protectedBranch, commit: { sha } };
}

function pull(name, { sha, merged = true, state = 'closed' } = {}) {
  return {
    state,
    merged_at: merged ? '2026-11-21T00:00:00Z' : null,
    head: {
      ref: name,
      sha,
      repo: { full_name: REPOSITORY },
    },
  };
}

test('archive tags are deterministic and retain the complete branch name', () => {
  assert.equal(
    archiveTagFor(ARCHIVE_BRANCH, '2026-11-21'),
    'archive/branches/2026-11-21/docs/final-live-state-2026-11-21',
  );
});

test('buildPlan selects only exact allowlisted merged heads and exact archive SHAs', () => {
  const branches = [
    branchRef(MERGED_BRANCH, MERGED_SHA),
    branchRef(ARCHIVE_BRANCH, ARCHIVE_SHA),
    branchRef('main', 'main-sha', true),
    branchRef('release/production', 'release-sha'),
    branchRef('unknown/branch', 'unknown-sha'),
  ];
  const pulls = [
    pull(MERGED_BRANCH, { sha: MERGED_SHA, merged: true }),
    pull(ARCHIVE_BRANCH, { sha: ARCHIVE_SHA, merged: false }),
  ];

  const plan = buildPlan(branches, pulls, REPOSITORY);
  assert.deepEqual(plan.archiveCandidates.map((item) => item.name), [ARCHIVE_BRANCH]);
  assert.deepEqual(plan.mergedCandidates.map((item) => item.name), [MERGED_BRANCH]);
});

test('archive tag is verified before the closed-unmerged branch is deleted', async () => {
  const branch = branchRef(ARCHIVE_BRANCH, ARCHIVE_SHA);
  const calls = [];
  const api = {
    getBranch: async () => branch,
    listPullRequests: async () => [pull(ARCHIVE_BRANCH, { sha: ARCHIVE_SHA, merged: false })],
    ensureAnnotatedTag: async ({ tag, sha }) => {
      calls.push(['tag', tag, sha]);
      return 'annotated-tag-object';
    },
    deleteBranch: async (name) => {
      calls.push(['delete', name]);
      return true;
    },
  };

  const result = await runMaintenance({
    branches: [branch],
    pullRequests: [pull(ARCHIVE_BRANCH, { sha: ARCHIVE_SHA, merged: false })],
    repository: REPOSITORY,
    api,
    dryRun: false,
    now: () => new Date('2026-11-21T00:00:00.000Z'),
  });

  assert.equal(result.actions[0].status, 'archived-and-deleted');
  assert.deepEqual(calls.map((call) => call[0]), ['tag', 'delete']);
});

test('archive candidate is skipped when the live branch SHA has moved', async () => {
  const branch = branchRef(ARCHIVE_BRANCH, ARCHIVE_SHA);
  const calls = [];
  const api = {
    getBranch: async () => branchRef(ARCHIVE_BRANCH, 'moved-sha'),
    listPullRequests: async () => [pull(ARCHIVE_BRANCH, { sha: ARCHIVE_SHA, merged: false })],
    ensureAnnotatedTag: async () => calls.push('tag'),
    deleteBranch: async () => calls.push('delete'),
  };

  const result = await runMaintenance({
    branches: [branch],
    pullRequests: [pull(ARCHIVE_BRANCH, { sha: ARCHIVE_SHA, merged: false })],
    repository: REPOSITORY,
    api,
    dryRun: false,
  });

  assert.equal(result.actions[0].status, 'skipped');
  assert.equal(result.actions[0].reason, 'archive-sha-mismatch');
  assert.deepEqual(calls, []);
});

test('archive candidate is skipped if an open PR appears before deletion', async () => {
  const branch = branchRef(ARCHIVE_BRANCH, ARCHIVE_SHA);
  const calls = [];
  const api = {
    getBranch: async () => branch,
    listPullRequests: async () => [pull(ARCHIVE_BRANCH, { sha: ARCHIVE_SHA, merged: false, state: 'open' })],
    ensureAnnotatedTag: async () => calls.push('tag'),
    deleteBranch: async () => calls.push('delete'),
  };

  const result = await runMaintenance({
    branches: [branch],
    pullRequests: [pull(ARCHIVE_BRANCH, { sha: ARCHIVE_SHA, merged: false })],
    repository: REPOSITORY,
    api,
    dryRun: false,
  });

  assert.equal(result.actions[0].status, 'skipped');
  assert.equal(result.actions[0].reason, 'archive-no-longer-eligible');
  assert.deepEqual(calls, []);
});

test('dry run reports eligible actions without creating tags or deleting refs', async () => {
  const branch = branchRef(MERGED_BRANCH, MERGED_SHA);
  const calls = [];
  const api = {
    getBranch: async () => branch,
    listPullRequests: async () => [pull(MERGED_BRANCH, { sha: MERGED_SHA, merged: true })],
    ensureAnnotatedTag: async () => calls.push('tag'),
    deleteBranch: async () => calls.push('delete'),
  };

  const result = await runMaintenance({
    branches: [branch],
    pullRequests: [pull(MERGED_BRANCH, { sha: MERGED_SHA, merged: true })],
    repository: REPOSITORY,
    api,
    dryRun: true,
  });

  assert.equal(result.actions[0].status, 'dry-run');
  assert.deepEqual(calls, []);
});

test('merged branch is deleted only when its exact merged PR head remains current', async () => {
  const branch = branchRef(MERGED_BRANCH, MERGED_SHA);
  const calls = [];
  const api = {
    getBranch: async () => branch,
    listPullRequests: async () => [pull(MERGED_BRANCH, { sha: MERGED_SHA, merged: true })],
    ensureAnnotatedTag: async () => calls.push('tag'),
    deleteBranch: async (name) => calls.push(name),
  };

  const result = await runMaintenance({
    branches: [branch],
    pullRequests: [pull(MERGED_BRANCH, { sha: MERGED_SHA, merged: true })],
    repository: REPOSITORY,
    api,
    dryRun: false,
  });

  assert.equal(result.actions[0].status, 'deleted-merged-head');
  assert.deepEqual(calls, [MERGED_BRANCH]);
});

function response(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => null },
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

test('GitHub API client creates and verifies an annotated archive tag before returning', async () => {
  const calls = [];
  const commitSha = ARCHIVE_SHA;
  const tagObjectSha = 'annotated-tag-object-sha';
  let tagRefCreated = false;
  const fetchImpl = async (url, options = {}) => {
    const method = options.method || 'GET';
    calls.push({ method, url });
    if (method === 'GET' && url.includes('/git/ref/tags/')) {
      return tagRefCreated
        ? response(200, { object: { type: 'tag', sha: tagObjectSha } })
        : response(404, { message: 'Not Found' });
    }
    if (method === 'POST' && url.endsWith('/git/tags')) {
      return response(201, { sha: tagObjectSha });
    }
    if (method === 'POST' && url.endsWith('/git/refs')) {
      tagRefCreated = true;
      return response(201, { object: { type: 'tag', sha: tagObjectSha } });
    }
    if (method === 'GET' && url.endsWith(`/git/tags/${tagObjectSha}`)) {
      return response(200, { object: { type: 'commit', sha: commitSha } });
    }
    throw new Error(`Unexpected request: ${method} ${url}`);
  };

  const api = createGitHubApi({ token: 'test-token', repository: REPOSITORY, fetchImpl });
  const tag = archiveTagFor(ARCHIVE_BRANCH, '2026-11-21');
  const result = await api.ensureAnnotatedTag({
    tag,
    sha: commitSha,
    message: 'archive test',
    date: '2026-11-21T00:00:00.000Z',
  });

  assert.equal(result, tagObjectSha);
  assert.deepEqual(calls.map((call) => call.method), ['GET', 'POST', 'POST', 'GET', 'GET']);
});
