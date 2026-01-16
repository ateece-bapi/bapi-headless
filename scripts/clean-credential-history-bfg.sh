#!/bin/bash
#
# Git History Credential Cleanup Script (BFG Method - RECOMMENDED)
# 
# This script uses BFG Repo-Cleaner for fast, safe git history rewriting.
# The exposed password was: vKCBU6YCLacPFSkQ0VI5tqT
# 
# ⚠️  WARNING: This rewrites git history. All collaborators must re-clone.
# 
# Prerequisites: Install BFG Repo-Cleaner
#   Ubuntu/Debian: sudo apt install bfg
#   macOS: brew install bfg
#   Manual: https://rtyley.github.io/bfg-repo-cleaner/
#
# Usage: ./scripts/clean-credential-history-bfg.sh
#

set -e

echo "🔒 Git History Credential Cleanup (BFG Method)"
echo "==============================================="
echo ""

# Check if BFG is installed
if ! command -v bfg &> /dev/null; then
    echo "❌ BFG Repo-Cleaner is not installed"
    echo ""
    echo "Install with:"
    echo "  Ubuntu/Debian: sudo apt install bfg"
    echo "  macOS: brew install bfg"
    echo "  Manual: https://rtyley.github.io/bfg-repo-cleaner/"
    echo ""
    echo "Alternative: Use clean-credential-history.sh (slower but built-in)"
    exit 1
fi

echo "⚠️  WARNING: This will rewrite git history!"
echo "   - All collaborators must re-clone the repository"
echo "   - Open pull requests will need to be recreated"
echo "   - Backup recommended before proceeding"
echo ""
read -p "Continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Aborted."
    exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo ""
echo "📋 Step 1: Creating backup..."
BACKUP_DIR="$HOME/bapi-headless-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
git bundle create "$BACKUP_DIR/repo-backup.bundle" --all
echo "✅ Backup created: $BACKUP_DIR/repo-backup.bundle"

echo ""
echo "📝 Step 2: Creating password replacement file..."
cat > "$BACKUP_DIR/passwords.txt" << EOF
vKCBU6YCLacPFSCkQ0VI5tqT
EOF

echo ""
echo "🧹 Step 3: Running BFG to replace passwords..."
bfg --replace-text "$BACKUP_DIR/passwords.txt" --no-blob-protection

echo ""
echo "🗑️  Step 4: Cleaning up refs and garbage collection..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Verify the cleanup:"
echo "      git log --all --full-history -S 'vKCBU6YCLacPFSCkQ0VI5tqT' -- docs/DAILY-LOG.md"
echo "      (should return no results)"
echo ""
echo "   2. Review changes:"
echo "      git log --all --oneline | head -20"
echo ""
echo "   3. Rotate the WordPress API password:"
echo "      SSH into Kinsta or use WordPress admin"
echo "      Revoke old application password"
echo "      Create new application password"
echo "      Update .env.local and Vercel secrets"
echo ""
echo "   4. Force push to remote (⚠️  destructive!):"
echo "      git push origin --force --all"
echo "      git push origin --force --tags"
echo ""
echo "   5. Notify all team members to re-clone"
echo ""
echo "🔒 Backup and password file: $BACKUP_DIR"
