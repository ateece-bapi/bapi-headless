# Create GitHub Project and import issues

This repository includes a small Node script to create a classic GitHub Project and import a set of backlog issues as cards.

Files
- `scripts/create-github-project.js` — Node script that creates a repo Project, columns, and imports issues.

Prerequisites
- Node.js (14+)
- A GitHub Personal Access Token (PAT) with `repo` scope that can create Projects for the repository.

Usage

1. Export your token in your shell (zsh):

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

2. Run the script from the repository root:

```bash
node scripts/create-github-project.js
```

What the script does
- Creates a classic GitHub Project for the repository named `Roadmap — bapi-headless`.
- Adds columns: `Backlog`, `In Progress`, `Review`, `Done`.
- Imports the following issue numbers as linked cards into `Backlog`:
  - 26,27,28,29,30,31,32,33,34,35,36

Notes & permissions
- The script uses the classic Projects API (Projects v1). Ensure your token has permission to create repository projects.
- If your organization enforces policies or disabled Projects, the script will fail.

Next steps
- After running, open the created project URL printed by the script and adjust card order or assignees as needed.
- If you'd like, I can run this for you if you provide a PAT in a secure way, or we can run it together in a shared session.
