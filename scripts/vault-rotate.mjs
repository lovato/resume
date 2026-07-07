#!/usr/bin/env node
/**
 * Rotate vault key — new key file, keep profile content.
 * Requires: vault unlocked, old key at VAULT_KEY_PATH
 * Usage: task vault-rotate
 */
import { copyFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import {
  ensureGitCrypt,
  exportKey,
  isInitialized,
  isProfileDecrypted,
  keyPath,
  printKeyReminder,
  profilePath,
  run,
  unlock,
} from './vault-lib.mjs';

ensureGitCrypt();

if (!isInitialized()) {
  console.error('Vault not initialized. Run: task vault-init');
  process.exit(1);
}

// Unlock if profile is encrypted in working tree
if (!isProfileDecrypted() && existsSync(profilePath)) {
  console.log('Unlocking with current key...');
  unlock();
}

let profileBackup = null;
if (existsSync(profilePath)) {
  profileBackup = readFileSync(profilePath, 'utf8');
  console.log('Backed up career profile to memory.');
}

const backupKeyPath = `${keyPath}.bak`;
if (existsSync(keyPath)) {
  copyFileSync(keyPath, backupKeyPath);
  console.log(`Old key copied to ${backupKeyPath} — delete when rotation is verified.`);
}

console.log('Re-initializing git-crypt with a new key...');
run('git crypt deinit -f');
run('git crypt init');

if (profileBackup) {
  writeFileSync(profilePath, profileBackup, 'utf8');
  console.log('Restored career profile.');
}

exportKey();

console.log('');
console.log('Key rotated. New key exported.');
printKeyReminder();
console.log('');
console.log('Commit the re-encrypted profile:');
console.log('  git add private/career-profile.yaml');
console.log('  git commit -m "Rotate vault key"');
console.log('  git push');
console.log('');
console.log('On other machines: replace key file, then task vault-unlock');
