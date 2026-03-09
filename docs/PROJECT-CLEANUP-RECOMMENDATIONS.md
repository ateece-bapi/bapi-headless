# Project Cleanup & Best Practices Review

**Date:** March 9, 2026  
**Reviewer:** AI Assistant  
**Project:** BAPI Headless E-Commerce Platform

---

## 🚨 Critical Issues (High Priority)

### 1. Build/Test Artifacts Tracked in Git ❌

**Problem:** The following temporary files are tracked in version control but should NOT be:

```bash
build-analyze-output.txt
build-output.txt
e2e-test-results-color-fix.txt
e2e-test-results.txt
import-results.json
lint-output.txt
```

**Impact:** 
- Bloats repository size
- Creates merge conflicts
- Pollutes git history
- Violates best practices

**Recommendation:**
```bash
# Remove from git but keep locally
git rm --cached build-analyze-output.txt build-output.txt e2e-test-results*.txt import-results.json lint-output.txt

# Add to .gitignore
echo "# Build and test output files" >> .gitignore
echo "build-*.txt" >> .gitignore
echo "e2e-test-results*.txt" >> .gitignore
echo "import-results.json" >> .gitignore
echo "lint-output.txt" >> .gitignore
echo "experimental-*.txt" >> .gitignore
echo "*-output.txt" >> .gitignore

# Commit changes
git add .gitignore
git commit -m "chore: remove build artifacts from version control"
```

---

### 2. Large Image Directory (16GB) ⚠️

**Problem:** `web/2026-approved-images/` directory is 16GB

**Current Status:** ✅ Already in .gitignore (not tracked)

**Recommendations:**
1. **Move to CDN/Cloud Storage** (Cloudflare R2, AWS S3, or Vercel Blob)
   - Reduces local disk usage
   - Improves build times
   - Better for team collaboration
   - Easier backup/restore

2. **If keeping locally:**
   - Document in README what this directory contains
   - Add setup instructions for new developers
   - Consider compressing images further
   - Use next/image optimization

3. **Alternative:** Use external image service
   - Cloudinary, Imgix, or similar
   - Automatic optimization
   - Global CDN delivery

---

### 3. Documentation Files at Wrong Level 📄

**Problem:** Documentation files scattered between root and `web/` directory:

**Root Level:**
```
/CODING_STANDARDS.md (19KB)
/COLOR_IMPLEMENTATION_SUMMARY.md (3.9KB)
/COLOR_SYSTEM.md (18KB)
/COMPONENT_PATTERNS.md (7.8KB)
/ERROR_HANDLING.md (8.2KB)
/ERROR_STATES_SUMMARY.md (7.1KB)
/PREVIEW.md (1.8KB)
/TAILWIND_GUIDELINES.md (16KB)
/TAILWIND_MODERNIZATION.md (13KB)
```

**Also exists in:**
```
/web/CODING_STANDARDS.md
/web/COLOR_SYSTEM.md
/web/ERROR_HANDLING.md
/web/PREVIEW.md
/web/TAILWIND_GUIDELINES.md
```

**Recommendation:**
```bash
# Option 1: Consolidate in docs/ (RECOMMENDED)
mv *.md docs/ 2>/dev/null || true
mv web/*.md docs/ 2>/dev/null || true
# Keep README.md at root

# Option 2: Keep web-specific docs in web/
# Keep project-wide docs in docs/
# Remove duplicates
```

---

### 4. Brand Assets Location 🎨

**Problem:** Large PDF at root level:
- `2026 BAPI Brand Guide (1).pdf` (3.1MB) at root
- `2026 BAPI Brand Guide (1).pdf` (3.8MB) in web/

**Recommendation:**
```bash
# Move to docs or remove from git entirely
mv "2026 BAPI Brand Guide (1).pdf" docs/brand-guidelines.pdf
# OR
git rm "2026 BAPI Brand Guide (1).pdf"
echo "*.pdf" >> .gitignore
# Store brand assets in shared drive/wiki instead
```

---

## ⚠️ Medium Priority Issues

### 5. Unused Locale Directories 🌐

**Problem:** Empty/unused locale directories at root:
```
/ar/ (100K)
/de/ (100K)
/es-ES/ (100K)
/fr/ (100K)
/ja/ (100K)
/th/ (100K)
/vi/ (100K)
/zh-CN/ (100K)
```

Each contains only a `web/` subdirectory with unknown contents.

**Recommendation:**
```bash
# If unused, delete:
rm -rf ar/ de/ es-ES/ fr/ ja/ th/ vi/ zh-CN/

# If needed, document their purpose in README
```

---

### 6. Utility Scripts at Wrong Location 🔧

**Problem:** Development scripts at root level:
```
/checkPartNumber.ts
/test-2fa-routes.sh
/test-chat-handoff.mjs
```

**Recommendation:**
```bash
# Move to scripts/ directory
mv checkPartNumber.ts scripts/utils/
mv test-2fa-routes.sh scripts/testing/
mv test-chat-handoff.mjs scripts/testing/

# Update any imports/references
```

---

### 7. Build Artifacts Not Ignored 📦

**Problem:** Log files and temporary artifacts at root:
```
build-storybook.log
debug-storybook.log
check-404s-results.txt
schema.json (3.7MB)
tsconfig.tsbuildinfo (3.6MB)
wordpress-users.json (920KB) - might contain PII
```

**Current Status:** 
- `check-404s-results.txt` is in web/.gitignore ✅
- Others are not explicitly ignored

**Recommendation:**
```bash
# Add to .gitignore
echo "*.log" >> .gitignore  # Already there, but ensure it works
echo "*.tsbuildinfo" >> .gitignore
echo "schema.json" >> .gitignore
echo "wordpress-users.json" >> .gitignore  # Sensitive data

# Remove if accidentally tracked
git rm --cached -r *.log schema.json tsconfig.tsbuildinfo wordpress-users.json 2>/dev/null || true
```

---

### 8. Large .git Directory (927MB) 💾

**Problem:** Git repository is quite large

**Potential Causes:**
- Large files committed in history
- Many branches/tags
- Lack of git gc

**Investigation:**
```bash
# Find largest files in git history
git rev-list --objects --all \
  | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' \
  | sed -n 's/^blob //p' \
  | sort --numeric-sort --key=2 --reverse \
  | head -20
```

**Recommendations:**
1. Run `git gc --aggressive --prune=now` to optimize
2. Consider using Git LFS for large assets
3. Use BFG Repo-Cleaner to remove large files from history (if needed)

---

## ✅ Good Practices Already In Place

### Security ✅
- ✅ `.env` files properly ignored
- ✅ `cookies.txt` in .gitignore
- ✅ No exposed API keys found
- ✅ Proper .gitignore structure

### Dependencies ✅
- ✅ Using PNPM for faster installs
- ✅ node_modules properly ignored
- ✅ Build artifacts (.next) ignored

### Structure ✅
- ✅ Clear separation of concerns (web, cms, docs)
- ✅ Test directories properly ignored
- ✅ Coverage directory ignored

---

## 📋 Recommended Actions (Priority Order)

### Immediate (Do Today) 🔴
1. **Remove tracked build artifacts from git**
   ```bash
   git rm --cached build-*.txt e2e-test-results*.txt import-results.json lint-output.txt
   ```

2. **Update .gitignore to prevent future artifacts**
   ```bash
   echo "*-output.txt" >> .gitignore
   echo "experimental-*.txt" >> .gitignore
   ```

3. **Consolidate documentation files**
   - Move all .md files to appropriate locations
   - Remove duplicates

### This Week 🟡
4. **Review and clean locale directories**
   - Delete if unused
   - Document if needed

5. **Review wordpress-users.json for PII**
   - Remove if it contains real user data
   - Add to .gitignore

6. **Organize utility scripts**
   - Move to scripts/ directory
   - Update references

### This Month 🟢
7. **Consider CDN/cloud storage for images**
   - Evaluate Cloudflare R2, AWS S3, or Vercel Blob
   - Implement migration plan

8. **Optimize git repository**
   - Run git gc
   - Clean up old branches
   - Consider Git LFS for future large files

9. **Document setup process**
   - Add note about 2026-approved-images/
   - Document any special setup requirements
   - Update README with project structure

---

## 📊 Disk Space Summary

| Directory | Size | Status | Action Needed |
|-----------|------|--------|---------------|
| web/ | 20GB | ⚠️ Large | Review images, optimize node_modules |
| cms/ | 4.7GB | ✅ OK | WordPress files (expected) |
| .git/ | 927MB | ⚠️ Large | Optimize with gc, consider Git LFS |
| web/2026-approved-images/ | 16GB | ⚠️ Very Large | Move to CDN/cloud storage |
| web/.next/ | 2.1GB | ✅ OK | Build artifacts (ignored) |
| web/node_modules/ | 1.4GB | ✅ OK | Dependencies (ignored) |

---

## 🎯 Expected Benefits After Cleanup

1. **Reduced Repository Size:** Removal of artifacts could save 10-20MB in .git history
2. **Fewer Merge Conflicts:** No more conflicts in build output files
3. **Better Organization:** Clear file structure easier for new developers
4. **Faster Clones:** Smaller repository means faster git operations
5. **Professional Standards:** Aligns with industry best practices

---

## 🚀 Next Steps

1. Review this document with team
2. Prioritize actions based on impact
3. Execute immediate actions
4. Schedule weekly cleanup tasks
5. Update team documentation

**Note:** Before making major changes (especially removing files from git history), ensure you have a backup and coordinate with the team.
