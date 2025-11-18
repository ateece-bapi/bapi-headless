const fs = require('fs');
const path = require('path');

// CommonJS __dirname is available in this file (CI Node runs this as CJS).
const repoRoot = path.resolve(__dirname, '..');
const previewRoute = path.join(repoRoot, 'src', 'app', 'api', 'preview', 'route.js');
const proxyRoute = path.join(repoRoot, 'src', 'app', 'api', 'preview-proxy', 'route.js');

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) return { ok: false, reason: `Missing file: ${filePath}` };
  const src = fs.readFileSync(filePath, 'utf8');
  const hasEnv = /process\.env\.PREVIEW_SECRET/.test(src);
  const hasHeaderCheck = /x-preview-secret/.test(src);
  const hasSafeCompare = /timingSafeEqual|safeCompare/.test(src);
  return { ok: hasEnv && hasHeaderCheck && hasSafeCompare, details: { hasEnv, hasHeaderCheck, hasSafeCompare } };
}

const results = [];
results.push({ file: previewRoute, ...checkFile(previewRoute) });
results.push({ file: proxyRoute, ...checkFile(proxyRoute) });

let failed = 0;
for (const r of results) {
  if (r.ok) {
    console.log(`OK: ${path.relative(process.cwd(), r.file)}`);
  } else {
    failed++;
    console.error(`FAIL: ${path.relative(process.cwd(), r.file)} ->`, r.reason || r.details);
  }
}

if (failed) {
  console.error(`Sanity checks failed (${failed})`);
  process.exit(2);
}

console.log('Sanity checks passed.');
process.exit(0);
