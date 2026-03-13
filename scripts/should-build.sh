#!/bin/bash
# Vercel Ignored Build Step Script
# Returns exit code 0 to skip build, exit code 1 to proceed with build
#
# Usage: Add to Vercel Dashboard → Settings → Git → Ignored Build Step
# Command: bash scripts/should-build.sh
#
# This script optimizes Vercel build costs by skipping unnecessary builds for:
# - Documentation-only changes (docs/, *.md files)
# - Test-only changes (*.test.ts, *.spec.ts)
# - CI/CD configuration changes (.github/)
# - Storybook stories (when not affecting production)
# - GitHub Actions workflows

set -e

echo "🔍 Checking if build is necessary..."

# Get the commit message
COMMIT_MSG=$(git log -1 --pretty=%B)

# Check for explicit skip tags in commit message
if [[ "$COMMIT_MSG" == *"[skip ci]"* ]] || \
   [[ "$COMMIT_MSG" == *"[ci skip]"* ]] || \
   [[ "$COMMIT_MSG" == *"[vercel skip]"* ]]; then
  echo "⏭️  Skipping build: [skip ci] tag found in commit message"
  exit 0
fi

# Get the list of changed files between HEAD and previous commit
CHANGED_FILES=$(git diff --name-only HEAD^ HEAD 2>/dev/null || echo "")

# If no files changed (shouldn't happen, but safety check)
if [ -z "$CHANGED_FILES" ]; then
  echo "⚠️  No files changed, skipping build"
  exit 0
fi

# Files/directories that don't require a build
# NOTE: scripts/ intentionally NOT in this list - verification scripts can accompany production changes
IGNORE_PATTERNS=(
  "^docs/"
  "\.md$"
  "^\.github/"
  "^test/"
  "\.test\.ts$"
  "\.test\.tsx$"
  "\.spec\.ts$"
  "\.spec\.tsx$"
  "^README"
  "^LICENSE"
  "^\.vscode/"
  "^\.idea/"
  "^\.editorconfig$"
  "^\.gitignore$"
  "^\.eslintignore$"
  "^\.prettierignore$"
)

# Check if ALL changed files match ignore patterns
BUILD_REQUIRED=false
while IFS= read -r file; do
  SHOULD_IGNORE=false
  
  for pattern in "${IGNORE_PATTERNS[@]}"; do
    if echo "$file" | grep -qE "$pattern"; then
      SHOULD_IGNORE=true
      break
    fi
  done
  
  if [ "$SHOULD_IGNORE" = false ]; then
    BUILD_REQUIRED=true
    echo "📦 Build required: $file"
    break
  fi
done <<< "$CHANGED_FILES"

if [ "$BUILD_REQUIRED" = false ]; then
  echo "⏭️  Skipping build: Only non-production files changed"
  echo ""
  echo "Changed files:"
  echo "$CHANGED_FILES" | sed 's/^/  - /'
  exit 0
fi

# Build is required
echo "✅ Build required: Production code changes detected"
exit 1
