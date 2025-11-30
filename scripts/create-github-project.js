#!/usr/bin/env node
/*
Create a classic GitHub Project for this repository and import a list of issues as cards.
Usage:
  GITHUB_TOKEN=ghp_xxx node scripts/create-github-project.js

Requires: set env var GITHUB_TOKEN with repo permissions.
*/

const { Octokit } = require('@octokit/rest');

const OWNER = 'ateece-bapi';
const REPO = 'bapi-headless';

// Issue numbers to import (adjust if you added/changed numbers)
const ISSUE_NUMBERS = [26,27,28,29,30,31,32,33,34,35,36];

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('Missing GITHUB_TOKEN in environment. Export it and try again.');
    process.exit(1);
  }

  const octokit = new Octokit({ auth: token });

  console.log('Looking for an existing project or creating a new one...');
  const projectName = 'Roadmap — bapi-headless';

  // Try to find an existing project with the same name
  let project = null;
  try {
    const listResp = await octokit.request('GET /repos/{owner}/{repo}/projects', {
      owner: OWNER,
      repo: REPO,
      headers: { accept: 'application/vnd.github.inertia-preview+json' },
    });
    const projects = listResp.data;
    project = projects.find((p) => p.name === projectName) || null;
    if (project) {
      console.log('Found existing project:', project.html_url);
    }
  } catch (err) {
    // listing projects can also fail if Projects are disabled or token lacks scope
    console.warn('Could not list existing projects (this may be normal if Projects are disabled or token lacks scope).');
  }

  if (!project) {
    // create repo project (classic Projects) using the request API and preview header
    try {
      const projectResp = await octokit.request('POST /repos/{owner}/{repo}/projects', {
        owner: OWNER,
        repo: REPO,
        name: projectName,
        body: 'Automated project created by script',
        headers: { accept: 'application/vnd.github.inertia-preview+json' },
      });
      project = projectResp.data;
      console.log('Project created:', project.html_url);
    } catch (err) {
      // Provide clearer guidance when creation is not allowed (404)
      if (err.status === 404) {
        console.error('\nProject creation returned 404 Not Found. Possible causes:');
        console.error('- The GitHub token does not have the required `repo` scope or Projects permissions.');
        console.error('- Classic Projects are disabled for this repository or organization.');
        console.error('\nRecommended actions:');
        console.error('1) Verify your token scopes with:');
        console.error("   curl -I -H \"Authorization: token $GITHUB_TOKEN\" https://api.github.com/ | grep -i x-oauth-scopes");
        console.error('2) Ensure Projects (classic) are enabled in repository or organization settings.');
        console.error('3) Alternatively create the Project manually in the repo UI and re-run the script (it will import cards into an existing project).');
      }
      // If classic Projects creation failed, try to detect Projects v2 via GraphQL
      try {
        console.log('Attempting to detect Projects v2 board with the same name via GraphQL...');
        const gqlQuery = `query($owner:String!, $name:String!) {\n  repository(owner:$owner, name:$name) {\n    projectsV2(first:100) {\n      nodes { id title url }\n    }\n  }\n}`;
        const gqlResp = await octokit.request('POST /graphql', { query: gqlQuery, variables: { owner: OWNER, name: REPO } });
        const projectsV2 = gqlResp.data.data.repository?.projectsV2?.nodes || gqlResp.data.repository?.projectsV2?.nodes || [];
        const found = projectsV2.find((p) => p.title === projectName);
        if (found) {
          project = { id: found.id, url: found.url, isV2: true };
          console.log('Found Projects v2 board:', project.url);
        } else {
          console.error('No Projects v2 board named "' + projectName + '" found. Please create one in the UI and re-run.');
          throw err;
        }
      } catch (err) {
        throw err;
      }
    }
  }

  // If this is Projects v2 (detected earlier), import via GraphQL mutation; otherwise use classic flow
  if (project.isV2) {
    console.log('Importing issues into Projects v2 board...');
    for (const num of ISSUE_NUMBERS) {
      try {
        // Get issue node id via GraphQL
        const issueQuery = `query($owner:String!, $name:String!, $number:Int!) {\n  repository(owner:$owner, name:$name) {\n    issue(number:$number) { id }\n  }\n}`;
        const issueResp = await octokit.request('POST /graphql', { query: issueQuery, variables: { owner: OWNER, name: REPO, number: num } });
        const issueNodeId = issueResp.data.data?.repository?.issue?.id || issueResp.data.repository?.issue?.id;
        if (!issueNodeId) {
          console.warn('Issue #' + num + ' not found via GraphQL; skipping');
          continue;
        }

        const mutation = `mutation($projectId:ID!, $contentId:ID!) {\n  addProjectV2ItemById(input:{projectId:$projectId, contentId:$contentId}) {\n    item { id }\n  }\n}`;
        await octokit.request('POST /graphql', { query: mutation, variables: { projectId: project.id, contentId: issueNodeId } });
        console.log('Added issue #' + num + ' to Projects v2');
      } catch (err) {
        console.warn('Failed to add issue #' + num + ' to Projects v2', err.message || err);
      }
    }

    console.log('Done. Open the project at:', project.url);
  } else {
    // Classic project flow: create columns and add linked cards
    const columns = ['Backlog', 'In Progress', 'Review', 'Done'];
    const columnIds = {};
    for (const col of columns) {
      const colResp = await octokit.request('POST /projects/{project_id}/columns', {
        project_id: project.id,
        name: col,
        headers: { accept: 'application/vnd.github.inertia-preview+json' },
      });
      columnIds[col] = colResp.data.id;
      console.log('Created column', col);
    }

    // Import each issue as a linked card into Backlog
    const backlogColumnId = columnIds['Backlog'];
    for (const num of ISSUE_NUMBERS) {
      try {
        const issueResp = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
          owner: OWNER,
          repo: REPO,
          issue_number: num,
        });
        const issue = issueResp.data;
        // create a linked card
        await octokit.request('POST /projects/columns/{column_id}/cards', {
          column_id: backlogColumnId,
          content_id: issue.id,
          content_type: 'Issue',
          headers: { accept: 'application/vnd.github.inertia-preview+json' },
        });
        console.log('Added issue #' + num + ' to Backlog');
      } catch (err) {
        console.warn('Failed to add issue #' + num, err.message || err);
      }
    }

    console.log('Done. Open the project at:', project.html_url);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
