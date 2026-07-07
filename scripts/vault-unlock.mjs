#!/usr/bin/env node
/**
 * Unlock vault with local key file.
 * Usage: task vault-unlock
 */
import { ensureGitCrypt, isInitialized, printKeyReminder, unlock } from './vault-lib.mjs';

ensureGitCrypt();

if (!isInitialized()) {
  console.error('Vault not initialized. Run: task vault-init');
  process.exit(1);
}

unlock();
console.log('Vault unlocked. private/career-profile.yaml is readable if it exists.');
printKeyReminder();
