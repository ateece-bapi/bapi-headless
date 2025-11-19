#!/usr/bin/env node
/*
Prune merged branches in this repository.

Behavior:
- Lists branches on the repo (first 100).
- For each non-default, non-protected branch, checks if there's a closed PR with merged_at set for that branch's head (owner:branch).
- If found, deletes the branch reference via the GitHub API.

Environment:
- GITHUB_REPOSITORY (owner/repo) - optional, defaults to repo remote if not set.
- GITHUB_TOKEN - required to authenticate and delete refs.
- DEFAULT_BRANCH - optional, defaults to 'main'.
- DRY_RUN - if 'true', the script will only print what it would delete.
*/

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('GITHUB_TOKEN is required to run this script.');
  process.exit(1);
}

const repoEnv = process.env.GITHUB_REPOSITORY || 'ateece-bapi/bapi-headless';
const [owner, repo] = repoEnv.split('/');
const DEFAULT_BRANCH = process.env.DEFAULT_BRANCH || 'main';
const DRY_RUN = String(process.env.DRY_RUN || 'true') === 'true';

const API_BASE = 'https://api.github.com';
const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'User-Agent': 'prune-merged-branches-script',
};

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, { headers, ...opts });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

async function listBranches() {
  const url = `${API_BASE}/repos/${owner}/${repo}/branches?per_page=100`;
  return fetchJson(url);
}

async function listClosedPRsForBranch(branch) {
  // List closed PRs with head=owner:branch
  const url = `${API_BASE}/repos/${owner}/${repo}/pulls?state=closed&per_page=100&head=${owner}:${encodeURIComponent(branch)}`;
  return fetchJson(url);
}

async function deleteBranch(branch) {
  const url = `${API_BASE}/repos/${owner}/${repo}/git/refs/heads/${encodeURIComponent(branch)}`;
  const res = await fetch(url, { method: 'DELETE', headers });
  if (res.status === 204) return true;
  const text = await res.text().catch(() => '');
  throw new Error(`Failed to delete branch ${branch}: ${res.status} ${res.statusText} ${text}`);
}

async function main() {
  console.log(`Prune merged branches for ${owner}/${repo} (default: ${DEFAULT_BRANCH}) - DRY_RUN=${DRY_RUN}`);
  const branches = await listBranches();
  let deleted = 0;
  for (const b of branches) {
    const name = b.name;
    if (name === DEFAULT_BRANCH) continue;
    if (b.protected) {
      console.log(`Skipping protected branch: ${name}`);
      continue;
    }

    try {
      const prs = await listClosedPRsForBranch(name);
      const mergedPR = prs.find(p => p.merged_at);
      if (mergedPR) {
        console.log(`Branch ${name} is merged via PR #${mergedPR.number} (merged_at=${mergedPR.merged_at}).`);
        if (DRY_RUN) {
          console.log(`[DRY RUN] Would delete branch: ${name}`);
        } else {
          await deleteBranch(name);
          console.log(`Deleted branch: ${name}`);
          deleted++;
        }
      } else {
        console.log(`No merged PR found for branch: ${name}`);
      }
    } catch (err) {
      console.error(`Error processing branch ${name}:`, String(err));
    }
  }
  console.log(`Done. Deleted ${deleted} branches (DRY_RUN=${DRY_RUN}).`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
