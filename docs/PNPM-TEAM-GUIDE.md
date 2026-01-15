# PNPM Migration - Team Onboarding Guide

## 🚀 Quick Start (5 minutes)

We've migrated from NPM to PNPM for **5.6x faster installs** and better dependency management.

### 1. Install PNPM Globally

**Choose one:**

```bash
# Via NPM (recommended)
npm install -g pnpm

# Via standalone script
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Via Homebrew (macOS)
brew install pnpm
```

Verify installation:
```bash
pnpm --version
# Should show: 10.x.x
```

### 2. Clone/Update Repository

```bash
# New clone
git clone https://github.com/ateece-bapi/bapi-headless.git
cd bapi-headless/web

# Existing clone
git pull
cd web
rm -rf node_modules package-lock.json  # Clean old NPM files
```

### 3. Install Dependencies

```bash
pnpm install
```

**First install**: Takes ~12s (downloads to global store)  
**Subsequent installs**: Takes ~2.3s (links from global store)

### 4. Start Developing

```bash
pnpm run dev
# or just
pnpm dev
```

## 📝 Command Reference

| What You Did Before | What You Do Now |
|---------------------|-----------------|
| `npm install` | `pnpm install` |
| `npm ci` | `pnpm install --frozen-lockfile` |
| `npm run dev` | `pnpm dev` or `pnpm run dev` |
| `npm run build` | `pnpm build` |
| `npm test` | `pnpm test` |
| `npm install <pkg>` | `pnpm add <pkg>` ⚠️ |
| `npm install -D <pkg>` | `pnpm add -D <pkg>` ⚠️ |
| `npm uninstall <pkg>` | `pnpm remove <pkg>` |

**⚠️ Key Difference**: Use `pnpm add` instead of `npm install` when adding packages.

## 🎯 Common Tasks

### Adding a New Package

```bash
# Production dependency
pnpm add package-name

# Dev dependency
pnpm add -D package-name

# Specific version
pnpm add package-name@1.2.3
```

### Updating Packages

```bash
# Update one package
pnpm update package-name

# Update all packages (respecting semver)
pnpm update

# Check for outdated packages
pnpm outdated
```

### Removing Packages

```bash
pnpm remove package-name
```

### Running Scripts

```bash
# Same as before - all scripts work
pnpm dev
pnpm build
pnpm test
pnpm run codegen
pnpm run lint
```

## 🐛 Troubleshooting

### "pnpm: command not found"

**Solution**: Install PNPM globally (see step 1 above)

### Cache Issues

```bash
# Clear PNPM cache
pnpm store prune

# Remove node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Permission Errors

```bash
# macOS/Linux: Use sudo for global install
sudo npm install -g pnpm
```

## 💡 What Changed?

### Files
- ✅ Added: `pnpm-lock.yaml` (commit this)
- ❌ Removed: `package-lock.json`
- ℹ️ Unchanged: `package.json` (all scripts work as before)

### CI/CD
- GitHub Actions now uses PNPM
- Vercel auto-detects PNPM (no config needed)
- CI runs are faster (better caching)

### Your Machine
- Global PNPM store at `~/.local/share/pnpm/store` (Linux/macOS)
- Disk space savings: shared dependencies across projects
- Each project's `node_modules` uses hard links (super fast)

## 🎓 Key Concepts

### Global Store
PNPM stores all packages in one global location and creates hard links in your project. Multiple projects using the same package version share the same files.

### Strict Dependencies
PNPM's `node_modules` structure prevents "phantom dependencies" (using packages not in `package.json`). This catches bugs earlier.

### Symlinks
Your `node_modules` uses symlinks to the global store. Don't be alarmed by the structure - it's intentional and faster.

## ❓ FAQ

**Q: Do I need to change my scripts in `package.json`?**  
A: No, they all work as-is.

**Q: What about Vercel deployments?**  
A: Vercel auto-detects PNPM from `pnpm-lock.yaml`. No config needed.

**Q: Can I still use `npm run <script>`?**  
A: Yes, but `pnpm <script>` is shorter and recommended.

**Q: What if I forget and use `npm install`?**  
A: It will create a `package-lock.json`. Just delete it and run `pnpm install` instead.

**Q: Is PNPM slower than NPM?**  
A: No! It's **5.6x faster** (13s → 2.3s for this project).

**Q: Do I need to learn new commands?**  
A: Only one: `pnpm add` instead of `npm install` for adding packages. Everything else is the same or simpler.

## 📚 Additional Resources

- [PNPM Official Docs](https://pnpm.io/)
- [PNPM vs NPM Benchmark](https://pnpm.io/benchmarks)
- [PNPM CLI Reference](https://pnpm.io/cli/add)
- [Migration Analysis](./PNPM-MIGRATION.md) - Full technical details

## ✅ You're Ready!

That's it! You're now set up with PNPM. Just remember:

1. ✅ Use `pnpm` instead of `npm` in commands
2. ✅ Use `pnpm add` when installing new packages
3. ✅ Everything else works exactly the same

Happy coding! 🚀
