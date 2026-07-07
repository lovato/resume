# resume

Edit one MDX file. Preview locally. GitHub Actions ships it to Pages.

```
src/content/resume.mdx  →  Astro  →  https://lovato.github.io/resume/
```

## Commands

Requires [Node 22+](https://nodejs.org) and [go-task](https://taskfile.dev).

```bash
task install   # npm ci
task dev       # hot reload
task build     # dist/
task preview   # serve dist/
task check     # astro check
```

Dev URL: **http://localhost:4321/resume/**

## Your resume

Open **`src/content/resume.mdx`**.

- **YAML frontmatter** — name, title, email, phone, LinkedIn, location
- **`<Entry>`** — role, company, dates on separate lines (ATS-friendly)
- **`<Section>`** — standard headings: Professional Summary, Work Experience, etc.
- **Markdown bullets** — skills and accomplishments

Also tweak **`src/site.ts`** for page meta defaults.

### ATS-friendly output

The HTML uses a single-column layout, standard section titles, and separates **job title / company / dates** on distinct lines — the pattern most parsers expect. For job applications:

- **Print / PDF** — use the site button; print CSS switches to Arial and strips chrome
- **Plain text** — download `resume.txt` (regenerated on every build) for paste into ATS forms

## Deploy

1. Push to `main` on GitHub.
2. Repo **Settings → Pages → Build and deployment → Source:** GitHub Actions.
3. Done — workflow builds on every push.

For a user/org site at `username.github.io` (no `/resume` path), change `base` in `astro.config.mjs` and the `site.url` in `src/site.ts`.

## Layout

```
src/
  content/resume.mdx      # ← your resume
  components/           # Entry, Contact (used from MDX)
  layouts/Resume.astro    # HTML shell, fonts, print
  pages/index.astro       # glue
  site.ts                 # meta / canonical URL
Taskfile.yaml
.github/workflows/deploy.yml
```

Print/PDF: click **Print / PDF** or `Ctrl+P`. Print styles drop the toolbar and format links for paper.
