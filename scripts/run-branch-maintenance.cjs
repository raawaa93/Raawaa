'use strict';

const { classifyBranches } = require('./branch-cleanup-policy.cjs');
const {
  expectedArchiveShaMatches,
  selectArchiveCandidates,
} = require('./branch-archive-policy.cjs');

const TARGET_REPOSITORY = 'raawaa93/Raawaa';
const API_ROOT = 'https://api.github.com';

function encodeRef(ref) {
  return ref.split('/').map((part) => encodeURIComponent(part)).join('/');
}

function archiveTagFor(branchName, date) {
  return `archive/branches/${date}/${branchName}`;
}

function buildPlan(branches, pullRequests, repository = TARGET_REPOSITORY) {
  const archiveCandidates = selectArchiveCandidates(branches, pullRequests, repository);
  const archiveNames = new Set(archiveCandidates.map((branch) => branch.name));
  const mergedCandidates = classifyBranches(branches, pullRequests, repository)
    .filter((branch) => !archiveNames.has(branch.name));

  return { archiveCandidates, mergedCandidates };
}

async function runMaintenance({
  branches,
  pullRequests,
  repository = TARGET_REPOSITORY,
  api,
  dryRun = true,
  now = () => new Date(),
}) {
  if (!api || typeof api.getBranch !== 'function' || typeof api.listPullRequests !== 'function') {
    throw new TypeError('A GitHub API adapter with getBranch and listPullRequests is required.');
  }

  const plan = buildPlan(branches, pullRequests, repository);
  const actions = [];

  for (const candidate of plan.archiveCandidates) {
    const current = await api.getBranch(candidate.name);
    if (!current) {
      actions.push({ branch: candidate.name, status: 'skipped', reason: 'branch-missing' });
      continue;
    }
    if (!expectedArchiveShaMatches(current)) {
      actions.push({ branch: candidate.name, status: 'skipped', reason: 'archive-sha-mismatch' });
      continue;
    }

    const latestPulls = await api.listPullRequests();
    const stillEligible = selectArchiveCandidates([current], latestPulls, repository)
      .some((branch) => branch.name === candidate.name);
    if (!stillEligible) {
      actions.push({ branch: candidate.name, status: 'skipped', reason: 'archive-no-longer-eligible' });
      continue;
    }

    const date = now().toISOString().slice(0, 10);
    const tag = archiveTagFor(candidate.name, date);
    if (dryRun) {
      actions.push({
        branch: candidate.name,
        sha: current.commit.sha,
        tag,
        status: 'dry-run',
        action: 'archive-then-delete',
      });
      continue;
    }

    await api.ensureAnnotatedTag({
      tag,
      sha: current.commit.sha,
      message: `Archived superseded branch ${candidate.name} at ${current.commit.sha}`,
      date: now().toISOString(),
    });

    const afterTag = await api.getBranch(candidate.name);
    if (!afterTag || afterTag.commit.sha !== current.commit.sha) {
      actions.push({ branch: candidate.name, status: 'skipped', reason: 'head-moved-after-archive-tag' });
      continue;
    }

    const finalPulls = await api.listPullRequests();
    const finalEligibility = selectArchiveCandidates([afterTag], finalPulls, repository)
      .some((branch) => branch.name === candidate.name);
    if (!finalEligibility) {
      actions.push({ branch: candidate.name, status: 'skipped', reason: 'archive-no-longer-eligible' });
      continue;
    }

    await api.deleteBranch(candidate.name);
    actions.push({
      branch: candidate.name,
      sha: current.commit.sha,
      tag,
      status: 'archived-and-deleted',
    });
  }

  for (const candidate of plan.mergedCandidates) {
    const current = await api.getBranch(candidate.name);
    if (!current) {
      actions.push({ branch: candidate.name, status: 'skipped', reason: 'branch-missing' });
      continue;
    }

    const latestPulls = await api.listPullRequests();
    const stillEligible = classifyBranches([current], latestPulls, repository)
      .some((branch) => branch.name === candidate.name);
    if (!stillEligible) {
      actions.push({ branch: candidate.name, status: 'skipped', reason: 'merged-head-no-longer-eligible' });
      continue;
    }

    if (dryRun) {
      actions.push({
        branch: candidate.name,
        sha: current.commit.sha,
        status: 'dry-run',
        action: 'delete-merged-head',
      });
      continue;
    }

    await api.deleteBranch(candidate.name);
    actions.push({
      branch: candidate.name,
      sha: current.commit.sha,
      status: 'deleted-merged-head',
    });
  }

  return {
    repository,
    dryRun,
    plan: {
      archive: plan.archiveCandidates.map((branch) => ({ name: branch.name, sha: branch.commit.sha })),
      merged: plan.mergedCandidates.map((branch) => ({ name: branch.name, sha: branch.commit.sha })),
    },
    actions,
  };
}

function createGitHubApi({ token, repository, fetchImpl = globalThis.fetch }) {
  if (!token) throw new Error('GITHUB_TOKEN is required.');
  if (repository !== TARGET_REPOSITORY) {
    throw new Error(`Refusing to maintain branches outside ${TARGET_REPOSITORY}.`);
  }
  if (typeof fetchImpl !== 'function') throw new TypeError('A fetch implementation is required.');

  async function request(method, path, body) {
    const response = await fetchImpl(`${API_ROOT}/repos/${repository}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'rawaa-exact-sha-branch-maintenance',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const raw = await response.text();
    const data = raw ? JSON.parse(raw) : null;
    if (response.status === 404) return null;
    if (!response.ok) {
      const error = new Error(data?.message || `GitHub API ${method} ${path} failed with ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  async function paginate(path) {
    const all = [];
    for (let page = 1; page <= 20; page += 1) {
      const separator = path.includes('?') ? '&' : '?';
      const rows = await request('GET', `${path}${separator}per_page=100&page=${page}`);
      if (!Array.isArray(rows)) throw new Error(`Expected a paginated array from ${path}.`);
      all.push(...rows);
      if (rows.length < 100) return all;
    }
    throw new Error(`Pagination safety limit exceeded for ${path}.`);
  }

  async function getTagRef(tag) {
    return request('GET', `/git/ref/tags/${encodeRef(tag)}`);
  }

  async function getTagObject(sha) {
    return request('GET', `/git/tags/${encodeURIComponent(sha)}`);
  }

  async function ensureAnnotatedTag({ tag, sha, message, date }) {
    async function verifyExisting() {
      const ref = await getTagRef(tag);
      if (!ref) return null;
      if (ref.object?.type !== 'tag') {
        throw new Error(`Archive ref ${tag} exists but is not an annotated tag.`);
      }
      const object = await getTagObject(ref.object.sha);
      if (object?.object?.type !== 'commit' || object.object.sha !== sha) {
        throw new Error(`Archive tag ${tag} does not point to the exact reviewed SHA.`);
      }
      return ref.object.sha;
    }

    const existing = await verifyExisting();
    if (existing) return existing;

    const tagObject = await request('POST', '/git/tags', {
      tag,
      message,
      object: sha,
      type: 'commit',
      tagger: {
        name: 'github-actions[bot]',
        email: '41898282+github-actions[bot]@users.noreply.github.com',
        date,
      },
    });

    try {
      await request('POST', '/git/refs', {
        ref: `refs/tags/${tag}`,
        sha: tagObject.sha,
      });
    } catch (error) {
      if (error.status !== 422) throw error;
    }

    const verified = await verifyExisting();
    if (!verified) throw new Error(`Archive tag ${tag} was not created.`);
    return verified;
  }

  return {
    listBranches: () => paginate('/branches'),
    listPullRequests: () => paginate('/pulls?state=all'),
    getBranch: (name) => request('GET', `/branches/${encodeRef(name)}`),
    ensureAnnotatedTag,
    deleteBranch: async (name) => {
      await request('DELETE', `/git/refs/heads/${encodeRef(name)}`);
      return true;
    },
  };
}

async function main() {
  const repository = process.env.GITHUB_REPOSITORY;
  if (repository !== TARGET_REPOSITORY) {
    throw new Error(`Refusing to run outside ${TARGET_REPOSITORY}; received ${repository || 'no repository'}.`);
  }

  const api = createGitHubApi({
    token: process.env.GITHUB_TOKEN,
    repository,
  });
  const dryRun = process.env.DRY_RUN !== 'false';
  const [branches, pullRequests] = await Promise.all([
    api.listBranches(),
    api.listPullRequests(),
  ]);

  const result = await runMaintenance({
    branches,
    pullRequests,
    repository,
    api,
    dryRun,
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  archiveTagFor,
  buildPlan,
  createGitHubApi,
  runMaintenance,
};
