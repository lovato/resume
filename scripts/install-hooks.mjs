#!/usr/bin/env node
/**
 * Install git hooks that guard against committing unencrypted private profile.
 */
import { chmodSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from './vault-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const hook = join(root, '.githooks/pre-commit');

if (!existsSync(hook)) {
  console.error('Missing .githooks/pre-commit');
  process.exit(1);
}

chmodSync(hook, 0o755);
run('git config core.hooksPath .githooks');
console.log('Installed git hooks → .githooks/');
console.log('Pre-commit will block unencrypted private/career-profile.yaml');
