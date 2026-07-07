# Private career profile (git-crypt)

**Public resume** = what recruiters and the internet see.  
**Private profile** = preferences, hidden skills, dealbreakers — encrypted before GitHub.

⚠️ **`profile.template.yaml` is public on GitHub** — placeholders only, never your real data.  
Your real profile goes in **`career-profile.yaml`** (encrypted after `task vault-init`).

CI and the static site **never** read this. Only you (with the key) and local agents do.

## Tasks (you don't need git-crypt syntax)

| Task | When |
|------|------|
| `task vault-init` | First time — create vault + key file |
| `task vault-unlock` | New machine, or after clone |
| `task vault-lock` | Encrypt files in working tree when done editing |
| `task vault-status` | What's initialized / locked |
| `task vault-rotate` | New key, **keep** profile (need old key) |
| `FORCE=1 task vault-reset` | Lost key — start over (profile on GitHub is lost) |

Default key path: `~/.config/resume/git-crypt.key` (gitignored, back it up).

Override: `VAULT_KEY_PATH=/path/to/key task vault-unlock`

## First-time setup

```bash
sudo apt install git-crypt    # once per machine

task vault-init             # also installs pre-commit safety hook
# Edit private/career-profile.yaml (or run profile interview)
git add private/career-profile.yaml
git commit -m "Add encrypted career profile"
git push
```

**Important:** Never `git add private/career-profile.yaml` before `task vault-init`.  
The pre-commit hook blocks plaintext commits. `profile.template.yaml` is public (placeholders only).

## New machine

```bash
# Restore git-crypt.key from backup to ~/.config/resume/
task vault-unlock
task vault-status
```

## Profile interview

Ask an agent to use `job-fit/interview-questions.md` and update `private/career-profile.yaml`.

## Job analysis

```bash
task vault-unlock          # if locked
task job-analyze URL='...' # includes profile when unlocked
```

## Security

- Never commit the key file (`*.git-crypt-key`, `~/.config/resume/`).
- Don't paste profile into public issues.
- **Rotate** = new key, same data (`task vault-rotate`).
- **Reset** = new vault + empty template (`FORCE=1 task vault-reset`) — old encrypted blob on GitHub is unrecoverable without the old key.

## Note on "password"

git-crypt uses a **key file**, not a passphrase. Treat `git-crypt.key` like a password: store in a password manager or encrypted backup. `vault-rotate` issues a new key file.
