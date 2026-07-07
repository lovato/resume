#!/usr/bin/env node
/**
 * Initialize git-crypt vault and export local key.
 * Usage: task vault-init
 */
import {
  ensureGitCrypt,
  exportKey,
  isInitialized,
  printKeyReminder,
  run,
  seedProfileFromTemplate,
} from './vault-lib.mjs';

ensureGitCrypt();

if (isInitialized()) {
  console.error('Vault is already initialized.');
  console.error('  task vault-status   — check state');
  console.error('  task vault-rotate   — new key, keep profile');
  console.error('  task vault-reset    — start over (destroys encrypted profile on remote after push)');
  process.exit(1);
}

console.log('Initializing git-crypt vault...');
run('git crypt init');
exportKey();
seedProfileFromTemplate();

console.log('');
console.log('Vault initialized.');
printKeyReminder();
console.log('');
console.log('Next steps:');
console.log('  1. Edit private/career-profile.yaml (or run a profile interview)');
console.log('  2. git add private/career-profile.yaml .gitattributes');
console.log('  3. git commit -m "Add encrypted career profile"');
console.log('  4. task vault-lock   — optional, encrypt files in working tree');
