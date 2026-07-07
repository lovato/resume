# Job fit analysis workflow

Evaluate whether the candidate is a fit for a specific role. Read the job posting and the resume from this repository, then report from **three lenses**: ATS parser, recruiter screen, hiring consultant.

## Inputs

| Input | Location |
|-------|----------|
| Job posting | `.job-analysis/current-posting.txt` or user-provided text |
| Resume (canonical) | `src/content/resume.mdx` |
| Resume (plain) | `public/resume.txt` |
| Private profile (optional) | `private/career-profile.yaml` — encrypted; preferences, hidden skills, dealbreakers |

Do **not** invent job requirements not present in the posting. Treat the resume as ground truth for **public** qualifications. Use the private profile for **personal fit** (remote preference, unstated skills, dealbreakers, compensation, motivation).

If `private/career-profile.yaml` is missing or git-crypt locked, say so and analyze from the resume only.

## Steps

### 1. Understand the role

Extract from the posting:

- Title, company, location/remote
- Seniority level
- Must-have vs nice-to-have skills
- Years of experience required
- Domain (IoT, video, fintech, etc.)
- Hard filters: clearance, visa, on-site, travel

### 2. Analyze from three roles

**ATS (applicant tracking system)**

- Keyword overlap: required skills vs resume (exact and semantic)
- Title/seniority alignment
- Years of experience vs stated minimum
- Location and work-mode match
- Missing keywords that would hurt automated ranking
- Focus on **content gaps**, not layout (txt/docx exports are already ATS-formatted)

**Recruiter (6–30 second screen)**

- Would this resume get a callback for *this* role?
- Strongest 2–3 hooks for this posting
- Red flags: title drift, gaps, overqualification, domain mismatch, location
- Likely first-call questions

**Hiring consultant (strategic fit)**

- Career narrative: does this role advance the candidate?
- True fit vs could-do-it vs stretch vs wrong lane
- What to lead with in outreach; what to de-emphasize
- Honest recommendation with reasoning
- **Personal fit** (if private profile available): remote/hybrid, location, domains, dealbreakers, unstated skills (e.g. Java), compensation floor, energy/motivation — weight these heavily in verdict

### 3. Deliver the report

Follow [report-template.md](report-template.md). Required:

1. **Verdict** — Strong Fit | Moderate Fit | Weak Fit | Pass
2. **Role snapshot**
3. **ATS** — match (low/medium/high), missing keywords, hard filters
4. **Recruiter** — advance yes/no, hooks, concerns
5. **Consultant** — strategic recommendation
6. **Personal fit** — remote, location, interests, dealbreakers (skip if no private profile)
7. **Gap analysis** — table: Requirement | Resume evidence | Gap?
8. **If not a strong fit** — specific resume edits or skip rationale
9. **If applying** — 3 tailored talking points

Be direct. Prefer actionable edits over generic advice.

## Constraints

- Do not edit `resume.mdx` unless explicitly asked to apply suggestions
- Distinguish hard requirements from preferences
- If the posting is incomplete (login wall, truncated fetch), say so and list what you cannot assess

## Follow-ups (optional)

- Tailor summary or bullets for this role
- Draft a short outreach message
- Compare two postings side by side
