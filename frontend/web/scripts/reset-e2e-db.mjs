/**
 * Cross-platform script to safely reset the E2E database.
 *
 * Rules:
 * - Only deletes files named exactly e2e.db, e2e.db-shm, e2e.db-wal
 * - Validates the resolved path is inside the backend/ directory
 * - Never touches commerce.db or test.db
 * - Exits with error if safety checks fail
 */
import { existsSync, unlinkSync, realpathSync } from 'node:fs';
import { resolve, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = resolve(__dirname, '..', '..', '..', 'backend');
const ALLOWED_FILES = ['e2e.db', 'e2e.db-shm', 'e2e.db-wal'];

function assertInsideBackendDir(filePath) {
  let resolvedBackend;
  try {
    resolvedBackend = realpathSync(BACKEND_DIR);
  } catch {
    resolvedBackend = resolve(BACKEND_DIR);
  }

  let resolvedFile;
  try {
    resolvedFile = realpathSync(filePath);
  } catch {
    resolvedFile = resolve(filePath);
  }

  const resolvedParent = dirname(resolvedFile);

  if (resolvedParent !== resolvedBackend) {
    throw new Error(
      `Safety check failed: file parent "${resolvedParent}" is not the backend directory "${resolvedBackend}"`
    );
  }

  const name = basename(resolvedFile);
  if (!ALLOWED_FILES.includes(name)) {
    throw new Error(
      `Safety check failed: "${name}" is not in the allowed file list [${ALLOWED_FILES.join(', ')}]`
    );
  }
}

let deleted = 0;
let skipped = 0;

for (const fileName of ALLOWED_FILES) {
  const filePath = resolve(BACKEND_DIR, fileName);

  try {
    assertInsideBackendDir(filePath);
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }

  if (existsSync(filePath)) {
    try {
      unlinkSync(filePath);
      console.log(`✓ Deleted: ${filePath}`);
      deleted++;
    } catch (err) {
      console.error(`❌ Failed to delete ${filePath}: ${err.message}`);
      process.exit(1);
    }
  } else {
    skipped++;
  }
}

console.log(`\nE2E database reset complete. Deleted: ${deleted}, Already absent: ${skipped}`);
