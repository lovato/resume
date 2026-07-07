import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const keyPath = process.env.VAULT_KEY_PATH || join(homedir(), '.config/resume/git-crypt.key');
export const profilePath = join(root, 'private/career-profile.yaml');
export const templatePath = join(root, 'private/profile.template.yaml');
export const gitCryptDir = join(root, '.git-crypt');

export function run(cmd, opts = {}) {
  execSync(cmd, { cwd: root, stdio: 'inherit', ...opts });
}

export function runCapture(cmd) {
  return execSync(cmd, { cwd: root, encoding: 'utf8' }).trim();
}

export function ensureGitCrypt() {
  try {
    runCapture('git crypt status -e');
  } catch {
    console.error('git-crypt is not installed.');
    console.error('  Debian/Ubuntu: sudo apt install git-crypt');
    console.error('  macOS:         brew install git-crypt');
    process.exit(1);
  }
}

export function isInitialized() {
  return existsSync(gitCryptDir);
}

export function isProfileEncrypted() {
  if (!existsSync(profilePath)) return false;
  return readFileSync(profilePath).slice(0, 8).toString() === 'GITCRYPT';
}

export function isProfileDecrypted() {
  return existsSync(profilePath) && !isProfileEncrypted();
}

export function ensureKeyDir() {
  mkdirSync(dirname(keyPath), { recursive: true });
}

export function exportKey() {
  ensureKeyDir();
  run(`git crypt export-key "${keyPath}"`);
  chmodSync(keyPath, 0o600);
}

export function unlock() {
  if (!existsSync(keyPath)) {
    console.error(`Key not found: ${keyPath}`);
    console.error('Set VAULT_KEY_PATH or restore your backup key.');
    process.exit(1);
  }
  run(`git crypt unlock "${keyPath}"`);
}

export function seedProfileFromTemplate() {
  if (!existsSync(profilePath) && existsSync(templatePath)) {
    copyFileSync(templatePath, profilePath);
    console.log(`Created ${profilePath} from template.`);
  }
}

export function printKeyReminder() {
  console.log('');
  console.log(`Vault key: ${keyPath}`);
  console.log('Back this file up somewhere safe (password manager, encrypted backup).');
  console.log('It is gitignored and never pushed to GitHub.');
}
