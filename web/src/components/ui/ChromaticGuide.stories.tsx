import type { Meta, StoryObj } from '@storybook/nextjs';

/**
 * Chromatic Visual Regression Testing
 *
 * Automated screenshot testing for catching unintended UI changes:
 * - Captures screenshots of all Storybook stories
 * - Compares against baseline snapshots on every PR
 * - Highlights visual differences (color, layout, spacing, typography)
 * - Requires manual approval for intentional changes
 * - Runs via GitHub Actions on pull requests
 *
 * Benefits:
 * - Catch CSS regressions before production
 * - No more "I didn't realize that changed"
 * - Visual review for every component change
 * - Team collaboration on UI updates
 * - Historical snapshot archive
 */

const meta: Meta = {
  title: 'Tests/ChromaticGuide',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      // This story itself is excluded from Chromatic to avoid recursion
      disableSnapshot: true,
    },
    docs: {
      description: {
        component:
          'Guide to Chromatic visual regression testing. Explains how automated screenshot testing works, PR review workflow, and how to handle visual changes. See full setup instructions in docs/CHROMATIC-SETUP.md.',
      },
    },
  },
};

export default meta;

/**
 * What is Chromatic?
 */
export const WhatIsChromatic: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-xl border-2 border-primary-200 bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-4xl font-bold text-neutral-900">
            Chromatic Visual Regression Testing
          </h1>
          <p className="text-xl text-neutral-600">
            Automated screenshot testing for Storybook components
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <span className="text-2xl">📸</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">How It Works</h2>
            </div>
            <ol className="space-y-3 text-neutral-700">
              <li className="flex gap-2">
                <span className="font-bold text-primary-600">1.</span>
                <span>Chromatic captures screenshots of all Storybook stories</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-600">2.</span>
                <span>Compares new screenshots against baseline snapshots</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-600">3.</span>
                <span>Highlights any visual differences (pixel-perfect)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-600">4.</span>
                <span>Requires manual approval for intentional changes</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary-600">5.</span>
                <span>Rejects unintended regressions</span>
              </li>
            </ol>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">What It Catches</h2>
            </div>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex gap-2">
                <span className="text-accent-600">•</span>
                <span>Color changes (hex value differences)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent-600">•</span>
                <span>Layout shifts (spacing, alignment)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent-600">•</span>
                <span>Typography changes (font size, weight)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent-600">•</span>
                <span>Border/shadow modifications</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent-600">•</span>
                <span>Icon replacements</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent-600">•</span>
                <span>Responsive breakpoint issues</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl bg-primary-600 p-8 text-white">
          <h2 className="mb-4 text-2xl font-bold">Current Coverage</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold">86+</div>
              <div className="text-primary-100">Story Variations</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold">19</div>
              <div className="text-primary-100">Component Files</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold">100%</div>
              <div className="text-primary-100">Critical Path</div>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-primary-100">
            Day 1 + Day 2 Storybook coverage: Design system, cart, checkout, forms, products
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Overview of Chromatic visual regression testing. Explains how it works, what it catches, and current story coverage.',
      },
    },
  },
};

/**
 * PR Workflow
 */
export const PRWorkflow: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-3xl font-bold text-neutral-900">Pull Request Workflow</h1>
          <p className="text-lg text-neutral-600">
            How Chromatic integrates into your development process
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="rounded-xl border-l-4 border-primary-500 bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-lg font-bold text-white">
                1
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Open Pull Request</h2>
            </div>
            <p className="ml-13 text-neutral-700">
              When you open a PR to <code className="rounded bg-neutral-100 px-2 py-1">main</code>,
              GitHub Actions automatically triggers Chromatic build.
            </p>
            <div className="ml-13 mt-3 rounded-lg bg-neutral-50 p-4 font-mono text-sm">
              <div>✓ GitHub Action: chromatic.yml</div>
              <div className="text-neutral-500">  → Installs dependencies (pnpm)</div>
              <div className="text-neutral-500">  → Builds Storybook (production)</div>
              <div className="text-neutral-500">  → Uploads to Chromatic</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border-l-4 border-accent-500 bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-lg font-bold text-neutral-900">
                2
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Chromatic Captures</h2>
            </div>
            <p className="ml-13 text-neutral-700">
              Chromatic takes screenshots of all stories at multiple viewports (desktop, tablet,
              mobile).
            </p>
            <div className="ml-13 mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-neutral-100 p-3 text-center">
                <div className="font-bold">Desktop</div>
                <div className="text-sm text-neutral-600">1200x800</div>
              </div>
              <div className="rounded-lg bg-neutral-100 p-3 text-center">
                <div className="font-bold">Tablet</div>
                <div className="text-sm text-neutral-600">768x1024</div>
              </div>
              <div className="rounded-lg bg-neutral-100 p-3 text-center">
                <div className="font-bold">Mobile</div>
                <div className="text-sm text-neutral-600">375x667</div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border-l-4 border-green-500 bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white">
                3
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Status Check Appears</h2>
            </div>
            <p className="ml-13 mb-4 text-neutral-700">
              Chromatic adds a status check to your PR with one of three states:
            </p>
            <div className="ml-13 space-y-3">
              <div className="flex items-center gap-3 rounded-lg border-2 border-green-200 bg-green-50 p-4">
                <span className="text-2xl">✅</span>
                <div>
                  <div className="font-bold text-green-900">No Changes</div>
                  <div className="text-sm text-green-700">
                    All screenshots match baseline. Safe to merge.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
                <span className="text-2xl">🔶</span>
                <div>
                  <div className="font-bold text-yellow-900">Changes Detected</div>
                  <div className="text-sm text-yellow-700">
                    Visual differences found. Review required.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <span className="text-2xl">❌</span>
                <div>
                  <div className="font-bold text-red-900">Build Failed</div>
                  <div className="text-sm text-red-700">Storybook build error (rare).</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl border-l-4 border-purple-500 bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-lg font-bold text-white">
                4
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Review Changes</h2>
            </div>
            <p className="ml-13 mb-4 text-neutral-700">
              Click "Details" on status check to open Chromatic UI. Review side-by-side
              comparisons:
            </p>
            <div className="ml-13 rounded-lg bg-neutral-100 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded border-2 border-neutral-300 bg-white p-4 text-center">
                  <div className="mb-2 text-sm font-bold text-neutral-600">Baseline</div>
                  <div className="text-neutral-500">Previous approved state</div>
                </div>
                <div className="rounded border-2 border-primary-500 bg-primary-50 p-4 text-center">
                  <div className="mb-2 text-sm font-bold text-primary-600">Current</div>
                  <div className="text-neutral-700">Your PR changes</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-neutral-600">
                Differences highlighted in red overlay
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="rounded-xl border-l-4 border-green-500 bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white">
                5
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Approve or Request Changes</h2>
            </div>
            <div className="ml-13 space-y-3">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="mb-1 font-bold text-green-900">✓ Accept Changes</div>
                <div className="text-sm text-green-700">
                  Click "Accept" if changes are intentional. This updates baseline for future
                  comparisons.
                </div>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="mb-1 font-bold text-red-900">✗ Request Changes</div>
                <div className="text-sm text-red-700">
                  Click "Request changes" if differences are unintended. Developer must fix and
                  re-push.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '5-step PR workflow showing how Chromatic integrates with GitHub. From PR open → status check → review → approve/reject.',
      },
    },
  },
};

/**
 * Setup Instructions
 */
export const SetupInstructions: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-3xl font-bold text-neutral-900">Chromatic Setup Guide</h1>
          <p className="text-lg text-neutral-600">
            Get visual regression testing running in 5 minutes
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold text-neutral-900">Prerequisites</h2>
            <ul className="space-y-2 text-neutral-700">
              <li className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span>Storybook configured (@storybook/nextjs 10.2.1)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span>@chromatic-com/storybook addon installed</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span>package.json has `chromatic` script</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span>GitHub repository access</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-primary-200 bg-primary-50 p-6">
            <h2 className="mb-4 text-2xl font-bold text-primary-900">Step 1: Create Account</h2>
            <ol className="space-y-3 text-primary-900">
              <li>1. Visit <a href="https://www.chromatic.com/" className="underline">chromatic.com</a></li>
              <li>2. Click "Sign in with GitHub"</li>
              <li>3. Authorize Chromatic to access your repositories</li>
              <li>4. Select "ateece-bapi/bapi-headless" project</li>
              <li>5. Copy the <strong>Project Token</strong> (starts with <code>chpt_</code>)</li>
            </ol>
          </div>

          <div className="rounded-xl border border-accent-200 bg-accent-50 p-6">
            <h2 className="mb-4 text-2xl font-bold text-neutral-900">Step 2: Add GitHub Secret</h2>
            <ol className="space-y-3 text-neutral-900">
              <li>1. Go to GitHub: <strong>Settings → Secrets → Actions</strong></li>
              <li>2. Click <strong>"New repository secret"</strong></li>
              <li>3. Name: <code className="rounded bg-neutral-100 px-2 py-1">CHROMATIC_PROJECT_TOKEN</code></li>
              <li>4. Value: Paste token from Chromatic dashboard</li>
              <li>5. Click <strong>"Add secret"</strong></li>
            </ol>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <h2 className="mb-4 text-2xl font-bold text-green-900">Step 3: Capture Baseline</h2>
            <p className="mb-4 text-green-900">Run locally to create initial snapshots:</p>
            <div className="rounded-lg bg-neutral-900 p-4 font-mono text-sm text-green-400">
              <div>cd web</div>
              <div className="mt-2"># Set token (don't commit!)</div>
              <div>export CHROMATIC_PROJECT_TOKEN=chpt_your_token</div>
              <div className="mt-2"># Run Chromatic</div>
              <div>pnpm chromatic</div>
            </div>
            <p className="mt-4 text-sm text-green-800">
              This uploads all 86+ story screenshots to Chromatic cloud.
            </p>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
            <h2 className="mb-4 text-2xl font-bold text-purple-900">Step 4: Accept Baselines</h2>
            <ol className="space-y-3 text-purple-900">
              <li>1. Open Chromatic URL from terminal output</li>
              <li>2. Review all captured stories</li>
              <li>3. Click <strong>"✓ Accept"</strong> button to approve baselines</li>
              <li>4. These become the reference snapshots for future PRs</li>
            </ol>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <h2 className="mb-4 text-2xl font-bold text-blue-900">Step 5: Test PR Workflow</h2>
            <ol className="space-y-3 text-blue-900">
              <li>1. Create a branch and make a small UI change</li>
              <li>2. Open a pull request to <code>main</code></li>
              <li>3. Wait for Chromatic GitHub Action (2-5 minutes)</li>
              <li>4. Check status: Should show "Changes detected" (yellow)</li>
              <li>5. Click "Details" to review changes in Chromatic UI</li>
              <li>6. Accept or reject changes</li>
            </ol>
          </div>
        </div>

        <div className="rounded-xl bg-neutral-800 p-6 text-white">
          <h2 className="mb-3 text-xl font-bold">📚 Additional Resources</h2>
          <ul className="space-y-2 text-sm">
            <li>• <a href="/docs/CHROMATIC-SETUP.md" className="underline">docs/CHROMATIC-SETUP.md</a> - Full setup guide</li>
            <li>• <a href="/.github/workflows/chromatic.yml" className="underline">.github/workflows/chromatic.yml</a> - GitHub Action config</li>
            <li>• <a href="https://www.chromatic.com/docs" className="underline">Chromatic Docs</a> - Official documentation</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '5-step setup guide for Chromatic. From account creation → GitHub secrets → baseline capture → PR testing.',
      },
    },
  },
};

/**
 * Best Practices
 */
export const BestPractices: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-3xl font-bold text-neutral-900">
            Chromatic Best Practices
          </h1>
          <p className="text-lg text-neutral-600">
            Tips for effective visual regression testing
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
            <h2 className="mb-4 text-xl font-bold text-green-900">✅ Do's</h2>
            <ul className="space-y-3 text-sm text-green-800">
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Review every Chromatic check before merging PR</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Accept changes only if intentional</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Write descriptive commit messages for UI changes</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Test responsive stories at multiple viewports</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Add new stories for new components</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Use <code>chromatic.disableSnapshot: true</code> for non-visual stories</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Keep story data consistent (same products, dates, etc.)</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
            <h2 className="mb-4 text-xl font-bold text-red-900">❌ Don'ts</h2>
            <ul className="space-y-3 text-sm text-red-800">
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Don't auto-accept all changes without review</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Don't commit CHROMATIC_PROJECT_TOKEN to git</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Don't ignore yellow status checks</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Don't use random data in stories (timestamps, UUIDs)</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Don't snapshot stories with animations (use delay parameter)</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Don't merge PRs with unreviewed visual changes</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Don't delete old stories without team discussion</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-accent-200 bg-accent-50 p-6">
          <h2 className="mb-4 text-xl font-bold text-neutral-900">💡 Pro Tips</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4">
              <h3 className="mb-2 font-bold text-neutral-900">Snapshot Delay</h3>
              <p className="mb-2 text-sm text-neutral-700">
                Use <code>delay</code> parameter for animations:
              </p>
              <div className="rounded bg-neutral-100 p-3 font-mono text-xs">
                parameters: &#123;<br />
                &nbsp;&nbsp;chromatic: &#123; delay: 1000 &#125; // Wait 1s<br />
                &#125;
              </div>
            </div>

            <div className="rounded-lg bg-white p-4">
              <h3 className="mb-2 font-bold text-neutral-900">Disable Snapshots</h3>
              <p className="mb-2 text-sm text-neutral-700">
                Skip non-visual stories (docs, tests):
              </p>
              <div className="rounded bg-neutral-100 p-3 font-mono text-xs">
                parameters: &#123;<br />
                &nbsp;&nbsp;chromatic: &#123; disableSnapshot: true &#125;<br />
                &#125;
              </div>
            </div>

            <div className="rounded-lg bg-white p-4">
              <h3 className="mb-2 font-bold text-neutral-900">Run Locally</h3>
              <p className="mb-2 text-sm text-neutral-700">
                Test before pushing:
              </p>
              <div className="rounded bg-neutral-100 p-3 font-mono text-xs">
                pnpm chromatic --only-changed
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-neutral-800 p-6 text-white">
          <h2 className="mb-3 text-xl font-bold">🎯 Success Metrics</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-accent-400">0</div>
              <div className="text-sm text-neutral-300">Unintended regressions shipped</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-accent-400">100%</div>
              <div className="text-sm text-neutral-300">Visual changes reviewed</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-accent-400">86+</div>
              <div className="text-sm text-neutral-300">Components covered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Best practices for Chromatic usage. Do's and don'ts, pro tips, and success metrics for visual regression testing.",
      },
    },
  },
};
