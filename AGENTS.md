# Agents & automation

This repo is a resume site plus tool-agnostic job-fit analysis. No vendor-specific agent config required.

## Job fit analysis

See **[job-fit/README.md](job-fit/README.md)**.

```bash
task job-analyze URL='https://example.com/jobs/123'
# → .job-analysis/prompt.md  (paste into any LLM)
```

Instructions for any agent: `job-fit/workflow.md`

## Resume source

| File | Purpose |
|------|---------|
| `src/content/resume.mdx` | Edit resume here |
| `public/resume.txt` | Plain-text export |
| `public/resume.docx` | Word export |

## Site tasks

```bash
task dev      # local preview
task build    # static site + exports
```
