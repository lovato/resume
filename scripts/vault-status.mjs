#!/usr/bin/env node
/**
 * Show vault state.
 * Usage: task vault-status
 */
import {
  ensureGitCrypt,
  isInitialized,
  isProfileDecrypted,
  isProfileEncrypted,
  keyPath,
  profilePath,
  runCapture,
} from './vault-lib.mjs';
import { existsSync } from 'node:fs';

ensureGitCrypt();

console.log('Vault status');
console.log('============');
console.log(`Initialized:  ${isInitialized() ? 'yes' : 'no'}`);
console.log(`Key file:     ${keyPath} (${existsSync(keyPath) ? 'present' : 'missing'})`);
console.log(`Profile file: ${profilePath} (${existsSync(profilePath) ? 'present' : 'missing'})`);

if (existsSync(profilePath)) {
  if (isProfileEncrypted()) {
    console.log('Profile state: encrypted (locked in working tree)');
  } else if (isProfileDecrypted()) {
    console.log('Profile state: decrypted (unlocked in working tree)');
  }
}

if (isInitialized()) {
  try {
    console.log('');
    console.log('Encrypted files (git crypt status):');
    const status = runCapture('git crypt status -e 2>/dev/null || git crypt status');
    console.log(status || '  (none)');
  } catch {
    // ignore
  }
}

if (!isInitialized()) {
  console.log('');
  console.log('Run: task vault-init');
}
