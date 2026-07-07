#!/usr/bin/env node
/**
 * Reset vault from scratch — use when key is lost or starting over.
 * WARNING: After push, old encrypted profile on GitHub cannot be recovered without old key.
 * Usage: FORCE=1 task vault-reset
 */
import { existsSync, unlinkSync } from 'node:fs';
import {
  ensureGitCrypt,
  exportKey,
  isInitialized,
  printKeyReminder,
  profilePath,
  run,
  seedProfileFromTemplate,
} from './vault-lib.mjs';

if (process.env.FORCE !== '1') {
  console.error('This destroys the current vault and creates a fresh profile from template.');
  console.error('You cannot recover an encrypted profile without the old key.');
  console.error('');
  console.error('Run:  FORCE=1 task vault-reset');
  process.exit(1);
}

ensureGitCrypt();

if (isInitialized()) {
  console.log('Removing existing vault...');
  try {
    run('git crypt unlock 2>/dev/null || true');
  } catch {
    // may fail without key — deinit -f still works if repo state allows
  }
  run('git crypt deinit -f');
}

if (existsSync(profilePath)) {
  unlinkSync(profilePath);
  console.log('Removed private/career-profile.yaml');
}

console.log('Initializing fresh vault...');
run('git crypt init');
exportKey();
seedProfileFromTemplate();

console.log('');
console.log('Vault reset complete.');
printKeyReminder();
console.log('');
console.log('Next: edit private/career-profile.yaml, commit, push.');
