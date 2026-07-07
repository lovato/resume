# Job fit analysis

Tool-agnostic workflow to compare a job posting against the resume in this repo.

Works with any LLM (ChatGPT, Claude, Gemini, local models), any coding agent, or a human following the checklist.

## Quick start

```bash
# 1. Fetch a posting (or paste text into .job-analysis/current-posting.txt yourself)
task job-analyze URL='https://www.linkedin.com/jobs/view/...'

# 2. Open the bundled prompt and send it to your LLM
cat .job-analysis/prompt.md   # or open in editor, copy all
```

The bundled file contains instructions, the report template, your resume, and the job posting — ready to paste.

## Tasks

| Task | What it does |
|------|----------------|
| `task job-fetch URL='...'` | Fetch URL → `.job-analysis/current-posting.txt` |
| `task job-analyze URL='...'` | Fetch (if URL) + export resume + write `.job-analysis/prompt.md` |
| `task job-analyze` | Re-bundle using existing `.job-analysis/current-posting.txt` |

### Pasted job description (no URL)

```bash
# Paste the JD into this file, then:
task job-analyze
```

## With a coding agent

Point any agent at this repo and say:

> Read `job-fit/workflow.md`, read `.job-analysis/current-posting.txt` and `src/content/resume.mdx`, then produce a fit report using `job-fit/report-template.md`.

Or run `task job-analyze URL='...'` first and ask it to analyze `.job-analysis/prompt.md`.

## Files

```
job-fit/
  README.md           ← you are here
  workflow.md         ← step-by-step instructions for any agent
  report-template.md  ← output format
.job-analysis/        ← generated (gitignored)
  current-posting.txt
  prompt.md           ← all-in-one paste bundle
```

## LinkedIn note

LinkedIn often blocks automated fetch. If `job-fetch` warns about a login wall, paste the job description into `.job-analysis/current-posting.txt` and run `task job-analyze`.
