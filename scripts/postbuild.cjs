// Copy package-lock.json (and ensure package.json exists) into dist/server
// so the remote `npm ci` in the deploy workflow succeeds.

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const distServer = path.join(root, 'dist', 'server');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function copy(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[postbuild] Copied ${path.basename(src)} -> ${dest}`);
  } else {
    console.warn(`[postbuild] Skipped missing ${src}`);
  }
}

(async () => {
  try {
    ensureDir(distServer);

    const lockSrc = path.join(root, 'package-lock.json');
    const lockDest = path.join(distServer, 'package-lock.json');
    copy(lockSrc, lockDest);

    const pkgSrc = path.join(root, 'package.json');
    const pkgDest = path.join(distServer, 'package.json');
    // We still copy it locally; the workflow also copies it, but it's harmless.
    copy(pkgSrc, pkgDest);

    console.log('[postbuild] Completed.');
  } catch (e) {
    console.error('[postbuild] Error:', e);
    process.exitCode = 0; // do not fail build if copy fails
  }
})();
